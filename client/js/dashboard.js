// ==========================================
// Dashboard Page Logic
// ==========================================

const loadingEl = document.getElementById('loading');
const dashboardContent = document.getElementById('dashboard-content');
const overviewStats = document.getElementById('overview-stats');
const CURRENT_USER_ID = 1;

async function init() {
    try {
        const res = await fetch(`/api/dashboard/${CURRENT_USER_ID}`);
        if (!res.ok) throw new Error('Failed to fetch dashboard data');
        
        const result = await res.json();
        const data = result.data;

        if (!data.attempts || data.attempts.length === 0) {
            loadingEl.innerHTML = '<p>You have not completed any practice sessions yet.</p>';
            return;
        }

        renderOverview(data.attempts);
        renderProficiencyChart(data.proficiency);
        renderHistoryChart(data.attempts);

        loadingEl.style.display = 'none';
        dashboardContent.style.display = 'block';

    } catch (error) {
        console.error(error);
        loadingEl.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

function renderOverview(attempts) {
    const totalAttempts = attempts.length;
    
    let totalScore = 0;
    let totalQuestions = 0;
    
    attempts.forEach(a => {
        totalScore += a.score;
        totalQuestions += a.total_questions;
    });

    const overallAvg = Math.round((totalScore / totalQuestions) * 100);

    overviewStats.innerHTML = `
        <div class="stat-card">
            <h3>Total Practice Sessions</h3>
            <div class="value">${totalAttempts}</div>
        </div>
        <div class="stat-card">
            <h3>Total Questions Answered</h3>
            <div class="value">${totalQuestions}</div>
        </div>
        <div class="stat-card">
            <h3>Overall Accuracy</h3>
            <div class="value">${overallAvg}%</div>
        </div>
    `;
}

function renderProficiencyChart(proficiency) {
    const ctx = document.getElementById('proficiencyChart').getContext('2d');
    
    const labels = proficiency.map(p => p.topic);
    const dataValues = proficiency.map(p => p.percentage);

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Accuracy (%)',
                data: dataValues,
                backgroundColor: 'rgba(139, 115, 85, 0.2)',
                borderColor: 'rgba(90, 62, 43, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(90, 62, 43, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { display: false }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function renderHistoryChart(attempts) {
    const ctx = document.getElementById('historyChart').getContext('2d');
    
    // Format dates (x-axis)
    const labels = attempts.map((a, index) => {
        const date = new Date(a.created_at);
        return `Session ${index + 1}`;
    });

    // Calculate percentage (y-axis)
    const dataValues = attempts.map(a => Math.round((a.score / a.total_questions) * 100));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Score (%)',
                data: dataValues,
                backgroundColor: 'rgba(74, 124, 89, 0.2)',
                borderColor: 'rgba(74, 124, 89, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

init();