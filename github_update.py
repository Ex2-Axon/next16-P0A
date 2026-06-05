"""
ไฟล์: github_update.py
คำอธิบาย: สคริปต์สำหรับตรวจสอบสถานะความแตกต่างระหว่าง Local และ GitHub
ขั้นตอนการทำงาน:
  1. โหลดค่าคอนฟิกจากไฟล์ .env
  2. รัน 'git fetch' เพื่อดึงข้อมูลสถานะล่าสุดจาก Remote (ยังไม่มีการโหลดไฟล์)
  3. เปรียบเทียบตำแหน่งของ Local Branch และ Remote Branch
  4. รายงานสถานะว่า:
     - Up to date: ข้อมูลตรงกัน
     - Behind: มีข้อมูลใหม่บน GitHub ที่ยังไม่ได้โหลดลงมา
     - Ahead: มีข้อมูลใหม่บน Local ที่ยังไม่ได้ Push ขึ้นไป
     - Diverged: มีข้อมูลใหม่ทั้งสองฝั่ง (ต้อง Merge)
"""

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
    env_path = Path(__file__).parent / ".env"
    if env_path.exists():
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if "=" in line and not line.startswith("#"):
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip().strip('"').strip("'")
        return env
    return None

def check_status():
    """ตรวจสอบสถานะเปรียบเทียบกับ GitHub"""
    print("\n🔄 CHECKING FOR UPDATES...")
    env = load_env()
    if not env:
        print("❌ Error: .env file not found.")
        return

    token = env.get("GITHUB_TOKEN")
    owner = env.get("GITHUB_OWNER")
    repo = env.get("GITHUB_REPO")
    branch = env.get("GITHUB_BRANCH", "main")
    
    if not all([token, owner, repo]):
        print("❌ Error: Missing configuration in .env")
        return

    # สร้าง Remote URL ที่มี Token
    remote_url = f"https://{token}@github.com/{owner}/{repo}.git"
    cwd = str(Path(__file__).parent)

    try:
        # 1. Fetch ข้อมูลล่าสุดจาก remote (ไม่ส่งผลต่อไฟล์ในเครื่อง)
        print(f"📡 Fetching latest status from {owner}/{repo}...")
        subprocess.run(["git", "fetch", remote_url, branch], capture_output=True, check=True, cwd=cwd)

        # 2. ตรวจสอบสถานะเปรียบเทียบระหว่าง Local และ Remote
        # ใช้ git rev-list เพื่อเปรียบเทียบ commit
        local_hash = subprocess.check_output(["git", "rev-parse", "HEAD"], text=True, cwd=cwd).strip()
        remote_hash = subprocess.check_output(["git", "rev-parse", "FETCH_HEAD"], text=True, cwd=cwd).strip()

        if local_hash == remote_hash:
            print("✅ STATUS: UP TO DATE. Everything is synchronized.")
        else:
            # ตรวจสอบว่าเป็น Ahead หรือ Behind
            behind_count = int(subprocess.check_output(["git", "rev-list", "--count", f"HEAD..FETCH_HEAD"], text=True, cwd=cwd).strip())
            ahead_count = int(subprocess.check_output(["git", "rev-list", "--count", f"FETCH_HEAD..HEAD"], text=True, cwd=cwd).strip())

            if behind_count > 0 and ahead_count == 0:
                print(f"📥 STATUS: BEHIND. GitHub has {behind_count} new commit(s). Please PULL.")
            elif ahead_count > 0 and behind_count == 0:
                print(f"📤 STATUS: AHEAD. Local has {ahead_count} new commit(s). Please PUSH.")
            else:
                print(f"⚠️ STATUS: DIVERGED. Both sides have different new commits ({ahead_count} ahead, {behind_count} behind). Merge required.")

    except subprocess.CalledProcessError as e:
        print(f"❌ ERROR: Git operation failed. (Is this a Git repository?)")
    except Exception as e:
        print(f"❌ SYSTEM ERROR: {str(e)}")

if __name__ == "__main__":
    check_status()
