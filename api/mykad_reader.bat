@echo off
cd /d %~dp0
setlocal

set "ORIGIN="

echo =====================================
echo Select API Origin:
echo 1) http://localhost:8080
echo 2) http://127.0.0.1:8080
echo 3) https://nadi-demo.vercel.app
echo 4) Custom
echo =====================================
set /p choice=Enter option number: 

if "%choice%"=="1" goto set1
if "%choice%"=="2" goto set2
if "%choice%"=="3" goto set3
if "%choice%"=="4" goto custom
goto invalid

:set1
set ORIGIN=http://localhost:8080
goto writeenv

:set2
set ORIGIN=http://127.0.0.1:8080
goto writeenv

:set3
set ORIGIN=https://nadi-demo.vercel.app
goto writeenv

:custom
set /p ORIGIN=Enter custom origin (e.g., https://your-site.com): 
goto writeenv

:invalid
echo Invalid choice. Press any key to exit...
pause >nul
exit /b

:writeenv
echo Selected Origin: %ORIGIN%
echo API_ORIGIN=%ORIGIN% > .env

if exist .env (
    echo ✅ Origin saved to .env
) else (
    echo ❌ Failed to write .env
    pause
    exit /b
)

REM Start Flask server in new terminal
start "" cmd /k start_server.bat
exit
