document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('mohacademy_token') || localStorage.getItem('token');
    
    if (!token) {
        alert("Authentication required. Please log in to access the Evaluation Arena.");
        window.location.href = "login.html";
        return;
    }


    let currentSubject = "physics";
    let currentTopic = "";
    let currentQuestions = []; // Fetched from DB
    let currentQuestionIdx = 0;
    let userSelections = [];
    let quizTimerInterval;
    let timeRemaining = 0;

    const subjectTopicsContainerBox = document.getElementById('subjectTopicsContainerBox');
    const liveQuizWorkspaceEngine = document.getElementById('liveQuizWorkspaceEngine');

    // 1. Load the Navigation Pills Dynamically from the Database
    window.loadSelectedSubjectTopics = async function(subjectKey, buttonRef) {
        currentSubject = subjectKey;
        
        if(buttonRef) {
            document.querySelectorAll('.subject-selection-btn').forEach(btn => btn.classList.remove('active-subject'));
            buttonRef.classList.add('active-subject');
        }

        subjectTopicsContainerBox.innerHTML = '<div style="color:var(--text-muted); font-size:0.9rem;"><i class="fas fa-spinner fa-spin"></i> Loading topics...</div>';
        
        try {
            // Fetch the exact topics that currently exist for this subject in the DB
            const response = await fetch(`http://localhost:5000/api/quizzes/topics/${currentSubject}`, {
                headers: { 'x-auth-token': token }
            });
            
            if (!response.ok) throw new Error("Failed to fetch topics");
            
            let topicsAvailable = await response.json();
            subjectTopicsContainerBox.innerHTML = "";
            
            if (topicsAvailable.length === 0) {
                subjectTopicsContainerBox.innerHTML = "<span style='color:var(--text-muted);'>No topics found for this subject yet.</span>";
                liveQuizWorkspaceEngine.innerHTML = "<p style='color:var(--text-muted); padding: 20px;'>Check back later for new questions!</p>";
                return;
            }

            topicsAvailable.forEach((topic, idx) => {
                if (topic.includes('grand_prix') || topic.includes('arena')) return;
                const pillBtn = document.createElement('button');
                pillBtn.className = `topic-pill-btn ${idx === 0 ? 'active-topic' : ''}`;
                pillBtn.innerText = topic.charAt(0).toUpperCase() + topic.slice(1);
                pillBtn.onclick = () => activateSelectedQuizTopic(topic, pillBtn);
                subjectTopicsContainerBox.appendChild(pillBtn);
            });
            
            // Auto-load the first topic in the fetched array
            activateSelectedQuizTopic(topicsAvailable[0]);

        } catch (error) {
            console.error(error);
            subjectTopicsContainerBox.innerHTML = "<span style='color:#ef4444;'>Error loading topics.</span>";
        }
    };

    // 2. Fetch the Questions from the Backend
    async function activateSelectedQuizTopic(topicKey, pillRef) {
        currentTopic = topicKey;
        
        if(pillRef) {
            document.querySelectorAll('.topic-pill-btn').forEach(pill => pill.classList.remove('active-topic'));
            pillRef.classList.add('active-topic');
        }

        liveQuizWorkspaceEngine.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--text-muted);"><i class="fas fa-circle-notch fa-spin fa-2x"></i><p>Establishing secure link to database...</p></div>`;

        try {
            const response = await fetch(`http://localhost:5000/api/quizzes/${currentSubject}/${currentTopic}`, {
                headers: { 'x-auth-token': token }
            });

            if (!response.ok) throw new Error("Server error");
            
            currentQuestions = await response.json();
            
            if(currentQuestions.length === 0) {
                liveQuizWorkspaceEngine.innerHTML = "<p style='color:var(--text-muted); padding: 20px;'>No active database entries found for this syllabus topic yet.</p>";
                return;
            }

            currentQuestionIdx = 0;
            userSelections = [];
            
            // --- NEW: TIMER LOGIC ---
            clearInterval(quizTimerInterval); // Reset any old timers
            // Calculate time: 108 seconds per question (Standard GCE pacing)
            timeRemaining = currentQuestions.length * 108; 
            
            startQuizTimer();
            renderActiveQuestionEngineView();

        } catch (error) {
            console.error("Database fetch failed:", error);
            liveQuizWorkspaceEngine.innerHTML = "<p style='color:#ef4444;'>Fatal Error: Connection to MohAcademy Core failed.</p>";
        }
    }

    // --- NEW: THE TICKING CLOCK FUNCTION ---
    function startQuizTimer() {
        quizTimerInterval = setInterval(() => {
            timeRemaining--;
            
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            const timerDisplay = document.getElementById('quiz-live-timer');
            const timerContainer = document.getElementById('quiz-timer-badge');
            
            if(timerDisplay) {
                timerDisplay.innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                
                // Panic Mode: Turn red when under 60 seconds
                if(timeRemaining <= 60 && timerContainer) {
                    timerContainer.style.background = '#ef4444';
                    timerContainer.style.animation = 'pulse 1s infinite';
                }
            }
            
            if(timeRemaining <= 0) {
                clearInterval(quizTimerInterval);
                alert("⏳ TIME IS UP! Auto-submitting your evaluation...");
                submitQuizForGrading();
            }
        }, 1000);
    }

    // 3. Render the Quiz UI
    function renderActiveQuestionEngineView() {
        const dataNode = currentQuestions[currentQuestionIdx];
        const totalQuestionsCount = currentQuestions.length;
        const incrementalProgressRatio = (currentQuestionIdx / totalQuestionsCount) * 100;

        liveQuizWorkspaceEngine.innerHTML = `
            <div class="quiz-card-head">
                <h2>Topic Assessment: ${currentTopic.toUpperCase()}</h2>
                <div style="display: flex; gap: 10px;">
                    <div class="live-xp-tracker-badge" id="quiz-timer-badge" style="background: #0f172a; color: white; transition: 0.3s;">
                        <i class="fas fa-clock"></i> <span id="quiz-live-timer">--:--</span>
                    </div>
                    <div class="live-xp-tracker-badge">
                        <i class="fas fa-star"></i> <span>Valued at ${dataNode.xpValue} XP</span>
                    </div>
                </div>
            </div>

            <div class="quiz-progress-bar-rail">
                <div class="quiz-progress-bar-fill" style="width: ${incrementalProgressRatio}%;"></div>
            </div>

            <div class="quiz-question-box-text">
                <strong>Q${currentQuestionIdx + 1}:</strong> ${dataNode.question}
            </div>

            <div class="quiz-interactive-options-list" id="optionsWrapperListGroup">
                ${dataNode.options.map((opt, i) => `
                    <button class="quiz-answer-option-row" onclick="trackStudentChoiceSelection(${i}, this)">
                        <span>${opt}</span>
                        <i class="far fa-circle" id="checkCircleIcon_${i}"></i>
                    </button>
                `).join('')}
            </div>

            <div class="quiz-engine-footer-controls">
                <div class="quiz-current-index-lbl">
                    Question ${currentQuestionIdx + 1} of ${totalQuestionsCount}
                </div>
                <button class="quiz-action-next-btn" id="btnNextActionStage" disabled onclick="advanceToNextEvaluationNode()">
                    Next Task <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;

        if (window.MathJax) { MathJax.typesetPromise([liveQuizWorkspaceEngine]); }
    }

    window.trackStudentChoiceSelection = function(selectedIndex, rowElement) {
        document.querySelectorAll('.quiz-answer-option-row').forEach((btn, idx) => {
            btn.classList.remove('selected-node');
            const icon = document.getElementById(`checkCircleIcon_${idx}`);
            if(icon) icon.className = "far fa-circle";
        });

        rowElement.classList.add('selected-node');
        document.getElementById(`checkCircleIcon_${selectedIndex}`).className = "fas fa-dot-circle";

        userSelections[currentQuestionIdx] = selectedIndex;
        document.getElementById('btnNextActionStage').disabled = false;
    };

    window.advanceToNextEvaluationNode = function() {
        currentQuestionIdx++;
        if(currentQuestionIdx < currentQuestions.length) {
            renderActiveQuestionEngineView();
        } else {
            submitQuizForGrading();
        }
    };

    // 4. Send Answers to Server for Grading
    async function submitQuizForGrading() {
        clearInterval(quizTimerInterval); // Stop the clock!
        liveQuizWorkspaceEngine.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--primary-color);"><i class="fas fa-cog fa-spin fa-3x"></i><p style="margin-top: 15px; font-weight: 700;">Transmitting vectors for server-side evaluation...</p></div>`;

        try {
            const response = await fetch(`http://localhost:5000/api/quizzes/grade`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    subject: currentSubject,
                    topic: currentTopic,
                    userSelections: userSelections
                })
            });

            const gradeData = await response.json();
            
            if (gradeData.success) {
                renderCompletedSummaryDashboard(gradeData);
            } else {
                alert("Evaluation Engine Error: " + gradeData.error);
            }

        } catch (error) {
            console.error("Grading failed:", error);
            liveQuizWorkspaceEngine.innerHTML = "<p style='color:#ef4444;'>Network error during submission. Results could not be verified.</p>";
        }
    }

    // 5. Render Results utilizing Backend Data
    function renderCompletedSummaryDashboard(gradeData) {
        const successRatioScore = Math.round((gradeData.correctCount / gradeData.totalQuestions) * 100);

        if(successRatioScore === 100 && typeof confetti === 'function') {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        }

        let badgesHTML = '';
        if (gradeData.newlyUnlockedBadges && gradeData.newlyUnlockedBadges.length > 0) {
            badgesHTML = `<div style="margin-bottom: 20px; color: var(--neon-purple); font-weight: 700;">
                <i class="fas fa-unlock-alt"></i> New Badges Unlocked: ${gradeData.newlyUnlockedBadges.join(', ')}
            </div>`;
        }

        let htmlOutput = `
            <div class="quiz-completion-card-summary">
                <i class="fas fa-trophy trophy-icon"></i>
                <h2>Evaluation Complete!</h2>
                <p>Your matrices have been successfully processed and verified by the server.</p>
                ${badgesHTML}
                
                <div class="score-metrics-row-display">
                    <div class="metric-block-node">
                        <span>${successRatioScore}%</span>
                        <label>Accuracy</label>
                    </div>
                    <div class="metric-block-node">
                        <span>${gradeData.correctCount}/${gradeData.totalQuestions}</span>
                        <label>Resolved</label>
                    </div>
                    <div class="metric-block-node" style="border-color: var(--xp-gold);">
                        <span>+${gradeData.earnedXP}</span>
                        <label>Earned XP</label>
                    </div>
                </div>

                <button class="quiz-reset-btn" onclick="loadSelectedSubjectTopics('${currentSubject}')">
                    <i class="fas fa-redo"></i> Re-test Matrix
                </button>

                <h3 class="review-headline-title"><i class="fas fa-chart-bar"></i> Performance Review & AI Breakdown</h3>
        `;

        // Utilize the reviewData returned by the backend (which includes explanations)
        gradeData.reviewData.forEach((q, idx) => {
            const studentPick = userSelections[idx];
            
            htmlOutput += `
                <div class="review-question-card">
                    <p><strong>Q${idx + 1}: ${q.question}</strong></p>
                    <div class="quiz-interactive-options-list">
                        ${q.options.map((opt, oIdx) => {
                            let nodeClass = "";
                            let iconClass = "far fa-circle";
                            
                            if(oIdx === q.correctAnswerIndex) {
                                nodeClass = "correct-node";
                                iconClass = "fas fa-check-circle";
                            } else if(oIdx === studentPick && studentPick !== q.correctAnswerIndex) {
                                nodeClass = "wrong-node";
                                iconClass = "fas fa-times-circle";
                            }

                            return `
                                <div class="quiz-answer-option-row ${nodeClass}" style="pointer-events: none;">
                                    <span>${opt}</span>
                                    <i class="${iconClass}"></i>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="ai-explanation-box">
                        <strong><i class="fas fa-robot"></i> AI Explanation:</strong> ${q.explanation}
                    </div>
                </div>
            `;
        });

        htmlOutput += `</div>`;
        liveQuizWorkspaceEngine.innerHTML = htmlOutput;

        if (window.MathJax) { MathJax.typesetPromise([liveQuizWorkspaceEngine]); }
    }

    // ==========================================
    // TIMER TRACKING LOOP ENGINE
    // ==========================================
    // ==========================================
    // TIMER TRACKING LOOP ENGINE
    // ==========================================
    async function runGrandPrixTimerLoop() {
        const timerContainer = document.getElementById('grandPrixTargetCountdown');
        if (!timerContainer) return;

        let deadlineTime = null;
        let durationHours = 2; // Defaults to 2 hours
        let arenaTopic = 'grand_prix';
        let arenaSubject = 'physics';

        try {
            const res = await fetch('http://localhost:5000/api/quizzes/arena-schedule');
            const data = await res.json();
            if (data && data.deadline) {
                deadlineTime = new Date(data.deadline).getTime();
                if (data.durationHours) durationHours = data.durationHours;
                if (data.topic) arenaTopic = data.topic;
                if (data.subject) arenaSubject = data.subject;
            }
        } catch (e) {
            console.warn("Could not fetch dynamic deadline.");
            return;
        }

        if (!deadlineTime) return;

        const timerInterval = setInterval(() => {
            const timeNow = new Date().getTime();
            const startGap = deadlineTime - timeNow;
            const closeTime = deadlineTime + (durationHours * 60 * 60 * 1000);
            const endGap = closeTime - timeNow;

            if (startGap > 0) {
                // STATUS: Counting down to OPEN
                const calculatedDays = Math.floor(startGap / (1000 * 60 * 60 * 24));
                const calculatedHours = Math.floor((startGap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const calculatedMins = Math.floor((startGap % (1000 * 60 * 60)) / (1000 * 60));
                const calculatedSecs = Math.floor((startGap % (1000 * 60)) / 1000);

                document.getElementById('lblDays').innerText = calculatedDays.toString().padStart(2, '0');
                document.getElementById('lblHours').innerText = calculatedHours.toString().padStart(2, '0');
                document.getElementById('lblMinutes').innerText = calculatedMins.toString().padStart(2, '0');
                document.getElementById('lblSeconds').innerText = calculatedSecs.toString().padStart(2, '0');
                
            } else if (endGap > 0) {
                // STATUS: Arena is OPEN (Counting down to CLOSE)
                const endHours = Math.floor((endGap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const endMins = Math.floor((endGap % (1000 * 60 * 60)) / (1000 * 60));
                const endSecs = Math.floor((endGap % (1000 * 60)) / 1000);

                timerContainer.innerHTML = `
                    <div style="text-align: center; padding: 20px; animation: paneFadeIn 0.5s;">
                        <h3 style="color: #ef4444; margin-bottom: 15px; font-family: 'Poppins';"><i class="fas fa-fire"></i> ARENA CLOSES IN ${endHours}h ${endMins}m ${endSecs}s</h3>
                        <button onclick="enterLiveArena('${arenaSubject}', '${arenaTopic}')" style="background: var(--xp-gold); color: #0f172a; border: none; padding: 15px 40px; font-size: 1.2rem; font-weight: 800; font-family: 'Poppins'; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(255, 183, 3, 0.4); transition: 0.2s;">
                            <i class="fas fa-bolt"></i> ENTER LIVE ARENA
                        </button>
                    </div>
                `;
            } else {
                // STATUS: Arena is CLOSED
                clearInterval(timerInterval);
                timerContainer.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <h3 style="color: var(--text-muted); font-family: 'Poppins';"><i class="fas fa-lock"></i> The Arena is Closed.</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Wait for the next Grand Prix announcement.</p>
                    </div>
                `;
            }
        }, 1000);
    }

    // Global function to bypass the normal tabs and jump straight into the competition
    window.enterLiveArena = function(subject, topic) {
        document.getElementById('liveQuizWorkspaceEngine').scrollIntoView({ behavior: 'smooth' });
        currentSubject = subject;
        activateSelectedQuizTopic(topic);
    };

    loadSelectedSubjectTopics("physics");
    runGrandPrixTimerLoop();
});