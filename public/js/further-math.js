document.addEventListener('DOMContentLoaded', () => {
    
    // --- Further Math Advanced Proof Engine (Corrected Logic) ---
    const checkAnswerBtn = document.getElementById('check-quiz-answer');
    const quizFeedback = document.getElementById('quiz-feedback');
    const quizLinkWrapper = document.getElementById('quiz-link-wrapper');
    const quizOptions = document.querySelectorAll('input[name="further_math_q1"]');
    const correctAnswer = 'B'; 

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
                    quizFeedback.innerHTML = "<strong>Correct!</strong> To find the inverse of $y = \\sinh(x)$, solve $x = \\frac{e^y - e^{-y}}{2}$. Multiplying by $2e^y$ yields the quadratic $(e^y)^2 - 2x(e^y) - 1 = 0$. Solving via the quadratic formula gives $e^y = x + \\sqrt{x^2 + 1}$. Thus, $y = \\ln(x + \\sqrt{x^2 + 1})$.";
                    quizFeedback.className = 'quiz-feedback correct';
                } else {
                    quizFeedback.innerHTML = "<strong>Incorrect.</strong> The valid expression is B. Remember that solving $x = \\sinh(y)$ requires formulating and solving a quadratic equation in terms of $e^y$, leading to $\\ln(x + \\sqrt{x^2 + 1})$.";
                    quizFeedback.className = 'quiz-feedback incorrect';
                }
                quizFeedback.style.display = 'block'; 
                quizLinkWrapper.style.display = 'block'; 
                checkAnswerBtn.style.display = 'none'; 
                disableQuizOptions(); 
            } else {
                quizFeedback.textContent = "Please formulate and select a mathematical proof parameter.";
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

    // Boot MathJax Initialization
    if (window.MathJax) {
        MathJax.typesetPromise();
    }


});