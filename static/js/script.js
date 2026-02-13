// ========================================
// FORKED – BUTTERFLY EFFECT: TRADE-OFF SIMULATOR
// Psychological Reframing Engine
// ========================================

// ========================================
// STATE & DOM ELEMENTS
// ========================================

const form = document.getElementById('simulatorForm');
const submitBtn = form.querySelector('button[type="submit"]');
const loadingSpinner = document.getElementById('loadingSpinner');
const homepage = document.getElementById('homepage');
const resultsView = document.getElementById('resultsView');
const backBtn = document.getElementById('backBtn');
const timelineContainer = document.getElementById('timelineContainer');
const currentPathContent = document.getElementById('currentPathContent');
const hiddenCostsSection = document.getElementById('hiddenCostsSection');
const costsList = document.getElementById('costsList');
const meterValue = document.getElementById('meterValue');
const meterInsight = document.getElementById('meterInsight');
const insightText = document.getElementById('insightText');

let formData = {};

// ========================================
// EVENT LISTENERS
// ========================================

form.addEventListener('submit', handleFormSubmit);
backBtn.addEventListener('click', goBackToForm);

// ========================================
// FORM SUBMISSION
// ========================================

async function handleFormSubmit(e) {
    e.preventDefault();

    // Collect form data
    formData = {
        age: document.getElementById('age').value,
        profession: document.getElementById('profession').value,
        location: document.getElementById('location').value,
        risk: document.getElementById('risk').value,
        decision: document.getElementById('decision').value
    };

    console.log('[DEBUG] Form data collected:', formData);

    // Validate client-side
    if (!formData.age || !formData.decision) {
        alert('Please fill in your age and the decision you are considering.');
        return;
    }

    // Disable button and show spinner
    submitBtn.disabled = true;
    loadingSpinner.classList.remove('hidden');
    console.log('[DEBUG] Loading spinner shown, button disabled');

    try {
        // Send POST request to backend
        console.log('[DEBUG] Sending request to /generate...');
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        console.log('[DEBUG] Response status:', response.status);
        console.log('[DEBUG] Response ok:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[ERROR] Server error response:', response.status, errorText);
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[DEBUG] Response data received:', data);
        
        if (data.error) {
            console.error('[ERROR] API error:', data.error);
            throw new Error(data.error);
        }

        const rawOutput = data.raw_output;
        console.log('[DEBUG] Raw output length:', rawOutput ? rawOutput.length : 0);

        // Parse and render results
        console.log('[DEBUG] Calling renderResults...');
        renderResults(rawOutput);

    } catch (error) {
        console.error('[EXCEPTION] Error:', error);
        console.error('[EXCEPTION] Error message:', error.message);
        alert('Failed to generate timeline. Please try again.');
        submitBtn.disabled = false;
    } finally {
        loadingSpinner.classList.add('hidden');
    }
}

// ========================================
// PARSE STRUCTURED OUTPUT
// ========================================

function parseTimeline(text) {
    /**
     * Parse the AI-generated structured output into organized sections
     */
    const sections = {
        timeline: {},
        ending: '',
        lostFromPath: [],
        grassIsGreenScore: 0,
        explanation: ''
    };

    // Extract timeline years (YEAR 1, YEAR 3, YEAR 5, YEAR 10)
    const yearRegex = /YEAR\s+(\d+):([\s\S]*?)(?=YEAR|\s+ENDING|$)/gi;
    let match;

    while ((match = yearRegex.exec(text)) !== null) {
        const year = match[1];
        const content = match[2].trim();

        // Parse wins and struggles
        const winsMatch = content.match(/Wins:\s*([\s\S]*?)(?=Struggles:|$)/i);
        const strugglesMatch = content.match(/Struggles:\s*([\s\S]*?)(?=$|YEAR|ENDING)/i);

        sections.timeline[`year${year}`] = {
            wins: winsMatch ? winsMatch[1].trim() : '',
            struggles: strugglesMatch ? strugglesMatch[1].trim() : ''
        };
    }

    // Extract ENDING section
    const endingMatch = text.match(/ENDING:\s*([\s\S]*?)(?=WHAT THEY WOULD HAVE LOST|$)/i);
    if (endingMatch) {
        sections.ending = endingMatch[1].trim();
    }

    // Extract WHAT THEY WOULD HAVE LOST FROM THEIR CURRENT LIFE
    const lostMatch = text.match(/WHAT THEY WOULD HAVE LOST FROM THEIR CURRENT LIFE:\s*([\s\S]*?)(?=GRASS IS GREENER|$)/i);
    if (lostMatch) {
        const lostText = lostMatch[1].trim();
        sections.lostFromPath = lostText
            .split('\n')
            .filter(line => line.trim().startsWith('-'))
            .map(line => line.replace(/^-\s*/, '').trim());
    }

    // Extract GRASS IS GREENER SCORE
    const scoreMatch = text.match(/GRASS IS GREENER SCORE:\s*(\d+)([\s\S]*?)$/i);
    if (scoreMatch) {
        sections.grassIsGreenScore = parseInt(scoreMatch[1], 10);
        sections.explanation = scoreMatch[2].trim();
    }

    return sections;
}

