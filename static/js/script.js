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
// PARSE STRUCTURED OUTPUT (INDEX-BASED)
// ========================================

function parseTimeline(text) {
    const sections = {
        timeline: {
            year1: { wins: '', struggles: '' },
            year3: { wins: '', struggles: '' },
            year5: { wins: '', struggles: '' },
            year10: { wins: '', struggles: '' }
        },
        ending: '',
        lostFromPath: [],
        grassIsGreenScore: 50,
        explanation: ''
    };

    // Normalize line endings
    text = text.replace(/\r\n/g, "\n").trim();

    // ========================================
    // STEP 1: FIND ALL YEAR MARKERS WITH POSITIONS
    // ========================================

    const yearPositions = {};
    const years = [1, 3, 5, 10];
    let majorSectionStart = -1;

    years.forEach(year => {
        // Find "YEAR X:" (case-insensitive)
        const yearPattern = new RegExp(`YEAR\\s+${year}:`, 'i');
        const match = yearPattern.exec(text);
        if (match) {
            yearPositions[year] = match.index;
            console.log(`[PARSE] Year ${year} found at index ${match.index}`);
        } else {
            console.log(`[PARSE] Year ${year} NOT found in text`);
        }
    });

    // Find major section markers (ENDING, WHAT THEY WOULD, GRASS IS)
    const endingMatch = /ENDING:/i.exec(text);
    const lostMatch = /WHAT THEY WOULD/i.exec(text);
    const scoreMatch = /GRASS IS GREENER SCORE:/i.exec(text);

    if (endingMatch) majorSectionStart = endingMatch.index;
    if (lostMatch && lostMatch.index < majorSectionStart) majorSectionStart = lostMatch.index;
    if (scoreMatch && scoreMatch.index < majorSectionStart) majorSectionStart = scoreMatch.index;

    console.log(`[PARSE] Major section starts at index: ${majorSectionStart}`);

    // ========================================
    // STEP 2: EXTRACT EACH YEAR BLOCK
    // ========================================

    years.forEach(year => {
        if (!(year in yearPositions)) {
            console.log(`[PARSE] Skipping year ${year} - not found`);
            return;
        }

        const yearIndex = yearPositions[year];

        // Find the end of this year's block
        let yearEnd = text.length;

        // Check what comes next
        const nextYears = years.filter(y => y > year && y in yearPositions);
        if (nextYears.length > 0) {
            // There's another year after this one
            const nextYearIndex = Math.min(...nextYears.map(y => yearPositions[y]));
            yearEnd = nextYearIndex;
        } else if (majorSectionStart > yearIndex) {
            // This is the last year, cut at major section
            yearEnd = majorSectionStart;
        }

        // Extract the year block substring
        const yearBlock = text.substring(yearIndex, yearEnd);
        console.log(`[PARSE] Year ${year} block length: ${yearBlock.length}`);

        // ========================================
        // STEP 3: EXTRACT WINS AND STRUGGLES USING INDEX-BASED SLICING
        // ========================================

        let wins = '';
        let struggles = '';

        // Find "Wins:" within this block
        const winsIndex = yearBlock.search(/Wins?:/i);
        if (winsIndex !== -1) {
            // Find where wins content ends (either at "Struggles:" or end of block)
            const strugglesIndex = yearBlock.search(/Struggles?:/i);
            const winsEnd = strugglesIndex !== -1 ? strugglesIndex : yearBlock.length;

            // Extract wins text
            const winsRaw = yearBlock.substring(winsIndex + 6, winsEnd);
            wins = cleanContent(winsRaw);
            console.log(`[PARSE] Year ${year} wins extracted: ${wins.substring(0, 50)}...`);
        }

        // Find "Struggles:" within this block
        const strugglesIndex = yearBlock.search(/Struggles?:/i);
        if (strugglesIndex !== -1) {
            // Struggles content goes until end of block
            const strugglesRaw = yearBlock.substring(strugglesIndex + 10);
            struggles = cleanContent(strugglesRaw);
            console.log(`[PARSE] Year ${year} struggles extracted: ${struggles.substring(0, 50)}...`);
        }

        // ========================================
        // STEP 4: APPLY FALLBACK ONLY IF EXTRACTION FAILED
        // ========================================

        if (!wins || wins.length === 0) {
            console.log(`[PARSE] Year ${year} wins EMPTY - applying fallback`);
            wins = 'Gradual progress continued through this period.';
        }

        if (!struggles || struggles.length === 0) {
            console.log(`[PARSE] Year ${year} struggles EMPTY - applying fallback`);
            struggles = 'Ongoing adjustments and learning shaped this year.';
        }

        // Store extracted content
        sections.timeline[`year${year}`] = { wins, struggles };
        console.log(`[PARSE] Year ${year} stored successfully`);
    });

    // ========================================
    // EXTRACT ENDING
    // ========================================

    if (endingMatch) {
        const endingStart = endingMatch.index + endingMatch[0].length;
        const endingEnd = lostMatch ? lostMatch.index : scoreMatch ? scoreMatch.index : text.length;
        const endingRaw = text.substring(endingStart, endingEnd);
        sections.ending = cleanContent(endingRaw);
        console.log(`[PARSE] Ending extracted: ${sections.ending.substring(0, 50)}...`);
    } else {
        sections.ending = 'No path is perfect. Every choice carries hidden costs and unexpected opportunities.';
        console.log(`[PARSE] Ending not found - using fallback`);
    }

    // ========================================
    // EXTRACT LOST FROM PATH
    // ========================================

    if (lostMatch) {
        const lostStart = lostMatch.index + lostMatch[0].length;
        const lostEnd = scoreMatch ? scoreMatch.index : text.length;
        const lostRaw = text.substring(lostStart, lostEnd);

        sections.lostFromPath = lostRaw
            .split('\n')
            .filter(line => line.trim().match(/^[-*•]/))
            .map(line => cleanContent(line.replace(/^[-*•\s]+/, '')))
            .filter(line => line.length > 0);

        console.log(`[PARSE] Lost items extracted: ${sections.lostFromPath.length} items`);
    }

    // ========================================
    // EXTRACT GRASS IS GREENER SCORE
    // ========================================

    if (scoreMatch) {
        const scoreStart = scoreMatch.index + scoreMatch[0].length;
        const scoreRaw = text.substring(scoreStart, Math.min(scoreStart + 50, text.length));
        const scoreNumberMatch = scoreRaw.match(/(\d+)/);

        if (scoreNumberMatch) {
            const scoreValue = parseInt(scoreNumberMatch[1], 10);
            sections.grassIsGreenScore = Math.min(100, Math.max(0, scoreValue));
            console.log(`[PARSE] Score extracted: ${sections.grassIsGreenScore}`);
        }

        // Extract explanation after score
        const explanationStart = scoreStart + scoreRaw.indexOf(scoreNumberMatch[0]) + scoreNumberMatch[0].length;
        const explanationRaw = text.substring(explanationStart);
        sections.explanation = cleanContent(explanationRaw);
        console.log(`[PARSE] Explanation extracted: ${sections.explanation.substring(0, 50)}...`);
    }

    return sections;
}

