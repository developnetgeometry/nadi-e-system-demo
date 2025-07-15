@echo off
REM Move to the directory where this .bat file is located
cd /d %~dp0

REM Activate virtual environment
call .venv\Scripts\activate

REM Set Flask environment variable
set FLASK_APP=api.py
set FLASK_ENV=development

REM Run Flask and keep terminal open
cmd /k flask run
