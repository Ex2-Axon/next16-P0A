"""
ไฟล์: github_ui.py
คำอธิบาย: หน้าจอหลัก (Main UI) สำหรับจัดการ GitHub Repository ของ x-template
ความสามารถ:
  - แสดงผลในรูปแบบ Dark Mode สไตล์ GitHub
  - มีปุ่มทางลัดสำหรับ Push, Pull และ Create Repository
  - มีหน้าจอ Console แสดงผลการทำงานแบบ Real-time
  - รองรับการทำงานแบบ Multi-threading (หน้าจอไม่ค้างขณะรันคำสั่ง)
"""

import tkinter as tk
from tkinter import messagebox, scrolledtext
import subprocess
import sys
import os
import threading
from pathlib import Path

# ป้องกันปัญหา UnicodeEncodeError ใน Windows CMD
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

class GitHubManagerUI:
    def __init__(self, root):
        """
        เริ่มต้นการตั้งค่าหน้าจอหลัก
        """
        self.root = root
        self.root.title("Axon GitHub Manager (x-template)")
        self.root.geometry("600x500")
        self.root.configure(bg="#0d1117")  # สีพื้นหลัง Dark Mode ของ GitHub
        self.root.resizable(False, False)

        # กำหนดตำแหน่งโฟลเดอร์ของสคริปต์
        self.script_dir = Path(__file__).parent

        # เรียกใช้งานส่วนประกอบ UI
        self.setup_ui()

    def setup_ui(self):
        """
        สร้างและจัดวางส่วนประกอบต่างๆ บนหน้าจอ
        """
        # ส่วนหัว (Header) พร้อมโลโก้
        header_frame = tk.Frame(self.root, bg="#161b22", pady=10) # ลด pady จาก 20 เป็น 10
        header_frame.pack(fill="x")

        # โลโก้ GitHub แบบ ASCII (ย่อขนาดฟอนต์ลงเล็กน้อย)
        logo_label = tk.Label(
            header_frame, 
            text="""
     ██████  ██ ████████ ██   ██ ██    ██ ██████  
    ██       ██    ██    ██   ██ ██    ██ ██   ██ 
    ██   ███ ██    ██    ███████ ██    ██ ██████  
    ██    ██ ██    ██    ██   ██ ██    ██ ██   ██ 
     ██████  ██    ██    ██   ██  ██████  ██████  
            """,
            font=("Courier New", 7, "bold"), # ลดขนาดจาก 8 เป็น 7
            bg="#161b22",
            fg="#58a6ff",
            justify="left"
        )
        logo_label.pack()

        title_label = tk.Label(
            header_frame, 
            text="X-TEMPLATE MANAGER", 
            font=("Segoe UI", 10, "bold"), # ลดขนาดจาก 12 เป็น 10
            bg="#161b22",
            fg="#c9d1d9"
        )
        title_label.pack(pady=(2, 0))

        # ส่วนของปุ่มคำสั่ง (Buttons Frame)
        btn_frame = tk.Frame(self.root, bg="#0d1117", pady=5) # ลด pady จาก 10 เป็น 5
        btn_frame.pack()

        # ปรับขนาดปุ่มให้เล็กลงและจัดเรียงใหม่แบบ 2 คอลัมน์เพื่อให้ประหยัดพื้นที่แนวตั้ง
        grid_frame = tk.Frame(btn_frame, bg="#0d1117")
        grid_frame.pack()

        self.create_grid_button(grid_frame, "🔍 CHECK UPDATES", "#8b949e", self.run_update, 0, 0)
        self.create_grid_button(grid_frame, "🚀 PUSH GITHUB", "#238636", self.run_push, 0, 1)
        self.create_grid_button(grid_frame, "📥 PULL GITHUB", "#1f6feb", self.run_pull, 1, 0)
        self.create_grid_button(grid_frame, "🆕 CREATE REPO", "#8957e5", self.run_create, 1, 1)

        # ส่วนแสดงผลสถานะ (Output Console) - ขยายขนาดให้กว้างขึ้น
        console_label = tk.Label(
            self.root, 
            text="STATUS CONSOLE", 
            font=("Segoe UI", 8, "bold"),
            bg="#0d1117",
            fg="#8b949e"
        )
        console_label.pack(anchor="w", padx=20, pady=(10, 0))

        self.console = scrolledtext.ScrolledText(
            self.root, 
            width=80,  # เพิ่มความกว้างจาก 70 เป็น 80
            height=18, # เพิ่มความสูงจาก 12 เป็น 18
            bg="#010409", 
            fg="#3fb950", 
            font=("Consolas", 9),
            borderwidth=0
        )
        self.console.pack(padx=10, pady=(0, 10), fill="both", expand=True)
        self.log("System Ready. Waiting for action...")

    def create_grid_button(self, parent, text, color, command, row, col):
        """
        ฟังก์ชันช่วยสร้างปุ่มในรูปแบบ Grid เพื่อประหยัดพื้นที่
        """
        btn = tk.Button(
            parent, 
            text=text, 
            bg=color, 
            fg="white", 
            font=("Segoe UI", 9, "bold"),
            width=20, # ลดความกว้างจาก 25 เป็น 20
            height=1, # ลดความสูงจาก 2 เป็น 1
            relief="flat",
            cursor="hand2",
            command=command
        )
        btn.grid(row=row, column=col, padx=5, pady=3)
        return btn

    def log(self, message):
        """
        แสดงข้อความลงใน Console บนหน้าจอ
        """
        self.console.insert(tk.END, f"> {message}\n")
        self.console.see(tk.END)

    def run_script(self, script_name):
        """
        รันสคริปต์ภายนอกและดึงผลลัพธ์มาแสดงผลบนหน้าจอแบบ Real-time
        รันใน Thread แยกเพื่อไม่ให้ UI ค้าง
        """
        script_path = self.script_dir / script_name
        if not script_path.exists():
            messagebox.showerror("Error", f"Script not found: {script_name}")
            return

        self.log(f"Executing {script_name}...")
        
        def task():
            try:
                # เริ่มต้นกระบวนการรันสคริปต์
                env = os.environ.copy()
                env["PYTHONIOENCODING"] = "utf-8"
                
                process = subprocess.Popen(
                    [sys.executable, str(script_path)],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    shell=False,  # เปลี่ยนเป็น False เพื่อความถูกต้องบน Windows
                    bufsize=1,
                    universal_newlines=True,
                    encoding='utf-8',
                    env=env
                )

                # อ่านผลลัพธ์จากสคริปต์ทีละบรรทัดและส่งไปแสดงผลบน UI
                for line in process.stdout:
                    self.root.after(0, self.log, line.strip())
                
                process.wait()
                if process.returncode == 0:
                    self.root.after(0, self.log, f"✅ {script_name} completed successfully.")
                else:
                    self.root.after(0, self.log, f"❌ {script_name} failed with exit code {process.returncode}.")
            except Exception as e:
                self.root.after(0, self.log, f"❌ System Error: {str(e)}")

        # เริ่มต้นการทำงานในพื้นหลัง (Thread)
        threading.Thread(target=task, daemon=True).start()

    def run_push(self):
        """เรียกใช้งาน github_push.py"""
        self.run_script("github_push.py")

    def run_pull(self):
        """เรียกใช้งาน github_pull.py"""
        self.run_script("github_pull.py")

    def run_update(self):
        """เรียกใช้งาน github_update.py"""
        self.run_script("github_update.py")

    def run_create(self):
        """เรียกใช้งาน github_create.py"""
        self.run_script("github_create.py")

if __name__ == "__main__":
    try:
        root = tk.Tk()
        app = GitHubManagerUI(root)
        root.mainloop()
    except Exception as e:
        import traceback
        with open("ui_error.log", "w", encoding="utf-8") as f:
            traceback.print_exc(file=f)
        print(f"FATAL ERROR: {e}")
        input("Press Enter to exit...")


