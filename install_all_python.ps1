Write-Host "Creating venv_1 and installing..."
python -m venv venv_1
.\venv_1\Scripts\pip install -r .\ai-service\requirements.txt

Write-Host "Creating venv_2 and installing..."
python -m venv venv_2
.\venv_2\Scripts\pip install -r .\ai-service-2\requirements.txt

Write-Host "Creating venv_3 and installing..."
python -m venv venv_3
.\venv_3\Scripts\pip install -r .\ai-service-3\requirements.txt

Write-Host "Creating venv_gw and installing..."
python -m venv venv_gw
.\venv_gw\Scripts\pip install -r .\api-gateway\requirements.txt

Write-Host "All python dependencies installed."
