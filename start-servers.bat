@echo off
echo Starting Game Auth Servers...
echo.

echo Starting Backend (C# .NET API)...
start "Backend Server" powershell -NoExit -Command "cd '%~dp0backend\GameAuth.API' && dotnet run"

timeout /t 3 /nobreak >nul

echo Starting Frontend (React.js)...
start "Frontend Server" powershell -NoExit -Command "cd '%~dp0frontend' && npm start"

echo.
echo Both servers are starting...
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul
