#!/usr/bin/env python3
"""
Check and automatically fix the `name` field in package.json to match the
repository folder name, and ensure the `playwright` devDependency exists.

Usage:
    python tools/fix_package_name.py --root .         # updates package.json by default
    python tools/fix_package_name.py --root . --dry-run # shows suggested changes without applying

Behavior summary:
- Derives the expected package `name` from the project folder name and
    sanitizes it to a safe npm-style identifier.
- If the `name` in `package.json` does not match the sanitized folder name,
    the script will update the `name` field.
- The script also checks for a `playwright` dependency; if missing it will
    add `playwright` with version `^1.60.0` into `devDependencies`.

The script prints suggested changes and supports `--dry-run` to preview
changes without writing to disk.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Optional


def sanitize_name(name: str) -> str:
    # Convert a raw folder name into a safe npm package name.
    # Steps:
    # 1. Trim whitespace and lowercase.
    # 2. Replace spaces with dashes.
    # 3. Replace any character not in the allowed set with a dash.
    # 4. Collapse repeated dashes into a single dash.
    # 5. Remove any leading/trailing characters that are not alphanumeric.
    # 6. If result is empty, fall back to 'project'.
    n = name.strip().lower()
    n = n.replace(' ', '-')
    n = re.sub(r'[^a-z0-9._-]', '-', n)
    n = re.sub(r'-{2,}', '-', n)
    n = re.sub(r'^[^a-z0-9]+', '', n)
    n = re.sub(r'[^a-z0-9]+$', '', n)
    if not n:
        n = 'project'
    return n


def load_package_json(path: Path) -> Optional[dict]:
    # Read and parse package.json, returning a dict or None on failure.
    if not path.exists():
        print('package.json not found at', path)
        return None
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except Exception as e:
        # Print the error for debugging and return None so the caller can exit.
        print('Failed to read package.json:', e)
        return None


def write_package_json(path: Path, data: dict) -> bool:
    # Serialize the package.json data back to the file with stable formatting.
    try:
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
        print('Wrote package.json successfully.')
        return True
    except Exception as e:
        # On write errors (permission, disk full, etc.) print error and return False.
        print('Failed to write package.json:', e)
        return False


def main() -> int:
    ap = argparse.ArgumentParser(description='Fix package.json name to match project folder')
    ap.add_argument('--root', default=None, help='Project root (default: script directory)')
    ap.add_argument('--dry-run', action='store_true', help='Show suggested name without applying changes')
    args = ap.parse_args()

    # Determine the repository root and package.json path.
    script_dir = Path(__file__).resolve().parent
    repo_root = Path(args.root).resolve() if args.root else script_dir
    pkg_path = repo_root / 'package.json'

    # Load existing package.json content.
    data = load_package_json(pkg_path)
    if data is None:
        # Non-zero return indicates failure to the caller.
        return 2

    # Current name value (may be None) and expected name derived from folder.
    current = data.get('name')
    expected_raw = repo_root.name
    expected = sanitize_name(expected_raw)

    print('Repository folder name:', repo_root.name)
    print('Sanitized expected package name:', expected)
    print('Current package.json name:', current)

    # Determine whether a name change is required.
    name_change_needed = current != expected

    # Check for playwright dependency presence in either dependencies or devDependencies.
    playwright_key = 'playwright'
    playwright_version = '^1.60.0'
    deps = data.get('dependencies') or {}
    dev_deps = data.get('devDependencies') or {}
    has_playwright = playwright_key in deps or playwright_key in dev_deps
    playwright_missing = not has_playwright

    # If nothing to change, exit early.
    if not name_change_needed and not playwright_missing:
        print('No changes needed. package.json is up to date.')
        return 0

    # Show suggested changes to the user.
    print('\nSuggested changes:')
    if name_change_needed:
        print(f'  "name": "{current}" -> "{expected}"')
    if playwright_missing:
        print(f'  add devDependency: "{playwright_key}": "{playwright_version}"')

    # Respect dry-run: do not write any file changes when requested.
    if args.dry_run:
        print('\nDry run enabled. No file changes were made.')
        return 0

    # Apply the actual changes to the in-memory data structure.
    if name_change_needed:
        data['name'] = expected

    if playwright_missing:
        # Ensure devDependencies object exists, then set playwright.
        if 'devDependencies' not in data or data.get('devDependencies') is None:
            data['devDependencies'] = {}
        data['devDependencies'][playwright_key] = playwright_version
        print(f'Added devDependency {playwright_key}@{playwright_version}')

    # Write updated package.json back to disk.
    success = write_package_json(pkg_path, data)
    return 0 if success else 3


if __name__ == '__main__':
    raise SystemExit(main())
