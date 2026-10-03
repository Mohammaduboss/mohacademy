document.addEventListener('DOMContentLoaded', () => {
    
    const checkAnswerBtn = document.getElementById('check-quiz-answer');
    const quizFeedback = document.getElementById('quiz-feedback');
    const quizLinkWrapper = document.getElementById('quiz-link-wrapper');
    const quizOptions = document.querySelectorAll('input[name="chemistry_q1"]');
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
                    quizFeedback.innerHTML = "<strong>Correct!</strong> A perfectly neutral aqueous solution operating at 25°C maintains a pH of exactly 7.";
                    quizFeedback.className = 'quiz-feedback correct';
                } else {
                    quizFeedback.innerHTML = "<strong>Incorrect.</strong> The valid formulation is B (7). Review your acid-base equilibrium metrics!";
                    quizFeedback.className = 'quiz-feedback incorrect';
                }
                quizFeedback.style.display = 'block'; 
                quizLinkWrapper.style.display = 'block'; 
                checkAnswerBtn.style.display = 'none'; 
                disableQuizOptions(); 
            } else {
                quizFeedback.textContent = "Please select a chemical parameter to evaluate.";
                quizFeedback.className = 'quiz-feedback incorrect'; 
                quizFeedback.style.display = 'block';
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

    
});