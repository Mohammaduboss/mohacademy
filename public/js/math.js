document.addEventListener('DOMContentLoaded', () => {
    
    // --- Calculus Concept Engine ---
    const checkAnswerBtn = document.getElementById('check-quiz-answer');
    const quizFeedback = document.getElementById('quiz-feedback');
    const quizLinkWrapper = document.getElementById('quiz-link-wrapper');
    const quizOptions = document.querySelectorAll('input[name="math_q1"]');
    const correctAnswer = 'A'; 

    if (checkAnswerBtn) {
        checkAnswerBtn.addEventListener('click', () => {
            let selectedAnswer = null;
            quizOptions.forEach(option => {
                if (option.checked) {
                    selectedAnswer = option.value;
                }
            });

            if (selectedAnswer) {
                if (selectedAnswer === correctAnswer) {
                    quizFeedback.innerHTML = "<strong>Correct!</strong> You successfully applied the power rule for differentiation: $3x^2 - 4x + 5$.";
                    quizFeedback.className = 'quiz-feedback correct';
                } else {
                    quizFeedback.innerHTML = "<strong>Incorrect.</strong> The valid derivative is A ($3x^2 - 4x + 5$). Review your differentiation power rules!";
                    quizFeedback.className = 'quiz-feedback incorrect';
                }
                quizFeedback.style.display = 'block'; 
                quizLinkWrapper.style.display = 'block'; 
                checkAnswerBtn.style.display = 'none'; 
                disableQuizOptions(); 
            } else {
                quizFeedback.textContent = "Please select a mathematical proof to evaluate.";
                quizFeedback.className = 'quiz-feedback incorrect'; 
                quizFeedback.style.display = 'block';
            }
            
            // Re-trigger MathJax to format feedback LaTeX securely
            if (window.MathJax) {
                MathJax.typesetPromise([quizFeedback]);
            }
        });
    }

    function disableQuizOptions() {
        quizOptions.forEach(option => { option.disabled = true; });
    }

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            quizOptions.forEach(option => {
                option.checked = false;
                option.disabled = false;
            });
            if (quizFeedback) quizFeedback.style.display = 'none';
            if (quizLinkWrapper) quizLinkWrapper.style.display = 'none';
            if (checkAnswerBtn) checkAnswerBtn.style.display = 'block';
        }
    });

    // Boot MathJax
    if (window.MathJax) {
        MathJax.typesetPromise();
    }

    
});