

$(document).ready(function() {

    $('#loginForm').submit(function(event) {
        
        event.preventDefault(); 

        const username = $('#username').val();
        const password = $('#password').val();

        // ToDo
        if (username && password) {
            $.ajax({
                url: '/api/login', // URL to your backend login endpoint
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ username: username, password: password }),
                success: function(response) {
                    if (response.success) {
                        console.log(response);
                        localStorage.setItem('username', response.user.user_name);
                        localStorage.setItem('usertype', response.user.subscription);
                        localStorage.setItem('userid', response.user.user_id);

                        // Redirect to home page upon successful login
                        window.location.href = '/homePage';
                    } else {
                        alert('Login failed: ' + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    alert('Login Failed due to Error :' + error);
                }
            });
        } else {
            alert('Please enter both username and password.');
        }

        // fetch('/api/login',{
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ username: username, password : password })
        // }).then(response => {return response.json();
        // }).then(data => {
        //         console.log("wdwqew");
        //         console.log(data);
        // }).catch(error => console.error('Error fetching data:', error));
    });
});