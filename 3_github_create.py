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

def ensure_gh():
    """ตรวจสอบว่ามี gh cli หรือไม่"""
    try:
        subprocess.run("gh --version", shell=True, capture_output=True, check=True)
        return True
    except:
        return False

def run_github_create():
    """ขั้นตอนการสร้าง Repository บน GitHub"""
    print("🆕 Starting GitHub Repo Creation Process...")
    env = load_env()
    if not env:
        print("❌ Error: .env file not found.")
        return

    token = env.get("GITHUB_TOKEN")
    owner = env.get("GITHUB_OWNER")
    repo = env.get("GITHUB_REPO")
    
    if not all([token, owner, repo]):
        print("❌ Error: Missing GITHUB_TOKEN, GITHUB_OWNER, or GITHUB_REPO in .env")
        return

    # ล็อกอินเข้า gh cli ด้วย token
    print("🔑 Authenticating with GitHub CLI...")
    subprocess.run(f"echo {token} | gh auth login --with-token", shell=True)

    # สร้าง Repo
    print(f"🛠️ Creating repository: {owner}/{repo}...")
    # --public หรือ --private ตามต้องการ (ในที่นี้ใช้ --public ตามภาพหน้าจอก่อนหน้า)
    result = subprocess.run(f"gh repo create {owner}/{repo} --public --confirm", shell=True)

    if result.returncode == 0:
        print(f"✅ Repository '{repo}' created successfully!")
        
        # ตั้งค่า Remote อัตโนมัติ
        remote_url = f"https://{token}@github.com/{owner}/{repo}.git"
        subprocess.run(f"git remote add origin {remote_url}", shell=True, cwd=str(Path(__file__).parent))
        print("🔗 Remote 'origin' added.")
    else:
        print("❌ Repo creation failed or already exists.")

if __name__ == "__main__":
    if not ensure_gh():
        print("❌ Error: GitHub CLI (gh) is not installed. Please install it first.")
    else:
        run_github_create()
