@echo off
echo Testing both users...
echo.

echo Testing admin user...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method POST -ContentType 'application/json' -Body '{\"nickname\":\"admin\",\"password\":\"adminpassword\"}'; Write-Host 'SUCCESS: admin user works!' -ForegroundColor Green; Write-Host $response } catch { Write-Host 'ERROR: admin user failed!' -ForegroundColor Red; Write-Host $_.Exception.Message }"

echo.
echo Testing admin2 user...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method POST -ContentType 'application/json' -Body '{\"nickname\":\"admin2\",\"password\":\"adminpassword2\"}'; Write-Host 'SUCCESS: admin2 user works!' -ForegroundColor Green; Write-Host $response } catch { Write-Host 'ERROR: admin2 user failed!' -ForegroundColor Red; Write-Host $_.Exception.Message }"

echo.
echo Test completed. Press any key to exit...
pause >nul
