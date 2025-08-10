document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const formData = {};
        for (const input of loginForm.elements) {
            if (input.name) {
                formData[input.name] = input.value;
            }
        }

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Toastify({
                    text: data.message,
                    duration: 3000,
                    close: true,
                    gravity: "bottom", 
                    position: "right", 
                    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                }).showToast();
                setTimeout(() => {
                    window.location.href = '/home';
                }, 2000);
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            Toastify({
                text: error.message || "Login failed. Please check your credentials.",
                duration: 3000,
                close: true,
                gravity: "bottom",
                position: "right",
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
            }).showToast();
        });
    });
});
