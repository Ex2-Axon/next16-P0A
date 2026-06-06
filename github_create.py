#!/usr/bin/env python3
"""Initialize a GitHub repository for the current project.

This script reads a local .env file for GitHub credentials and repository settings,
then authenticates with GitHub CLI, creates the repository if needed, initializes
local git, commits existing files, adds origin, and pushes the repository.

Required environment values in .env:
  GITHUB_TOKEN
  GITHUB_OWNER
  GITHUB_REPO

Optional values:
  GITHUB_BRANCH  # default: main

Usage:
  python github_init.py
"""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path
from typing import Dict, Optional


def load_env() -> Optional[Dict[str, str]]:
    """Load environment values from the project .env file."""
    candidates = [Path(__file__).resolve().parent / ".env", Path(__file__).resolve().parent.parent / ".env"]
    env: Dict[str, str] = {}
    for path in candidates:
        if not path.exists():
            continue
        for line in path.read_text(encoding="utf-8").splitlines():
            stripped = line.strip()
            if not stripped or stripped.startswith("#") or "=" not in stripped:
                continue
            key, value = stripped.split("=", 1)
            env[key.strip()] = value.strip().strip('"').strip("'")
        return env
    return None


def ensure_gh_installed() -> bool:
    """Check whether GitHub CLI is available."""
    try:
        subprocess.run(["gh", "--version"], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def run_command(
    command,
    cwd: Path,
    check: bool = True,
    capture_output: bool = False,
    input_data: Optional[bytes] = None,
    env: Optional[Dict[str, str]] = None,
):
    if env is None:
        env = {**os.environ}
    else:
        env = {**env}
    env.setdefault("GIT_TERMINAL_PROMPT", "0")
    return subprocess.run(
        command,
        cwd=str(cwd),
        check=check,
        capture_output=capture_output,
        text=False,
        input=input_data,
        env=env,
    )


def git_initialized(project_dir: Path) -> bool:
    return (project_dir / ".git").exists()


def git_has_commits(project_dir: Path) -> bool:
    try:
        run_command(["git", "rev-parse", "--is-inside-work-tree"], cwd=project_dir, capture_output=True)
        run_command(["git", "rev-parse", "HEAD"], cwd=project_dir, capture_output=True)
        return True
    except subprocess.CalledProcessError:
        return False


def git_has_changes(project_dir: Path) -> bool:
    result = run_command(["git", "status", "--porcelain"], cwd=project_dir, capture_output=True)
    return bool(result.stdout.strip())


def run_github_init() -> None:
    script_dir = Path(__file__).resolve().parent
    print("🆕 Starting GitHub repository initialization...")

    env = load_env()
    if not env:
        print("❌ Error: .env file not found in the project directory.")
        return

    token = env.get("GITHUB_TOKEN")
    owner = env.get("GITHUB_OWNER")
    repo = env.get("GITHUB_REPO")
    branch = env.get("GITHUB_BRANCH", "main")

    if not all([token, owner, repo]):
        print("❌ Error: Missing GITHUB_TOKEN, GITHUB_OWNER, or GITHUB_REPO in .env")
        return

    print("🔑 Using GH_TOKEN for GitHub CLI authentication...")
    gh_env = {**os.environ, "GH_TOKEN": token.strip()}

    try:
        run_command(["gh", "auth", "status", "--hostname", "github.com"], cwd=script_dir, capture_output=True, env=gh_env)
    except subprocess.CalledProcessError:
        print("⚠️ GH_TOKEN is set, but GitHub CLI auth status could not be verified. Continuing with GH_TOKEN environment.")

    # Ensure git is configured to use gh auth credentials if possible
    try:
        run_command(["gh", "auth", "setup-git", "--hostname", "github.com"], cwd=script_dir, capture_output=True, env=gh_env)
    except subprocess.CalledProcessError:
        print("⚠️ Failed to configure git credential helper. Continuing with GH_TOKEN environment.")

    print(f"🛠️ Creating repository: {owner}/{repo}...")
    try:
        run_command(["gh", "repo", "create", f"{owner}/{repo}", "--public", "--confirm"], cwd=script_dir, env=gh_env)
        print(f"✅ Repository '{owner}/{repo}' created.")
    except subprocess.CalledProcessError:
        print("⚠️ Repository may already exist or creation failed. Continuing...")

    if not git_initialized(script_dir):
        print("📁 Initializing local git repository...")
        run_command(["git", "init"], cwd=script_dir)
    else:
        print("📁 Local repository already initialized.")

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
        print("🔗 Remote 'origin' configured.")
    except subprocess.CalledProcessError:
        print("ℹ️ Remote origin already exists. Updating URL.")
        run_command(["git", "remote", "set-url", "origin", remote_url], cwd=script_dir)

    print(f"🚀 Pushing branch '{branch}' to GitHub...")
    run_command(["git", "branch", "-M", branch], cwd=script_dir)
    try:
        run_command(["git", "push", "-u", "origin", branch], cwd=script_dir, env=gh_env, capture_output=True)
        print("✅ Pushed successfully!")
    except subprocess.CalledProcessError as exc:
        print("❌ Push failed.")
        if exc.stderr:
            try:
                print(exc.stderr.decode("utf-8", errors="replace"))
            except Exception:
                pass


if __name__ == "__main__":
    if not ensure_gh_installed():
        print("❌ GitHub CLI is not installed. Please install gh first.")
        sys.exit(1)
    run_github_init()
 