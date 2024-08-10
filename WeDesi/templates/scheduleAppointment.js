$(document).ready(function() {

    // document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    //     event.preventDefault();
        
    //     // Form validation
    //     const description = document.getElementById('description').value.trim();
    //     const category = document.getElementById('category').value;
    
    //     if (description === "" || category === "") {
    //         alert("Please fill out all fields.");
    //         return;
    //     }
    
    //     // Show confirmation message
    //     document.getElementById('confirmation').style.display = 'block';
        
    //     // Reset form
    //     document.getElementById('appointmentForm').reset();
    // });
    
    $('#appointmentForm').submit(function(event) {
        event.preventDefault(); // Prevent the default form submission

        var title = $('#title').val().trim();
       
        var description = $('#description').val().trim();
        console.log('title id:', title);
        console.log('descr id:', description);

        var userid = localStorage.getItem('userid');

        if (userid) {
            console.log('Usesssssr id:', userid);
        } else {
            // Redirect to login page if no user details are found
            window.location.href = '/login';
        }

        if (!title || !description) {
            $('#confirmation').text('Title, description are required.');
            return;
        } 
        
        // Capture the form data
        var formData = {
            userId: userid,
            category: $('#category').val(),
            title: title,
            description: description
        };
        console.log(formData);

        // Send the form data to the backend via AJAX
        $.ajax({
            url: '/api/schedule_appointment',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {

                $('#confirmation').text(response.message);
                $('#confirmation').addClass('alert alert-success mt-3');
                document.getElementById('appointmentForm').reset();
            },
            error: function(xhr, status, error) {
                $('#confirmation').addClass('alert alert-danger mt-3');
                $('#confirmation').text('An error occurred: ' + error+ 'Please try again.');
            }
        });
    });

});
