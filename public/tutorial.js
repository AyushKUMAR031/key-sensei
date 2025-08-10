document.addEventListener('DOMContentLoaded', function() {
    const logoutLink = document.querySelector('a[href="/logout"]');
    if(logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();
            fetch('/logout')
                .then(() => window.location.href = '/')
                .catch(error => console.error('Logout failed:', error));
        });
    }

    const profileLink = document.querySelector('a[href="/profile"]');
    if(profileLink) {
        profileLink.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = '/profile';
        });
    }
});
