@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title Axon GitHub Manager
cd /d "%~dp0"

python --version >nul 2>&1
if !ERRORLEVEL! NEQ 0 (
    echo [ERROR] Python not found.
    pause
    exit /b
)

git --version >nul 2>&1
if !ERRORLEVEL! NEQ 0 (
    echo [ERROR] Git not found.
    pause
    exit /b
)

if not exist ".env" (
    python setup_env_ui.py
)

if not exist ".env" (
    echo [ERROR] Config missing.
    pause
    exit /b
)

python github_sync.py
if !ERRORLEVEL! NEQ 0 (
    echo [ERROR] Connection failed.
    python setup_env_ui.py
)

python github_ui.py
if !ERRORLEVEL! NEQ 0 (
    echo [ERROR] UI failed.
    pause
)
