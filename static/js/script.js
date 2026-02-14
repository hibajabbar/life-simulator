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

    formData = {
        age: document.getElementById('age').value,
        profession: document.getElementById('profession').value,
        location: document.getElementById('location').value,
        risk: document.getElementById('risk').value,
        decision: document.getElementById('decision').value
    };

    if (!formData.age || !formData.decision) {
        alert('Please fill in your age and the decision you are considering.');
        return;
    }

    submitBtn.disabled = true;
    loadingSpinner.classList.remove('hidden');

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        renderResults(data.raw_output);

    } catch (error) {
        console.error(error);
        alert('Failed to generate timeline. Please try again.');
        submitBtn.disabled = false;
    } finally {
        loadingSpinner.classList.add('hidden');
    }
}

// ========================================
// PARSE STRUCTURED OUTPUT (ROBUST)
// ========================================

function parseTimeline(text) {
    const sections = {
        timeline: {},
        ending: '',
        lostFromPath: [],
        grassIsGreenScore: 50,
        explanation: ''
    };

    // Normalize line endings
    text = text.replace(/\r\n/g, "\n");

    // Extract each YEAR block safely
    const yearMatches = text.matchAll(/YEAR\s+(\d+):([\s\S]*?)(?=YEAR\s+\d+:|ENDING:|WHAT THEY WOULD HAVE LOST|GRASS IS GREENER|$)/gi);

    for (const match of yearMatches) {
        const year = match[1];
        const content = match[2];

        const winsMatch = content.match(/Wins:\s*([\s\S]*?)(?=Struggles:|$)/i);
        const strugglesMatch = content.match(/Struggles:\s*([\s\S]*)/i);

        sections.timeline[`year${year}`] = {
            wins: winsMatch ? winsMatch[1].trim() : '',
            struggles: strugglesMatch ? strugglesMatch[1].trim() : ''
        };
    }

    // ENDING
    const endingMatch = text.match(/ENDING:\s*([\s\S]*?)(?=WHAT THEY WOULD HAVE LOST|GRASS IS GREENER|$)/i);
    if (endingMatch) {
        sections.ending = endingMatch[1].trim();
    }

    // LOST SECTION
    const lostMatch = text.match(/WHAT THEY WOULD HAVE LOST FROM THEIR CURRENT LIFE:\s*([\s\S]*?)(?=GRASS IS GREENER|$)/i);
    if (lostMatch) {
        sections.lostFromPath = lostMatch[1]
            .split("\n")
            .filter(line => line.trim().startsWith("-"))
            .map(line => line.replace(/^-\s*/, "").trim());
    }

    // SCORE
    const scoreMatch = text.match(/GRASS IS GREENER SCORE:\s*(\d+)/i);
    if (scoreMatch) {
        sections.grassIsGreenScore = parseInt(scoreMatch[1], 10);
    }

    // Explanation (everything after score line)
    const explanationMatch = text.match(/GRASS IS GREENER SCORE:[^\n]*\n?([\s\S]*)$/i);
    if (explanationMatch) {
        sections.explanation = explanationMatch[1].trim();
    }

    return sections;
}


// ========================================
// RENDER RESULTS
// ========================================

function renderResults(rawOutput) {

    const parsed = parseTimeline(rawOutput);

    renderCurrentPath();
    renderTimeline(parsed);
    renderHiddenCosts(parsed.lostFromPath);
    renderMeter(parsed.grassIsGreenScore, parsed.explanation);

    homepage.classList.remove('active');
    resultsView.classList.add('active');

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

    years.forEach((year) => {

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
                    </div>` : ''}
                
                ${data.struggles ? `
                    <div class="timeline-section">
                        <div class="timeline-section-title">⚠ Struggles</div>
                        <div class="timeline-section-content">${escapeHtml(data.struggles)}</div>
                    </div>` : ''}
            </div>
        `;

        timelineContainer.appendChild(card);
    });

    // Ending card
    if (parsedData.ending) {
        const endingCard = document.createElement('div');
        endingCard.className = 'timeline-card';

        endingCard.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-card-content">
                <div class="timeline-card-title">10-Year Perspective</div>
                <div class="timeline-section-content">${escapeHtml(parsedData.ending)}</div>
            </div>
        `;

        timelineContainer.appendChild(endingCard);
    }
}

// ========================================
// RENDER HIDDEN COSTS
// ========================================

function renderHiddenCosts(costs) {

    if (!costs || costs.length === 0) {
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
// RENDER METER
// ========================================

function renderMeter(score, explanation) {

    const normalizedScore = Math.min(100, Math.max(0, score || 50));

    const circumference = 2 * Math.PI * 90;
    const progressRing = document.getElementById('progressRing');

    progressRing.style.strokeDasharray = circumference;

    animateValue(meterValue, 0, normalizedScore, 1000, (value) => {
        progressRing.style.strokeDashoffset =
            circumference - (value / 100) * circumference;
    });

    if (normalizedScore > 70) {
        meterInsight.textContent =
            'Careful. That timeline also includes difficult bosses and missed family moments.';
    } else if (normalizedScore < 40) {
        meterInsight.textContent =
            'Turns out, your current life isn’t missing much.';
    } else {
        meterInsight.textContent =
            'Life has trade-offs either way.';
    }

    insightText.textContent = explanation || '';
}

// ========================================
// ANIMATION
// ========================================

function animateValue(element, start, end, duration, callback) {

    const startTime = Date.now();

    const update = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * (1 - (1 - progress) * (1 - progress)));

        callback(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end;
        }
    };

    update();
}

// ========================================
// GO BACK
// ========================================

function goBackToForm() {
    resultsView.classList.remove('active');
    homepage.classList.add('active');
    form.reset();
    submitBtn.disabled = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

console.log('Forked – Butterfly Effect loaded successfully');
