# 🚀 Getting Started with Forked

## Prerequisites Check

Before starting, ensure you have:
- ✅ Python 3.8 or higher
- ✅ OpenAI API key (get from https://platform.openai.com/api-keys)
- ✅ pip (comes with Python)

## Windows Setup (PowerShell)

### Option 1: Automated Setup
```powershell
# Navigate to project folder
cd life-simulator

# Run setup script
.\setup.ps1

# Follow prompts to edit .env file with your API key
```

### Option 2: Manual Setup

1. **Create virtual environment**:
```powershell
python -m venv venv
```

2. **Activate virtual environment**:
```powershell
.\venv\Scripts\Activate.ps1
```

If you get an execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

3. **Install dependencies**:
```powershell
pip install -r requirements.txt
```

4. **Set up API key**:

**Method A: Create .env file** (recommended)
```powershell
Copy-Item .env.example .env
# Then edit .env with your OpenAI API key
```

**Method B: Set environment variable**
```powershell
$env:OPENAI_API_KEY="sk-your-api-key-here"
```

5. **Run the app**:
```powershell
python app.py
```

6. **Open browser**:
Navigate to `http://localhost:5000`

## macOS/Linux Setup (Bash)

1. **Create virtual environment**:
```bash
python3 -m venv venv
```

2. **Activate virtual environment**:
```bash
source venv/bin/activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Set up API key**:

**Method A: Create .env file**
```bash
cp .env.example .env
# Then edit .env with your API key
nano .env
```

**Method B: Set environment variable**
```bash
export OPENAI_API_KEY="sk-your-api-key-here"
```

5. **Run the app**:
```bash
python app.py
```

6. **Open browser**:
Navigate to `http://localhost:5000`

## Getting Your OpenAI API Key

1. Go to https://platform.openai.com/account/api-keys
2. Sign up or log in to your account
3. Click "Create new secret key"
4. Copy the key (it won't be shown again!)
5. Paste it into your `.env` file as:
   ```
   OPENAI_API_KEY=sk-xxxxxxxxxxxxx
   ```

## Troubleshooting

### "Python not found"
- Reinstall Python from https://python.org
- Make sure to check "Add Python to PATH" during installation

### "OPENAI_API_KEY not set"
- Verify your .env file has the correct key
- Restart the Flask server (Ctrl+C, then python app.py)
- If using environment variable, restart your terminal

### "ModuleNotFoundError"
- Verify virtual environment is activated (you should see (venv) in your prompt)
- Run `pip install -r requirements.txt` again

### "Port 5000 already in use"
- Edit app.py last line: `app.run(debug=True, port=5001)`
- Or kill the process using port 5000:
```powershell
# PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
```

## Development

### File Structure
```
static/css/style.css    - All styling (glassmorphism, animations)
static/js/script.js     - Frontend logic (parsing, rendering)
templates/index.html    - Single HTML page
app.py                  - Flask backend & OpenAI integration
```

### Making Changes

**To modify the AI prompt**:
- Edit app.py around line 55 (the prompt variable)
- Restart the server

**To change colors/styling**:
- Edit static/css/style.css
- Look for :root variables at the top

**To modify frontend behavior**:
- Edit static/js/script.js
- Changes take effect immediately in browser (refresh F5)

## Performance Tips

- API calls take 5-15 seconds depending on OpenAI load
- First run may be slow (model loading)
- Use gpt-3.5-turbo for faster responses
- Use gpt-4 for higher quality (slower, more expensive)

## Production Deployment

### On Heroku:
1. Create `Procfile`:
```
web: gunicorn app:app
```

2. Add gunicorn to requirements.txt:
```
pip install gunicorn
pip freeze > requirements.txt
```

3. Set environment variable in Heroku dashboard
4. Deploy: `git push heroku main`

### On AWS/Digital Ocean:
1. Use similar setup with gunicorn
2. Set OPENAI_API_KEY in environment
3. Use proper WSGI server (gunicorn, uWSGI)

## FAQ

**Q: Can I change the AI model?**
A: Yes! Edit line ~70 in app.py: `model="gpt-4"`

**Q: How much does this cost?**
A: Depends on OpenAI usage. Each timeline generation costs ~$0.01-0.05

**Q: Can I add a database?**
A: Yes! Modify app.py to save responses to a database

**Q: How can I customize the UI?**
A: Edit static/css/style.css and static/js/script.js

---

Have fun simulating alternate timelines! 🔀✨
