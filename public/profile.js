document.addEventListener('DOMContentLoaded', function() {
    function displayProfileIcon(iconData) {
        const container = document.getElementById('profile-icon-container');
        container.innerHTML = ''; // Clear previous icon

        if (iconData.startsWith('data:image/')) {
            const img = document.createElement('img');
            img.src = iconData;
            img.alt = 'User Avatar';
            img.className = 'img-fluid rounded-circle';
            img.style.width = '150px';
            img.style.height = '150px';
            img.style.objectFit = 'cover';
            container.appendChild(img);
        } else {
            const icon = document.createElement('i');
            icon.className = `bi ${iconData}`;
            container.appendChild(icon);
        }
    }

    fetch('/api/profile')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const user = data.user;
                const scores = data.scores;

                document.getElementById('name').textContent = `${user.FirstName} ${user.LastName}`;
                document.getElementById('username').textContent = `@${user.username}`;
                document.getElementById('email').textContent = user.email;
                displayProfileIcon(user.profileIcon);

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

    const saveAvatarButton = document.getElementById('save-avatar');
    const avatarInput = document.getElementById('avatar-input');

    saveAvatarButton.addEventListener('click', () => {
        const file = avatarInput.files[0];
        if (!file) {
            return;
        }

        if (file.size > 100 * 1024) {
            avatarInput.classList.add('is-invalid');
            return;
        } else {
            avatarInput.classList.remove('is-invalid');
        }

        const reader = new FileReader();
        reader.onloadend = function() {
            const base64String = reader.result;
            
            fetch('/api/profile/icon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ icon: base64String })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayProfileIcon(data.profileIcon);
                    const modal = bootstrap.Modal.getInstance(document.getElementById('avatarModal'));
                    modal.hide();
                } else {
                    console.error('Failed to upload avatar:', data.message);
                }
            })
            .catch(error => {
                console.error('Error uploading avatar:', error);
            });
        };
        reader.readAsDataURL(file);
    });
});
