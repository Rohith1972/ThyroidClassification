Write-Host "Starting all services smoothly in a single terminal..."

npx concurrently `
  --kill-others `
  -c "bgBlue.bold,bgMagenta.bold,bgGreen.bold,bgCyan.bold,bgYellow.bold,bgRed.bold" `
  -n "AI-1,AI-2,AI-3,API-GW,BACKEND,FRONTEND" `
  "cd ai-service && ..\venv_1\Scripts\uvicorn main:app --host 0.0.0.0 --port 8003" `
  "cd ai-service-2 && ..\venv_2\Scripts\uvicorn main:app --host 0.0.0.0 --port 8001" `
  "cd ai-service-3 && ..\venv_3\Scripts\uvicorn main:app --host 0.0.0.0 --port 8002" `
  "cd api-gateway && set AI_SERVICE_1_URL=http://localhost:8003 && set AI_SERVICE_2_URL=http://localhost:8001 && set AI_SERVICE_3_URL=http://localhost:8002 && ..\venv_gw\Scripts\uvicorn main:app --host 0.0.0.0 --port 8000" `
  "cd backend && mvn spring-boot:run" `
  "cd frontend && npm run dev"
