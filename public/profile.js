document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/profile')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const user = data.user;
                const scores = data.scores;

                document.getElementById('name').textContent = `${user.FirstName} ${user.LastName}`;
                document.getElementById('username').textContent = `@${user.username}`;
                document.getElementById('email').textContent = user.email;

                if (scores.length > 0) {
                    const highestScore = scores.reduce((max, score) => max.wpm > score.wpm ? max : score);
                    document.getElementById('highest-score').textContent = `${highestScore.wpm} WPM`;

                    const scoreHistory = document.getElementById('score-history');
                    scores.forEach(score => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${score.wpm}</td>
                            <td>${score.accuracy}%</td>
                            <td>${new Date(score.timestamp).toLocaleDateString()}</td>
                        `;
                        scoreHistory.appendChild(row);
                    });
                } else {
                    document.getElementById('highest-score').textContent = 'N/A';
                }
            } else {
                window.location.href = '/login';
            }
        })
        .catch(error => {
            console.error('Error fetching profile data:', error);
            window.location.href = '/login';
        });

    const logoutLink = document.querySelector('a[href="/logout"]');
    if(logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();
            fetch('/logout')
                .then(() => window.location.href = '/')
                .catch(error => console.error('Logout failed:', error));
        });
    }
});
