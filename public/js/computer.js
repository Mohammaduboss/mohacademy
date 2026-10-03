document.addEventListener('DOMContentLoaded', () => {
    
    // --- Computer Science Concept Engine (Corrected Logic) ---
    const checkAnswerBtn = document.getElementById('check-quiz-answer');
    const quizFeedback = document.getElementById('quiz-feedback');
    const quizLinkWrapper = document.getElementById('quiz-link-wrapper');
    const quizOptions = document.querySelectorAll('input[name="computer_q1"]');
    const correctAnswer = 'C'; 

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
                    quizFeedback.innerHTML = "<strong>Correct!</strong> A Stack operates on a Last-In, First-Out (LIFO) principle, similar to a stack of plates. Data pushed last is popped first.";
                    quizFeedback.className = 'quiz-feedback correct';
                } else {
                    quizFeedback.innerHTML = "<strong>Incorrect.</strong> The valid structure is C (Stack). Queues utilize FIFO (First-In, First-Out), while Trees and Lists have different traversal logic.";
                    quizFeedback.className = 'quiz-feedback incorrect';
                }
                quizFeedback.style.display = 'block'; 
                quizLinkWrapper.style.display = 'block'; 
                checkAnswerBtn.style.display = 'none'; 
                disableQuizOptions(); 
            } else {
                quizFeedback.textContent = "Please select a computational logic parameter to evaluate.";
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