// ========================================
// RENDER RESULTS
// ========================================

function renderResults(rawOutput) {
    // Parse the structured output
    const parsed = parseTimeline(rawOutput);

    // Render current path (baseline)
    renderCurrentPath();

    // Render timeline (pass full parsed data including ending)
    renderTimeline(parsed);

    // Render hidden costs
    renderHiddenCosts(parsed.lostFromPath);

    // Render romanticization meter
    renderMeter(parsed.grassIsGreenScore, parsed.explanation);

    // Switch views
    homepage.classList.remove('active');
    resultsView.classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// RENDER CURRENT PATH
// ========================================

function renderCurrentPath() {
    const profession = formData.profession || 'your current profession';
    const location = formData.location || 'your current location';

    const baseline = `Continuing your current life as a ${profession} in ${location} at age ${formData.age}. You maintain your established relationships, familiar routines, and the identity you've built. This path offers the warmth of continuity—the friends who know you, the work that's predictable, the life that feels like home.`;

    currentPathContent.textContent = baseline;
}

// ========================================
// RENDER TIMELINE
// ========================================

function renderTimeline(parsedData) {
    timelineContainer.innerHTML = '';

    const years = [1, 3, 5, 10];

    years.forEach((year, index) => {
        const key = `year${year}`;
        const data = parsedData.timeline[key] || { wins: '', struggles: '' };

        const card = document.createElement('div');
        card.className = 'timeline-card';

        card.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-card-content">
                <div class="timeline-card-title">Year ${year}</div>
                
                ${data.wins ? `
                    <div class="timeline-section">
                        <div class="timeline-section-title">✓ Wins</div>
                        <div class="timeline-section-content">${escapeHtml(data.wins)}</div>
                    </div>
                ` : ''}
                
                ${data.struggles ? `
                    <div class="timeline-section">
                        <div class="timeline-section-title">⚠ Struggles</div>
                        <div class="timeline-section-content">${escapeHtml(data.struggles)}</div>
                    </div>
                ` : ''}
            </div>
        `;

        timelineContainer.appendChild(card);
    });

    // Add ending card
    const endingCard = document.createElement('div');
    endingCard.className = 'timeline-card';

    endingCard.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-card-content">
            <div class="timeline-card-title">10-Year Perspective</div>
            <div class="timeline-section-content">${escapeHtml(parsedData.ending || '')}</div>
        </div>
    `;

    timelineContainer.appendChild(endingCard);
}

// ========================================
// RENDER HIDDEN COSTS
// ========================================

function renderHiddenCosts(costs) {
    if (costs.length === 0) {
        hiddenCostsSection.style.display = 'none';
        return;
    }

    hiddenCostsSection.style.display = 'block';
    costsList.innerHTML = '';

    costs.forEach(cost => {
        const li = document.createElement('li');
        li.textContent = cost;
        costsList.appendChild(li);
    });
}

// ========================================
// RENDER METER (ROMANTICIZATION SCORE)
// ========================================

function renderMeter(score, explanation) {
    // Ensure score is valid
    const normalizedScore = Math.min(100, Math.max(0, score));

    // Animate meter progress
    const circumference = 2 * Math.PI * 90; // radius = 90
    const offset = circumference - (normalizedScore / 100) * circumference;

    const progressRing = document.getElementById('progressRing');
    progressRing.style.strokeDasharray = circumference;
    progressRing.style.strokeDashoffset = offset;

    // Animate from 0 to score
    animateValue(meterValue, 0, normalizedScore, 1000, (value) => {
        progressRing.style.strokeDashoffset = circumference - (value / 100) * circumference;
    });

    // Set final value
    meterValue.textContent = normalizedScore;

    // Display conditional insight
    if (normalizedScore > 70) {
        meterInsight.textContent = 'Careful. That timeline also includes difficult bosses and missed family moments.';
    } else if (normalizedScore < 40) {
        meterInsight.textContent = 'Turns out, your current life isn\'t missing much.';
    } else {
        meterInsight.textContent = 'Life has trade-offs either way.';
    }

    // Display explanation
    insightText.textContent = explanation;
}

// ========================================
// ANIMATE VALUE (FOR METER)
// ========================================

function animateValue(element, start, end, duration, callback) {
    const startTime = Date.now();

    const updateValue = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * easeOutQuad(progress));

        if (callback) {
            callback(current);
        } else {
            element.textContent = current;
        }

        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    };

    updateValue();
}

function easeOutQuad(t) {
    return 1 - (1 - t) * (1 - t);
}

// ========================================
// GO BACK TO FORM
// ========================================

function goBackToForm() {
    resultsView.classList.remove('active');
    homepage.classList.add('active');
    form.reset();
    submitBtn.disabled = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// UTILITY: ESCAPE HTML
// ========================================

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ========================================
// INITIALIZE
// ========================================

console.log('Forked – Butterfly Effect: Trade-off Simulator loaded');
