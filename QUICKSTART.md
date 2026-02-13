🔀 FORKED – QUICK START
=======================

⚡ 5 MINUTE SETUP

1. GET API KEY
   → Visit: https://platform.openai.com/api-keys
   → Create new secret key
   → Copy the key (e.g., sk-...)

2. INSTALL DEPENDENCIES
   ```
   pip install -r requirements.txt
   ```

3. SET API KEY (Choose one method)
   
   Method A - Environment Variable (PowerShell):
   ```
   $env:OPENAI_API_KEY="sk-your-key-here"
   ```
   
   Method B - .env File:
   ```
   Copy .env.example to .env
   Edit .env and add your key
   ```

4. RUN THE APP
   ```
   python app.py
   ```

5. OPEN IN BROWSER
   ```
   http://localhost:5000
   ```

✨ THAT'S IT! 

The app will be running with:
- 🎨 Cinematic glassmorphic UI
- 🤖 AI-powered timeline generation
- ⏱️  10-year alternate life simulation
- 📊 Regret probability meter
- 📱 Fully responsive design

====================================

DEMO TEST
=========

Try this scenario:
- Age: 32
- Profession: Product Manager
- Location: New York, NY
- Risk Tolerance: High
- Decision: Move to Hawaii and open a surf school

Expected: Beautiful 10-year timeline showing wins/losses!

====================================

TROUBLESHOOTING
===============

❌ "OPENAI_API_KEY not set"
   → Make sure you set the API key before running
   → Or add it to .env file

❌ "Port 5000 already in use"
   → Change port in app.py last line
   → Or close other app using port 5000

❌ "ModuleNotFoundError: No module named 'flask'"
   → Run: pip install -r requirements.txt

====================================

📚 FULL DOCS
============

For detailed setup & customization:
→ See SETUP.md
→ See README.md
→ See DELIVERY.txt

====================================

🚀 Ready to go!
