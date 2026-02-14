# Forked – Butterfly Effect: Trade-off Simulator
# Backend: Flask + Gemini API

# Install:
# pip install flask google-generativeai python-dotenv

# .env file:
# GEMINI_API_KEY=your_key

import os
import time
import traceback
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)

# =========================
# Initialize Gemini
# =========================

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY not set in environment")

genai.configure(api_key=api_key)

print("[INIT] Listing available models...")

available_models = []
for m in genai.list_models():
    if "generateContent" in m.supported_generation_methods:
        available_models.append(m.name)
        print(" -", m.name)

if not available_models:
    raise RuntimeError("No usable Gemini models found for your API key")

# Pick first available working model
MODEL_NAME = available_models[0]
print(f"[INIT] Using model: {MODEL_NAME}")

model = genai.GenerativeModel(MODEL_NAME)

# =========================
# Routes
# =========================

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/test")
def test():
    try:
        response = model.generate_content("Say Hello in one sentence.")
        return jsonify({
            "status": "success",
            "response": response.text
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.get_json()

        if not data.get("age") or not data.get("decision"):
            return jsonify({"error": "Missing required fields"}), 400

        age = data.get("age")
        profession = data.get("profession", "Not specified")
        location = data.get("location", "Not specified")
        risk = data.get("risk", "Medium")
        decision = data.get("decision")

        prompt = f"""
You are a behavioral life simulation engine focused on trade-offs and psychological realism.

User Context:
Age: {age}
Profession: {profession}
Location: {location}
Risk Level: {risk}

Simulate a 10-year alternate life timeline based on this decision:
"{decision}"

CRITICAL RULE:
For every WIN listed, include at least one STRUGGLE that does NOT exist in current life.

Follow this structure EXACTLY:

YEAR 1:
Wins:
Struggles:

YEAR 3:
Wins:
Struggles:

YEAR 5:
Wins:
Struggles:

YEAR 10:
Wins:
Struggles:

ENDING:

WHAT THEY WOULD HAVE LOST FROM THEIR CURRENT LIFE:
- Bullet points

GRASS IS GREENER SCORE:
Number from 1–100 with short explanation.

No markdown.
No extra commentary.
"""

        print("[DEBUG] Sending prompt...")

        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.7,
                "max_output_tokens": 1500
            }
        )

        raw_output = response.text.strip()

        if len(raw_output) < 100:
            return jsonify({"error": "Response too short"}), 500

        return jsonify({"raw_output": raw_output})

    except Exception as e:
        print("[ERROR]", str(e))
        traceback.print_exc()

        # DEMO FALLBACK
        demo_output = """
YEAR 1:
Wins:
You gain business exposure and networking growth.
Struggles:
You miss deep technical immersion.

YEAR 3:
Wins:
Leadership visibility increases.
Struggles:
Stress and pressure rise.

YEAR 5:
Wins:
Financial stability improves.
Struggles:
You question your creative fulfillment.

YEAR 10:
Wins:
You hold strategic authority.
Struggles:
You wonder about alternate technical mastery.

ENDING:
No path is perfect. Every gain carries cost.

WHAT THEY WOULD HAVE LOST FROM THEIR CURRENT LIFE:
- Technical depth
- Engineering camaraderie
- Daily problem-solving satisfaction

GRASS IS GREENER SCORE:
60 – Attractive, but emotionally complex.
"""
        return jsonify({"raw_output": demo_output})


if __name__ == "__main__":
    app.run(debug=False, port=5000, use_reloader=False)
