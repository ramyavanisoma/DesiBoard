$(document).ready(function() {

    const body = document.querySelector('body');
    body.style.background = 'linear-gradient(to right, #e6f7ff, #cce0ff)'; // Light blue gradient
    body.style.color = '#333'; // Set text color for better readability


    $('#expertDetails').hide(); // Hide the expert details dropdown by default

    $('#role').change(function() {
        if ($(this).val() === 'customer') {
            $('#expertDetails').hide();
        } else if ($(this).val() === 'expert') {
            $('#expertDetails').show();
        } else {
            $('#expertDetails').hide(); // Hide if the default option is selected
        }
    });

    $('#signupForm').submit(function(event) {
        
        event.preventDefault(); 

        var isValid = true;
        var errorMessage = '';

        // Retrieve form values
        var role = $('#role').val();
        var category = $('#signUpcategory').val();
        var name = $('#name').val();
        var phone = $('#phone').val();
        var email = $('#signupemail').val();
        var password = $('#signuppassword').val();
        var address = $('#address').val();

        // Validate role and category
        if (role === '') {
            errorMessage += 'Please select a role.\n';
            isValid = false;
        }
        if (role === 'expert' && category === '') {
            errorMessage += 'Please select a category.\n';
            isValid = false;
        }

        // Validate password
        var passwordRegex = /^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d).{5,10}$/;
        if (!passwordRegex.test(password)) {
            errorMessage += 'Password must be between 5 and 10 characters long, contain at least one uppercase letter, and one alphanumeric character.\n';
            isValid = false;
        }

        // Check if all required fields are filled
        if (!name || !phone || !email || !address) {
            errorMessage += 'Please fill out all required fields.\n';
            isValid = false;
        }

        // Display error messages and submit form if valid
        if (isValid) {
            $.ajax({
                url: '/api/signup',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ name: name, password: password,
                     email : email, phone: phone, role: role, category : category , address: address}),
                success: function(response) {
                    if (response.success) {
                        
                        // Redirect to home page upon successful login
                        window.location.href = '/';
                    } else {
                        alert('Signup failed: ' + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    alert('Signup Failed due to Error :' + error);
                }
            });
        } else {
            alert('Singup Failed due to Error :' + errorMessage);
        }
        
    });
    
   
});




