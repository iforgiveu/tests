@echo off
setlocal

where node >nul 2>&1
if errorlevel 1 (
  echo node not found. Install Node.js 20+ first.
  exit /b 1
)

where pnpm >nul 2>&1
if errorlevel 1 (
  echo pnpm not found. Install Node.js 20+ and pnpm first.
  exit /b 1
)

where cargo >nul 2>&1
if errorlevel 1 (
  echo cargo not found. Install Rust first.
  exit /b 1
)

call pnpm install
if errorlevel 1 exit /b %errorlevel%

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\build-windows.ps1" -Edition Core
exit /b %errorlevel%
