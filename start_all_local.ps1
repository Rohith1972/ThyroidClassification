Write-Host "Starting AI Service 1..."
Start-Process "powershell" -ArgumentList "-NoExit -Command `"cd ai-service; ..\venv_1\Scripts\uvicorn main:app --host 0.0.0.0 --port 8003`""

Write-Host "Starting AI Service 2..."
Start-Process "powershell" -ArgumentList "-NoExit -Command `"cd ai-service-2; ..\venv_2\Scripts\uvicorn main:app --host 0.0.0.0 --port 8001`""

Write-Host "Starting AI Service 3..."
Start-Process "powershell" -ArgumentList "-NoExit -Command `"cd ai-service-3; ..\venv_3\Scripts\uvicorn main:app --host 0.0.0.0 --port 8002`""

Write-Host "Starting API Gateway..."
Start-Process "powershell" -ArgumentList "-NoExit -Command `"cd api-gateway; `$env:AI_SERVICE_1_URL='http://localhost:8003'; `$env:AI_SERVICE_2_URL='http://localhost:8001'; `$env:AI_SERVICE_3_URL='http://localhost:8002'; ..\venv_gw\Scripts\uvicorn main:app --host 0.0.0.0 --port 8000`""

Write-Host "Starting Backend..."
Start-Process "powershell" -ArgumentList "-NoExit -Command `"cd backend; mvn spring-boot:run`""

Write-Host "Starting Frontend..."
Start-Process "powershell" -ArgumentList "-NoExit -Command `"cd frontend; npm run dev`""

Write-Host "All services started in separate windows."
