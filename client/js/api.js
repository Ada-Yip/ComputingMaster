// ==========================================
// API control
// ==========================================

const api = {
    async getQuestions(topic = null) {
        let url = `/api/questions`;
        if (topic) url += `?topic=${encodeURIComponent(topic)}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch questions');
        return res.json();
    },

    async submitAttempt(uid, answers) {
        const res = await fetch(`/api/attempts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid, answers })
        });
        if (!res.ok) throw new Error('Failed to submit attempt');
        return res.json();
    }
};