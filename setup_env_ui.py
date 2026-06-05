"""
ไฟล์: setup_env_ui.py
คำอธิบาย: หน้าจอสำหรับตั้งค่าไฟล์ .env ครั้งแรก (Initial Setup)
ขั้นตอนการทำงาน:
  1. รับข้อมูลจากผู้ใช้ผ่านช่องกรอก (Token, Owner, Repo, Branch)
  2. ตรวจสอบความครบถ้วนของข้อมูล
  3. บันทึกข้อมูลลงในไฟล์ .env ในโฟลเดอร์เดียวกัน
  4. ปิดหน้าต่างตัวเองเพื่อให้โปรแกรมหลักรันต่อได้
"""

import tkinter as tk
from tkinter import messagebox
import sys
from pathlib import Path

# ป้องกันปัญหา UnicodeEncodeError ใน Windows CMD
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

class EnvSetupUI:
    def __init__(self, root):
        """
        เริ่มต้นหน้าจอตั้งค่า
        """
        self.root = root
        self.root.title("GitHub Configuration Setup")
        self.root.geometry("450x450")
        self.root.configure(bg="#0d1117")
        self.root.resizable(False, False)

        # กำหนดตำแหน่งไฟล์ .env ที่จะสร้าง
        self.env_path = Path(__file__).parent / ".env"
        self.setup_ui()

    def setup_ui(self):
        """
        สร้างส่วนประกอบ UI สำหรับกรอกข้อมูล
        """
        # ส่วนหัว
        tk.Label(
            self.root, 
            text="⚙️ INITIAL SETUP", 
            font=("Segoe UI", 16, "bold"),
            bg="#0d1117",
            fg="#58a6ff",
            pady=20
        ).pack()

        tk.Label(
            self.root, 
            text="Please enter your GitHub details to create .env file", 
            font=("Segoe UI", 9),
            bg="#0d1117",
            fg="#8b949e"
        ).pack(pady=(0, 20))

        # สร้างช่องกรอกข้อมูลตามรายการที่กำหนด
        self.entries = {}
        fields = [
            ("GITHUB_TOKEN", "Personal Access Token"),
            ("GITHUB_OWNER", "GitHub Username/Owner"),
            ("GITHUB_REPO", "Repository Name"),
            ("GITHUB_BRANCH", "Branch (default: main)")
        ]

        for key, label in fields:
            frame = tk.Frame(self.root, bg="#0d1117", padx=40)
            frame.pack(fill="x", pady=5)
            
            tk.Label(frame, text=label, bg="#0d1117", fg="#c9d1d9", font=("Segoe UI", 9, "bold")).pack(anchor="w")
            entry = tk.Entry(frame, bg="#010409", fg="white", insertbackground="white", borderwidth=1, relief="flat")
            entry.pack(fill="x", ipady=5, pady=2)
            
            # กำหนดค่าเริ่มต้นสำหรับ Branch
            if key == "GITHUB_BRANCH":
                entry.insert(0, "main")
            
            self.entries[key] = entry

        # ปุ่มสำหรับบันทึกข้อมูล
        tk.Button(
            self.root, 
            text="💾 SAVE CONFIGURATION", 
            bg="#238636", 
            fg="white", 
            font=("Segoe UI", 10, "bold"),
            relief="flat",
            cursor="hand2",
            command=self.save_env,
            pady=10
        ).pack(pady=30, padx=40, fill="x")

    def save_env(self):
        """
        อ่านข้อมูลจาก UI และบันทึกลงไฟล์ .env
        """
        data = {key: entry.get().strip() for key, entry in self.entries.items()}
        
        # ตรวจสอบว่าข้อมูลสำคัญถูกกรอกครบถ้วน
        if not data["GITHUB_TOKEN"] or not data["GITHUB_OWNER"] or not data["GITHUB_REPO"]:
            messagebox.showwarning("Incomplete Data", "Please fill in Token, Owner, and Repository fields.")
            return

        try:
            # เขียนข้อมูลลงไฟล์ .env
            with open(self.env_path, "w", encoding="utf-8") as f:
                f.write("# GitHub Configuration\n")
                for key, value in data.items():
                    f.write(f"{key}={value}\n")
            
            messagebox.showinfo("Success", "Configuration saved successfully!")
            # ปิดหน้าต่างเพื่อให้ไฟล์ .bat ดำเนินการขั้นตอนถัดไป
            self.root.destroy()
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save .env: {e}")

if __name__ == "__main__":
    root = tk.Tk()
    app = EnvSetupUI(root)
    root.mainloop()