// ========================================
// HELPER: CLEAN CONTENT
// ========================================

function cleanContent(raw) {
    return raw
        .split('\n')
        .map(line => line.replace(/^[-*•\s]+/, '').trim())
        .filter(line => line.length > 0)
        .join(' ')
        .trim();
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
        const data = parsedData.timeline[key] || { wins: 'Gradual progress continued.', struggles: 'Ongoing adjustments shaped this period.' };

        // ENSURE wins and struggles always have content
        const wins = data.wins || 'Gradual progress continued.';
        const struggles = data.struggles || 'Ongoing adjustments shaped this period.';

        const card = document.createElement('div');
        card.className = 'timeline-card';

        card.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-card-content">
                <div class="timeline-card-title">Year ${year}</div>
                
                <div class="timeline-section">
                    <div class="timeline-section-title">✓ Wins</div>
                    <div class="timeline-section-content">${escapeHtml(wins)}</div>
                </div>
                
                <div class="timeline-section">
                    <div class="timeline-section-title">⚠ Struggles</div>
                    <div class="timeline-section-content">${escapeHtml(struggles)}</div>
                </div>
            </div>
        `;

        timelineContainer.appendChild(card);
    });

    // ENDING CARD - Always render with content
    const endingText = parsedData.ending || 'No path is perfect. Every choice carries hidden costs and unexpected opportunities.';
    const endingCard = document.createElement('div');
    endingCard.className = 'timeline-card';

    endingCard.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-card-content">
            <div class="timeline-card-title">10-Year Perspective</div>
            <div class="timeline-section-content">${escapeHtml(endingText)}</div>
        </div>
    `;

    timelineContainer.appendChild(endingCard);
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
