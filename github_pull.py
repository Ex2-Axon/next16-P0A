import os
import subprocess
import sys
from pathlib import Path

# ป้องกันปัญหา UnicodeEncodeError ใน Windows CMD
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

def load_env():
    """โหลดข้อมูลจาก .env"""
    env = {}
    search_paths = [Path(__file__).parent / ".env", Path(__file__).parent.parent / ".env"]
    for p in search_paths:
        if p.exists():
            with open(p, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if "=" in line and not line.startswith("#"):
                        k, v = line.split("=", 1)
                        env[k.strip()] = v.strip().strip('"').strip("'")
            return env
    return None

def run_git_pull():
    """ขั้นตอนการ Pull งานจาก GitHub"""
    print("📥 Starting GitHub Pull Process...", flush=True)
    env = load_env()
    if not env:
        print("❌ Error: .env file not found.", flush=True)
        return

    token = env.get("GITHUB_TOKEN")
    owner = env.get("GITHUB_OWNER")
    repo = env.get("GITHUB_REPO")
    branch = env.get("GITHUB_BRANCH", "main")
    
    if not all([token, owner, repo]):
        print("❌ Error: Missing GITHUB_TOKEN, GITHUB_OWNER, or GITHUB_REPO in .env", flush=True)
        return

    # กำหนด path ของ x-template
    target_dir = Path(__file__).parent
    
    # ตรวจสอบว่าเป็น Git Repo หรือยัง
    if not (target_dir / ".git").exists():
        print("⚠️ Not a git repository. Initializing...", flush=True)
        subprocess.run("git init", shell=True, cwd=str(target_dir))
        print("✅ Git initialized.", flush=True)

    # ตรวจสอบ Remote
    remote_url = f"https://{token}@github.com/{owner}/{repo}.git"
    print(f"📡 Checking remote: https://github.com/{owner}/{repo}", flush=True)
    
    # ตรวจสอบไฟล์ใน Remote ก่อน (แค่แสดงให้ดู)
    print("📋 Fetching remote status...", flush=True)
    subprocess.run(f"git ls-remote {remote_url}", shell=True, cwd=str(target_dir))

    # ดึงข้อมูลล่าสุด
    print(f"🔄 Pulling from {branch}...", flush=True)
    # ใช้ fetch + reset --hard เพื่อให้ไฟล์ในเครื่องตรงกับบน GitHub 100% 
    # (ป้องกันกรณีไฟล์ถูกลบแต่ git คิดว่า up to date)
    subprocess.run(f"git fetch {remote_url} {branch}", shell=True, cwd=str(target_dir))
    result = subprocess.run(f"git reset --hard FETCH_HEAD", shell=True, cwd=str(target_dir))
    
    if result.returncode == 0:
        print("✅ Pull and Restore successful!", flush=True)
        # แสดงรายการไฟล์ที่ดึงมา
        print("\n📂 Current files in folder:", flush=True)
        file_count = 0
        for item in target_dir.glob("*"):
            if item.name != ".git":
                print(f"  - {item.name}", flush=True)
                file_count += 1
        print(f"\nTotal: {file_count} items (excluding .git)", flush=True)
    else:
        print("❌ Pull failed. Please check your token permissions or network.", flush=True)

if __name__ == "__main__":
    run_git_pull()
