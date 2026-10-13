@echo off
setlocal

where pnpm >nul 2>&1
if errorlevel 1 (
  echo pnpm not found. Install Node.js 20+ and pnpm first.
  exit /b 1
)

call pnpm install
if errorlevel 1 exit /b %errorlevel%

call pnpm test
exit /b %errorlevel%
