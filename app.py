# Forked – Butterfly Effect: Trade-off Simulator
# Backend: Flask + OpenAI API
#
# Install:
# pip install flask openai python-dotenv
#
# Set API key:
# export OPENAI_API_KEY=your_key
# OR create .env file with: OPENAI_API_KEY=your_key
#
# Run:
# python app.py

import os
import json
import time
from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Initialize OpenAI client with timeout
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable not set")

print(f"[INIT] OpenAI API key found (length: {len(api_key)})")

try:
    client = OpenAI(
        api_key=api_key,
        timeout=60.0  # 60 second timeout
    )
    print("[INIT] OpenAI client initialized successfully")
except Exception as e:
    print(f"[INIT] OpenAI initialization error: {e}")
    raise


@app.route("/")
def index():
    """Serve homepage"""
    return render_template("index.html")


@app.route("/test", methods=["GET"])
def test():
    """Test endpoint to verify OpenAI connection"""
    try:
        print("[TEST] Testing OpenAI connection...")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": "Say 'Hello, world!' in one sentence."
                }
            ],
            max_tokens=50
        )
        result = response.choices[0].message.content
        print(f"[TEST] OpenAI connection successful: {result}")
        return jsonify({
            "status": "success",
            "message": "OpenAI API is working",
            "response": result
        })
    except Exception as e:
        print(f"[TEST] OpenAI connection failed: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route("/generate", methods=["POST"])
def generate():
    """
    Generate 10-year alternate life timeline using OpenAI API.
    
    Focuses on trade-offs and hidden costs of romanticized decisions.
    
    Accepts JSON:
    {
        "age": number,
        "profession": string,
        "location": string,
        "risk": string (Low/Medium/High),
        "decision": string
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get("age") or not data.get("decision"):
            return jsonify({"error": "Missing required fields: age, decision"}), 400
        
        age = data.get("age")
        profession = data.get("profession", "Not specified")
        location = data.get("location", "Not specified")
        risk = data.get("risk", "Medium")
        decision = data.get("decision")
        
        # Construct the prompt
        prompt = f"""You are a behavioral life simulation engine focused on trade-offs and psychological realism.

User Context:
Age: {age}
Profession: {profession}
Location: {location}
Risk Level: {risk}

Simulate a 10-year alternate life timeline based on this decision:
"{decision}"

CRITICAL RULE:
For every WIN listed, you must include at least one STRUGGLE that the user does NOT experience in their current life.

This is not a dream generator.
This is a trade-off simulator.

Tone:
Grounded, reflective, slightly witty but empathetic.
No fantasy.
No extreme success.
No extreme tragedy.

Purpose:
Reveal hidden costs of romanticized decisions.

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
A reflective paragraph emphasizing that no path is perfect.

WHAT THEY WOULD HAVE LOST FROM THEIR CURRENT LIFE:
- Bullet points focused on relationships, stability, identity, warmth, familiarity.

GRASS IS GREENER SCORE:
Number from 1–100 with short explanation.

Do not use markdown.
Do not add extra commentary.
Follow format strictly."""
        
        print(f"[DEBUG] Sending prompt to OpenAI for age {age}...")
        
        # Call OpenAI API with retry logic
        response = None
        last_error = None
        for attempt in range(2):
            try:
                print(f"[DEBUG] API attempt {attempt + 1}/2...")
                start_time = time.time()
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature=0.8,
                    max_tokens=2500
                )
                elapsed = time.time() - start_time
                print(f"[DEBUG] API call successful on attempt {attempt + 1} (took {elapsed:.2f}s)")
                break
            except Exception as e:
                last_error = str(e)
                print(f"[DEBUG] API attempt {attempt + 1} failed: {last_error}")
                if attempt == 0:
                    print(f"[DEBUG] Retrying...")
                    time.sleep(1)
                    continue
                else:
                    raise
        
        if not response:
            print(f"[ERROR] No response from API. Last error: {last_error}")
            return jsonify({"error": f"API call failed: {last_error}"}), 500
        
        # Extract response text
        raw_output = response.choices[0].message.content.strip()
        print(f"[DEBUG] Response received. Length: {len(raw_output)} characters")
        
        # Validate response length
        if len(raw_output) < 100:
            print(f"[ERROR] Response too short: {len(raw_output)} chars")
            print(f"[ERROR] Response preview: {raw_output[:200]}")
            return jsonify({"error": "AI response was too short. Please try again."}), 500
        
        print(f"[DEBUG] Response validated successfully")
        return jsonify({
            "raw_output": raw_output
        })
    
    except Exception as e:
        error_msg = str(e)
        print(f"[ERROR] Exception in /generate: {error_msg}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to generate timeline. Please try again."}), 500


if __name__ == "__main__":
    app.run(debug=False, port=5000, use_reloader=False)
