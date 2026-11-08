// ==========================================
// Select Topic Page Logic
// ==========================================

const loadingEl = document.getElementById('loading');
const topicsContainer = document.getElementById('topics-container');

async function init() {
    try {
        // Fetch all questions and determine available topics
        const res = await api.getQuestions();
        const questions = res.data;

        if (questions.length === 0) {
            loadingEl.textContent = 'No questions available.';
            return;
        }

        const topics = [...new Set(questions.map(q => q.topic))];
        renderTopics(topics);
        loadingEl.style.display = 'none';
        topicsContainer.style.display = 'grid';

    } catch (error) {
        console.error(error);
        loadingEl.textContent = 'Failed to load topics. Please try again.';
    }
}

function renderTopics(topics) {
    topicsContainer.innerHTML = '';

    topics.forEach(topic => {
        const card = document.createElement('a');
        card.className = 'topic-card';
        card.href = `practice.html?topic=${encodeURIComponent(topic)}`;
        
        card.innerHTML = `
            <h3>${topic}</h3>
        `;
        
        topicsContainer.appendChild(card);
    });
}

init();