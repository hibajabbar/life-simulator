# Forked – Parallel Life Simulator Setup Script
# For Windows PowerShell

Write-Host "🔀 Forked – Parallel Life Simulator Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Python found" -ForegroundColor Green

# Create virtual environment
Write-Host ""
Write-Host "📦 Creating virtual environment..." -ForegroundColor Yellow
python -m venv venv
Write-Host "✓ Virtual environment created" -ForegroundColor Green

# Activate virtual environment
Write-Host ""
Write-Host "🔄 Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"
Write-Host "✓ Virtual environment activated" -ForegroundColor Green

# Install requirements
Write-Host ""
Write-Host "📚 Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Setup .env file
Write-Host ""
Write-Host "🔑 Setting up OpenAI API key..." -ForegroundColor Yellow

if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "✓ .env file created. Please add your OpenAI API key to it." -ForegroundColor Green
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✨ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env and add your OPENAI_API_KEY" -ForegroundColor White
Write-Host "2. Run: python app.py" -ForegroundColor White
Write-Host "3. Open: http://localhost:5000" -ForegroundColor White
Write-Host ""
