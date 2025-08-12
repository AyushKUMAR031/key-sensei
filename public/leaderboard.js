document.addEventListener('DOMContentLoaded', function() {
    let allScores = [];
    let currentUserId = null;
    const rowsPerPage = 10;
    let currentPage = 1;

    function displayLeaderboard(page) {
        currentPage = page;
        const leaderboardBody = document.getElementById('leaderboard-body');
        leaderboardBody.innerHTML = '';
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedScores = allScores.slice(start, end);

        paginatedScores.forEach((score, index) => {
            const rank = start + index + 1;
            const row = document.createElement('tr');
            if (score.user._id === currentUserId) {
                row.classList.add('table-primary'); // Highlight current user
            }
            row.innerHTML = `
                <th scope="row">${rank}</th>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${score.user.profileIcon}" class="rounded-circle me-2" width="30" height="30" alt="User">
                        <span>${score.user.username}</span>
                    </div>
                </td>
                <td>${score.wpm}</td>
                <td>${score.accuracy}%</td>
                <td>${new Date(score.timestamp).toLocaleDateString()}</td>
            `;
            leaderboardBody.appendChild(row);
        });
    }

    function setupPagination() {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(allScores.length / rowsPerPage);

        for (let i = 1; i <= pageCount; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            const a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.innerText = i;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                displayLeaderboard(i);
                
                document.querySelector('.pagination .active').classList.remove('active');
                li.classList.add('active');
            });
            li.appendChild(a);
            paginationContainer.appendChild(li);
        }
    }

    fetch('/api/leaderboard')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                allScores = data.leaderboardScores;
                currentUserId = data.currentUserId;
                const topScoresContainer = document.getElementById('top-scores');
                topScoresContainer.innerHTML = ''; 

                const medals = ['gold', 'silver', 'bronze'];
                data.top3Scores.forEach((score, index) => {
                    const medal = medals[index];
                    const card = `
                        <div class="col-md-4">
                            <div class="card text-center top-scorer ${medal}">
                                <div class="card-body">
                                    <img src="${score.user.profileIcon}" class="rounded-circle mb-3" width="80" height="80" alt="${score.user.username}">
                                    <h5 class="card-title">${score.user.username}</h5>
                                    <p class="card-text display-4">${score.wpm} WPM</p>
                                    <p class="card-text"><small class="text-muted">${score.accuracy}% Accuracy</small></p>
                                    <span class="badge bg-${medal === 'gold' ? 'warning' : (medal === 'silver' ? 'secondary' : 'danger')}">${index + 1}</span>
                                </div>
                            </div>
                        </div>
                    `;
                    topScoresContainer.innerHTML += card;
                });

                displayLeaderboard(1);
                setupPagination();

            } else {
                console.error('Failed to fetch leaderboard data:', data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching leaderboard data:', error);
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