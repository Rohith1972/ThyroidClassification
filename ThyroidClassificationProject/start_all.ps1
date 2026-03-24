$services = @(
    @{ Name = "Frontend"; Path = "frontend"; Command = "npm run dev" },
    @{ Name = "Backend"; Path = "backend"; Command = "mvn spring-boot:run" },
    @{ Name = "AI Service 1"; Path = "ai-service-1"; Command = "python -m uvicorn main:app --port 8004" },
    @{ Name = "AI Service 2"; Path = "ai-service-2"; Command = "python -m uvicorn main:app --port 8001" }
)

Write-Host "Starting Thyroid Classification System Multi-node Architecture..." -ForegroundColor Cyan

foreach ($service in $services) {
    Write-Host "Starting $($service.Name) from $(Resolve-Path $service.Path)..." -ForegroundColor Green
    
    $startArgs = "-NoExit -Command `"title $($service.Name); cd '$($service.Path)'; $($service.Command)`""
    Start-Process powershell -ArgumentList $startArgs
    
    Start-Sleep -Seconds 5
}

Write-Host "All services have been initiated in separate windows." -ForegroundColor Yellow
Write-Host "Please wait a moment for the backend and AI models to fully load into memory." -ForegroundColor Yellow
