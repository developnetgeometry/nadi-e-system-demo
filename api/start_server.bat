@echo off
cd /d %~dp0

REM Load environment variable from .env
for /f "tokens=1,* delims==" %%A in (.env) do (
    if "%%A"=="API_ORIGIN" set "API_ORIGIN=%%B"
)

echo ✅ Loaded origin: %API_ORIGIN%

REM Activate virtual environment
call .venv\Scripts\activate

REM Set Flask environment variable
set FLASK_APP=api.py
set FLASK_ENV=development

REM Start Flask server and keep the terminal open
cmd /k flask run
