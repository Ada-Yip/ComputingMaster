// ==========================================
// Practice Page Logic
// ==========================================

let questions = [];
let currentIndex = 0;
let selectedAnswer = null;
let answers = [];

const loadingEl = document.getElementById('loading');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const progressEl = document.getElementById('progress');
const topicBadge = document.getElementById('topic-badge');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackEl = document.getElementById('feedback');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const resultSummary = document.getElementById('result-summary');


async function init() {
    try {
        const res = await api.getQuestions();
        questions = res.data;

        if (questions.length === 0) {
            loadingEl.innerHTML = '<p>No questions available.</p>';
            return;
        }

        loadingEl.style.display = 'none';
        quizContainer.style.display = 'block';
        renderQuestion();
    } catch (error) {
        console.error(error);
        loadingEl.innerHTML = `<p style="color: red;">Failed to load questions: ${error.message}</p>`;
    }
}


function renderQuestion() {
    const q = questions[currentIndex];
    selectedAnswer = null;

    progressEl.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
    topicBadge.textContent = q.topic;

    questionText.textContent = q.question_text;

    optionsContainer.innerHTML = '';
    const options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;

    Object.entries(options).forEach(([key, value]) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.dataset.key = key;
        optionDiv.innerHTML = `
            <span class="option-key">${key}</span>
            <span class="option-text"></span>
        `;
        optionDiv.querySelector('.option-text').textContent = value;

        optionDiv.addEventListener('click', () => selectOption(optionDiv, key));
        optionsContainer.appendChild(optionDiv);
    });

    submitBtn.style.display = 'inline-block';
    submitBtn.disabled = true;
    nextBtn.style.display = 'none';
    feedbackEl.style.display = 'none';
    feedbackEl.innerHTML = '';
}


function selectOption(el, key) {
    document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    selectedAnswer = key;
    submitBtn.disabled = false;
}

submitBtn.addEventListener('click', () => {
    if (!selectedAnswer) return;

    const q = questions[currentIndex];
    const isCorrect = selectedAnswer === q.answer;

    answers.push({
        qid: q.qid,
        selected_answer: selectedAnswer,
        is_correct: isCorrect
    });

    document.querySelectorAll('.option').forEach(opt => {
        const key = opt.dataset.key;
        if (key === q.answer) opt.classList.add('correct');
        if (key === selectedAnswer && !isCorrect) opt.classList.add('wrong');
        opt.style.pointerEvents = 'none';
    });

    feedbackEl.style.display = 'block';
    feedbackEl.className = `feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`;
    feedbackEl.innerHTML = `
        <p><strong>${isCorrect ? 'Correct!' : 'Incorrect'}</strong></p>
        <p>${q.explanation || ''}</p>
    `;

    submitBtn.style.display = 'none';
    nextBtn.style.display = 'inline-block';

    if (currentIndex === questions.length - 1) {
        nextBtn.textContent = 'See Results';
    }
});

nextBtn.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex < questions.length) {
        renderQuestion();
    } else {
        showResults();
    }
});


function showResults() {
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';

    const correctCount = answers.filter(a => a.is_correct).length;
    const total = answers.length;
    const percentage = Math.round((correctCount / total) * 100);

    resultSummary.textContent = `You scored ${correctCount} out of ${total} (${percentage}%).`;

    console.log('Answers to submit:', answers);
}

init();