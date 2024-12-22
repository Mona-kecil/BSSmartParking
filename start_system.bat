@echo off
:: Start bs-backend in a new terminal window
start cmd /K "cd /d %cd%\bs-backend && .\.venv\Scripts\activate && python app/models/database.py && uvicorn app.main:app --reload"

:: Start bs-frontend in a new terminal window
start cmd /K "cd /d %cd%\bs-frontend && pnpm run dev"

:: Start bs-ml-2 in a new terminal window
start cmd /K "cd /d %cd%\bs-ml-2 && .\.venv\Scripts\activate && python run src/main.py"
