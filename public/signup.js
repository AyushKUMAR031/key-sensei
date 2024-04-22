document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Serialize form data into JSON format
        const formData = {};
        for (const input of signupForm.elements) {
            if (input.name) {
                formData[input.name] = input.value;
            }
        }

        // Send POST request to server with form data
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.ok) {
                    return response.text(); // Successful signup
                } else {
                    throw new Error('Signup failed'); // Error during signup
                }
            })
            .then(data => {
                console.log(data); // Log success message
                // Redirect to login page or show success message
            })
            .catch(error => {
                console.error('Error during signup:', error); // Log error message
                // Display error message to user
            });
    });
});
