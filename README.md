# 🔀 Forked – Parallel Life Simulator

A cinematic, AI-powered web application that simulates a 10-year alternate life timeline based on a single decision. Built with Flask, OpenAI API, and modern glassmorphic design.

## 🎯 Features

- **Interactive Decision Simulator**: Input your age, profession, location, risk tolerance, and the decision you're considering
- **AI-Generated Timeline**: OpenAI API generates a realistic 10-year trajectory with wins and struggles
- **Dual-Path Comparison**: View your current path vs. the alternate reality side-by-side
- **Cinematic UI**: Premium glassmorphism, neon glows, and smooth animations
- **Grass Is Greener Meter**: Animated circular progress ring showing "Perceived Regret Probability"
- **Hidden Costs Analysis**: Display what you'd lose from your original path
- **Stateless Architecture**: No database needed, pure AI generation
- **Fully Responsive**: Works beautifully on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- OpenAI API key
- pip

### Installation

1. **Clone or navigate to the project**:
```bash
cd life-simulator
```

2. **Create a virtual environment** (recommended):
```bash
python -m venv venv
source venv/Scripts/activate  # Windows
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Set up your OpenAI API key**:

**Option A: Environment Variable**
```bash
export OPENAI_API_KEY=sk-your-api-key-here  # macOS/Linux
set OPENAI_API_KEY=sk-your-api-key-here  # Windows CMD
$env:OPENAI_API_KEY="sk-your-api-key-here"  # Windows PowerShell
```

**Option B: Create `.env` file**
```
OPENAI_API_KEY=sk-your-api-key-here
```

5. **Run the application**:
```bash
python app.py
```

6. **Open in browser**:
Navigate to `http://localhost:5000`

## 📁 Project Structure

```
life-simulator/
├── app.py                    # Flask backend with OpenAI integration
├── requirements.txt          # Python dependencies
├── templates/
│   └── index.html           # Single-page HTML
├── static/
│   ├── css/
│   │   └── style.css        # Glassmorphism + animations
│   └── js/
│       └── script.js        # Frontend logic + parsing
└── README.md
```

## 🎨 Design Highlights

- **Cosmic Gradient Background**: Deep purple to black gradient
- **Animated Stars**: Twinkling starfield using pure CSS
- **Glassmorphism Cards**: Frosted glass effect with backdrop blur
- **Neon Accents**: Cyan blue (#00d9ff) and purple (#b000d9) glows
- **Smooth Animations**: Fade-in, slide-in, and scale transitions
- **Timeline Visualization**: Vertical glowing line with connected cards
- **Circular Meter**: SVG-based progress ring with gradient

## 🤖 AI Generation

The backend sends a structured prompt to OpenAI's API that ensures:

- Realistic 10-year trajectory with trade-offs
- Cinematic but grounded tone
- Structured output (YEAR 1, 3, 5, 10, ENDING, etc.)
- Emotionally intelligent narrative

The frontend parses this structured text and renders it beautifully.

## 🔧 API Endpoints

### GET `/`
Returns the home page.

### POST `/generate`
Generates a parallel life timeline.

**Request Body**:
```json
{
  "age": 32,
  "profession": "Software Engineer",
  "location": "San Francisco, CA",
  "risk": "High",
  "decision": "Quit my job and start a tech startup"
}
```

**Response**:
```json
{
  "raw_output": "YEAR 1:\nWins:\n...\nStrugles:\n...\n\nYEAR 3:\n..."
}
```

## 💡 Usage Example

1. Fill in your age and optionally your profession and location
2. Select your risk tolerance (Low/Medium/High)
3. Describe the life decision you're exploring
4. Click "Simulate Parallel Timeline"
5. Watch as the AI generates your 10-year alternate life
6. Explore the comparison layout, timeline, costs, and regret meter
7. Click "Back to Simulator" to try another scenario

## 🎯 Tech Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **AI**: OpenAI GPT-3.5-turbo API
- **Styling**: Pure CSS with glassmorphism, no external frameworks
- **Architecture**: Stateless, no database

## 🔐 Security Notes

- API keys are stored in environment variables
- No sensitive data is persisted
- All AI calls happen server-side
- Consider rate-limiting for production use

## 📝 Customization

### Change AI Model
In `app.py`, line ~70:
```python
model="gpt-4"  # or "gpt-3.5-turbo"
```

### Adjust Styling
Edit `static/css/style.css` for colors, animations, and layout.

### Modify Prompt
Edit the prompt construction in `app.py` starting at line ~55.

## 🐛 Troubleshooting

**"OPENAI_API_KEY not set"**
- Verify your API key is exported or in `.env` file
- Restart the Flask server after setting the key

**"Invalid response from AI"**
- The backend has retry logic; check Flask logs
- Verify your OpenAI account has API access and credits

**Styling not loading**
- Clear browser cache (Ctrl+Shift+Del)
- Verify CSS file path is correct

## 📄 License

Open source - feel free to modify and deploy.

---

Built with ❤️ as a premium startup demo.
