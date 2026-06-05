#!/usr/bin/env python3
"""Automate project setup for the current repo root.

This script dynamically detects the current root folder name and updates
`vite.config.ts`, `.github/workflows/screenshot.yml`, and source files accordingly.
It also deletes legacy artifacts, copies the template app file, cleans ALL unused 
imports (Hooks, Icons) and unused React setStates to prevent TypeScript build errors.
It terminates immediately and successfully after a completed production build.
"""

from __future__ import annotations

import os
import re
import shutil
import subprocess
import sys
from pathlib import Path


def replace_in_file(path: Path, pattern: re.Pattern, repl: str) -> bool:
    content = path.read_text(encoding='utf-8')
    new_content = pattern.sub(repl, content)
    if new_content != content:
        path.write_text(new_content, encoding='utf-8')
        print(f"Updated {path}")
        return True
    print(f"No changes needed in {path}")
    return False


def clean_unused_imports(app_path: Path) -> None:
    """สแกนหาและลบตัวแปรใน { ... } จากทุกๆ import statement ที่ไม่ได้ถูกเรียกใช้จริงในไฟล์"""
    if not app_path.exists():
        return

    content = app_path.read_text(encoding='utf-8')
    import_pattern = re.compile(r"import\s+(?:[^'\"]*?)\{\s*([^}]+)\s*\}\s+from\s+(['\"])([^'\"]+)\2\s*;", re.DOTALL)
    
    matches = list(import_pattern.finditer(content))
    if not matches:
        return

    content_without_imports = content
    for match in matches:
        content_without_imports = content_without_imports.replace(match.group(0), "")

    modified_content = content
    has_changes = False

    for match in matches:
        full_import_statement = match.group(0)
        items_block = match.group(1)
        quote = match.group(2)
        module_name = match.group(3)
        
        all_items = [item.strip() for item in re.split(r'[\s,]+', items_block) if item.strip()]
        active_items = []

        for item in all_items:
            if re.search(r'\b' + re.escape(item) + r'\b', content_without_imports):
                active_items.append(item)
            else:
                print(f"🧹 Detected unused import item: '{item}'. Removing to prevent TypeScript error.")
                has_changes = True

        if len(active_items) != len(all_items):
            if active_items:
                if len(active_items) > 5:
                    new_import_line = f"import {{\n  " + ",\n  ".join(active_items) + f"\n}} from {quote}{module_name}{quote};"
                else:
                    new_import_line = f"import {{ {', '.join(active_items)} }} from {quote}{module_name}{quote};"
            else:
                new_import_line = ""

            modified_content = modified_content.replace(full_import_statement, new_import_line)

    if has_changes:
        modified_content = re.sub(r'\n\s*\n\s*\n', '\n\n', modified_content)
        app_path.write_text(modified_content, encoding='utf-8')
        print(f"✨ Successfully cleaned all unused imports in {app_path.name}")


def clean_unused_states(app_path: Path) -> None:
    """สแกนหาและแก้ไขเซ็ตเตอร์ของ useState ที่ไม่ได้ใช้งาน"""
    if not app_path.exists():
        return

    content = app_path.read_text(encoding='utf-8')
    state_pattern = re.compile(r"const\s*\[\s*([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s*\]\s*=\s*useState")
    
    modified_content = content
    has_changes = False
    
    for match in state_pattern.finditer(content):
        state_var = match.group(1)
        set_state_var = match.group(2)
        
        matches_count = len(re.findall(r'\b' + re.escape(set_state_var) + r'\b', content))
        
        if matches_count <= 1:
            print(f"🧹 Detected unused state setter: '{set_state_var}'. Fixing to prevent TypeScript error.")
            old_declaration = match.group(0)
            new_declaration = old_declaration.replace(f"{state_var}, {set_state_var}", state_var).replace(f"{state_var},{set_state_var}", state_var)
            modified_content = modified_content.replace(old_declaration, new_declaration)
            has_changes = True
            
    if has_changes:
        app_path.write_text(modified_content, encoding='utf-8')
        print(f"✨ Successfully cleaned all unused local states in {app_path.name}")


def run_command(command: list[str], cwd: Path) -> None:
    print(f"Running: {' '.join(command)}")
    use_shell = os.name == 'nt'
    # ใช้ subprocess.run ปกติเพื่อให้รู้ผลลัพธ์การรันทันทีว่า ผ่าน หรือ พัง
    subprocess.run(command, cwd=cwd, check=True, shell=use_shell)


def main() -> None:
    current_dir = Path(__file__).resolve().parent
    project_root = current_dir.parent if current_dir.name == 'scripts' else current_dir
    project_name = project_root.name

    print(f"Project root: {project_root}")
    print(f"Detected project name: {project_name}")

    vite_config = project_root / 'vite.config.ts'
    github_workflow = project_root / '.github' / 'workflows' / 'screenshot.yml'
    screenshots_dir = project_root / '.github' / 'screenshots'
    app_src = project_root / 'src' / 'App.tsx'
    source_template = project_root / 'scripts' / 'x-template-special.tsx'
    target_app = project_root / 'src' / 'App.tsx'

    # 1. แก้ไข Vite Config
    if vite_config.exists():
        base_pattern = re.compile(r"(base:\s*')[^']+(')")
        replace_in_file(vite_config, base_pattern, rf"\1/{project_name}\2")
    else:
        print(f"Warning: {vite_config} not found. Skipping Vite base update.")

    # 2. แก้ไข GitHub Workflow URLs
    if github_workflow.exists():
        url_pattern = re.compile(
            r"https://(?P<host>[^/]+)/(x-template(?:-special)?-[^/'\"\s]+)(?P<suffix>/?)"
        )
        content = github_workflow.read_text(encoding='utf-8')
        replaced_content = url_pattern.sub(
            lambda m: f"https://{m.group('host')}/{project_name}{m.group('suffix')}",
            content,
        )
        if replaced_content != content:
            github_workflow.write_text(replaced_content, encoding='utf-8')
            print(f"Updated URLs in {github_workflow}")
        else:
            print(f"No target URLs changed in {github_workflow}")
    else:
        print(f"Warning: {github_workflow} not found. Skipping workflow URL update.")

    # 3. ลบโฟลเดอร์เก่าและไฟล์เก่า
    if screenshots_dir.exists():
        shutil.rmtree(screenshots_dir)
        print(f"Deleted existing directory: {screenshots_dir}")
    else:
        print(f"No screenshots directory to delete at {screenshots_dir}")

    if app_src.exists():
        app_src.unlink()
        print(f"Deleted existing file: {app_src}")
    else:
        print(f"No existing App.tsx found at {app_src}")

    # 4. คัดลอกไฟล์ Template
    if not source_template.exists():
        print(f"Error: Template source file not found: {source_template}")
        sys.exit(1)

    target_app.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source_template, target_app)
    print(f"Copied {source_template} to {target_app}")

    # คลีนตัวแปรและ Import ทุกรูปแบบก่อนเอาไป Build
    clean_unused_imports(target_app)
    clean_unused_states(target_app)

    # 5. สั่งรันคำสั่งเรียงตามลำดับ (เอาคำสั่ง dev ออกอย่างเด็ดขาดแล้ว)
    try:
        run_command(['npm', 'install'], cwd=project_root)
        run_command(['npm', 'run', 'build'], cwd=project_root)
        print("\n🎉 [SUCCESS] Build passed perfectly!")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ [FAILED] Build process broke or failed: {e}")
        sys.exit(1)

    print("All tasks are done. Python closing successfully.")
    sys.exit(0)


if __name__ == '__main__':
    main()