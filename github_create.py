"""Create a GitHub repository and push local files automatically.

This script looks for a .env file next to the script or in its parent directory.
Required environment variables:
  GITHUB_TOKEN
  GITHUB_OWNER
  GITHUB_REPO

It will:
  1. authenticate with GitHub CLI
  2. create the remote repository
  3. initialize git locally if needed
  4. add and commit files if there are changes
  5. push the branch to origin
"""

import subprocess
import sys
from pathlib import Path
from typing import Dict, Optional


# Prevent Windows CMD unicode issues
if sys.platform == "win32":
    import io

    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")


def load_env() -> Optional[Dict[str, str]]:
    """Load environment values from .env files."""
    env: Dict[str, str] = {}
    search_paths = [Path(__file__).resolve().parent / ".env", Path(__file__).resolve().parent.parent / ".env"]
    for p in search_paths:
        if p.exists():
            with p.open("r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    key, value = line.split("=", 1)
                    env[key.strip()] = value.strip().strip('"').strip("'")
            return env
    return None


def ensure_gh() -> bool:
    """Verify GitHub CLI is installed."""
    try:
        subprocess.run(["gh", "--version"], capture_output=True, check=True)
        return True
    except subprocess.CalledProcessError:
        return False
    except FileNotFoundError:
        return False


def run_command(command, cwd: Path, check: bool = True, capture_output: bool = False, input_data: Optional[bytes] = None):
    return subprocess.run(
        command,
        cwd=str(cwd),
        check=check,
        capture_output=capture_output,
        text=False,
        input=input_data,
    )


def git_initialized(repo_dir: Path) -> bool:
    return (repo_dir / ".git").exists()


def git_has_commits(repo_dir: Path) -> bool:
    try:
        run_command(["git", "rev-parse", "--is-inside-work-tree"], cwd=repo_dir)
        run_command(["git", "rev-parse", "HEAD"], cwd=repo_dir, check=True)
        return True
    except subprocess.CalledProcessError:
        return False


def git_has_changes(repo_dir: Path) -> bool:
    result = run_command(["git", "status", "--porcelain"], cwd=repo_dir, capture_output=True, check=True)
    return bool(result.stdout.strip())


def run_github_create() -> None:
    """Create the GitHub repository and publish the local project."""
    script_dir = Path(__file__).resolve().parent
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

    print("🔑 Authenticating with GitHub CLI...")
    try:
        run_command(["gh", "auth", "login", "--with-token"], cwd=script_dir, input_data=token.encode("utf-8"))
    except subprocess.CalledProcessError as exc:
        print("❌ GitHub authentication failed.")
        print(exc)
        return

    print(f"🛠️ Creating repository: {owner}/{repo}...")
    try:
        run_command(["gh", "repo", "create", f"{owner}/{repo}", "--public", "--confirm"], cwd=script_dir)
        print(f"✅ Repository '{owner}/{repo}' created successfully!")
    except subprocess.CalledProcessError:
        print("⚠️ Repository creation failed or already exists. Continuing if remote already exists.")

    if not git_initialized(script_dir):
        print("📁 Initializing local git repository...")
        run_command(["git", "init"], cwd=script_dir)
    else:
        print("📁 Local git repository already initialized.")

    if not git_has_commits(script_dir):
        print("📝 Creating initial commit...")
        run_command(["git", "add", "."], cwd=script_dir)
        run_command(["git", "commit", "-m", "Initial commit"], cwd=script_dir)
    else:
        print("📝 Local repository already has commits.")
        if git_has_changes(script_dir):
            print("🛠️ Staging and committing local changes...")
            run_command(["git", "add", "."], cwd=script_dir)
            run_command(["git", "commit", "-m", "Update project files"], cwd=script_dir)

    remote_url = f"https://github.com/{owner}/{repo}.git"
    try:
        run_command(["git", "remote", "add", "origin", remote_url], cwd=script_dir)
        print("🔗 Remote 'origin' added.")
    except subprocess.CalledProcessError:
        print("ℹ️ Remote 'origin' already exists, skipping remote add.")

    print("🚀 Pushing to GitHub...")
    run_command(["git", "branch", "-M", "main"], cwd=script_dir)
    try:
        run_command(["git", "push", "-u", "origin", "main"], cwd=script_dir)
        print("✅ Code pushed to GitHub successfully!")
    except subprocess.CalledProcessError as exc:
        print("❌ Failed to push to GitHub.")
        print(exc)


if __name__ == "__main__":
    if not ensure_gh():
        print("❌ Error: GitHub CLI (gh) is not installed. Please install it first.")
    else:
        run_github_create()
