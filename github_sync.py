"""
ไฟล์: github_sync.py
คำอธิบาย: สคริปต์สำหรับตรวจสอบการเชื่อมต่อกับ GitHub (Connection & Auth Check)
ขั้นตอนการทำงาน:
  1. โหลดค่าคอนฟิกจากไฟล์ .env
  2. ทดสอบการเชื่อมต่อกับ Repository ปลายทางโดยใช้คำสั่ง 'git ls-remote'
  3. ตรวจสอบว่า Token มีสิทธิ์เข้าถึง และชื่อ Repository ถูกต้องหรือไม่
  4. แจ้งสถานะการเชื่อมต่อ (Success/Failure) กลับไปยังโปรแกรมหลัก
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

def check_connection():
    """ตรวจสอบการเชื่อมต่อกับ GitHub"""
    print("\n🔍 CHECKING GITHUB CONNECTION...")
    env = load_env()
    if not env:
        print("❌ Error: .env file not found.")
        return False

    token = env.get("GITHUB_TOKEN")
    owner = env.get("GITHUB_OWNER")
    repo = env.get("GITHUB_REPO")
    
    if not all([token, owner, repo]):
        print("❌ Error: Missing configuration in .env")
        return False

    # สร้าง Remote URL สำหรับการทดสอบ
    remote_url = f"https://{token}@github.com/{owner}/{repo}.git"

    try:
        # ใช้ git ls-remote เพื่อตรวจสอบว่าเข้าถึง repository ได้จริงหรือไม่ (ไม่ต้องโหลดข้อมูล)
        print(f"📡 Connecting to: https://github.com/{owner}/{repo}...")
        
        # ตรวจสอบเบื้องต้นว่า github.com สามารถเข้าถึงได้หรือไม่ (Network Check)
        result = subprocess.run(
            ["git", "ls-remote", remote_url],
            capture_output=True,
            text=True,
            timeout=15
        )

        if result.returncode == 0:
            print("✅ CONNECTION SUCCESSFUL: Repository found and Token is valid.")
            return True
        else:
            error_msg = result.stderr.lower()
            print("\n" + "!"*30)
            print("❌ CONNECTION FAILED")
            print("!"*30)
            
            if "could not resolve host" in error_msg or "network is unreachable" in error_msg:
                print(">>> สาเหตุ: ปัญหาเครือข่าย (Network Error) กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต")
            elif "repository not found" in error_msg:
                print(f">>> สาเหตุ: ไม่พบ Repository '{repo}' (Repo Not Found)")
                print(f"    - ตรวจสอบชื่อเจ้าของ: {owner}")
                print(f"    - ตรวจสอบชื่อ Repo: {repo}")
            elif "authentication failed" in error_msg or "401" in error_msg:
                print(">>> สาเหตุ: การยืนยันตัวตนล้มเหลว (Token Expired or Invalid)")
                print("    - GITHUB_TOKEN ของคุณอาจหมดอายุ หรือไม่มีสิทธิ์เข้าถึง")
            elif "403" in error_msg:
                print(">>> สาเหตุ: ถูกปฏิเสธการเข้าถึง (Permission Denied/403)")
                print("    - Token อาจจะไม่มีสิทธิ์ 'repo' หรือ 'workflow'")
            elif "remote: help: user not found" in error_msg:
                print(f">>> สาเหตุ: ไม่พบชื่อผู้ใช้ '{owner}' (User Not Found)")
            else:
                print(f">>> สาเหตุอื่นๆ: {result.stderr.strip()}")
            
            print("!"*30 + "\n")
            return False

    except subprocess.TimeoutExpired:
        print("❌ ERROR: Connection timed out. Please check your internet connection.")
        return False
    except Exception as e:
        print(f"❌ SYSTEM ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    if check_connection():
        # คืนค่า exit code 0 หากสำเร็จ
        exit(0)
    else:
        # คืนค่า exit code 1 หากล้มเหลว
        exit(1)
