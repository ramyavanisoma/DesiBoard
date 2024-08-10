$(document).ready(function(){

  
    
    // This will create header html
    function createHeader()
    {
        return `
        <header>
        <h1><a id="desiBoardTitle" href="homePage">Desi Board</a></h1>
        <nav class = ".navbar">

        <ul>
            <li id="askAnExpert">Ask an Expert</li>
            <li><a href="aboutUs">About Us</a></li>
            <div class="dropdown">
                <li id="dropdown" >General Info</li>
                <div class="dropdown-content"> 
                <a href="emergency">Emergency</a>
                <a href="legal">Legal</a>
                <a href="visa">Visa</a>
                <a href="credit">CreditCard</a>
                <a href="health">Health Care</a>
                </div>
            </div>
            <li><a href="/" id = "logout">Logout</a></li>
        </ul>
        </nav>
        <!-- The Modal -->
    <div id="paymentModal" class="modal">
        <!-- Modal content -->
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Payment Details</h2>
            <form id="paymentForm">
                <label for="cardName">Name on Card:</label>
                <input type="text" id="cardName" name="cardName" required>

                <label for="cardNumber">Card Number:</label>
                <input type="text" id="cardNumber" name="cardNumber" required>

                <label for="expDate">Expiry Date:</label>
                <input type="text" id="expDate" name="expDate" placeholder="MM/YY" required>

                <label for="cvv">CVV:</label>
                <input type="text" id="cvv" name="cvv" required>

                <button id="paymentsubmitbtn" class ="btn  btn-primary" type="submit">Submit Payment</button>
            </form>
        </div>
    </div>

       </header> `;
    }
    function generateHeader()
    {
        const headerContainer = $('#header-placeholder');
        headerContainer.append(createHeader())
    }

    generateHeader();

    //background color 
    const body = document.querySelector('body');
    body.style.background = 'linear-gradient(to right, #e6f7ff, #cce0ff)'; // Light blue gradient
    body.style.color = '#333'; // Set text color for better readability


    // Get the modal
    var modal = $('#paymentModal');
    
    // Get the button that opens the modal
    var btn = $('#askAnExpert');

    // Get the <span> element that closes the modal
    var span = $('.close');

    // When the user clicks the button, open the modal
    btn.click(function() {
        var usertype = localStorage.getItem('usertype');

        if(usertype !== "premium")
        {
            modal.show();
        }
        else{
            // Redirect to the scheduleAppointment page
            window.location.href = '/scheduleAppointment';
        }
        
    });

    // When the user clicks on <span> (x), close the modal
    span.click(function() {
        modal.hide();
    });

    // When the user clicks anywhere outside of the modal, close it
    $(window).click(function(event) {
        if ($(event.target).is(modal)) {
            modal.hide();
        }
    });


    $('#logout').click(function() {
        // Clear local storage
        localStorage.clear();

        // Redirect to login page
        window.location.href = '/login';
    });

    // Handle payment submission
   
    $('#paymentForm').submit(function(event) {
        event.preventDefault(); // Prevent the default form submission

        var userid = localStorage.getItem('userid');

        // Send the form data to the backend via AJAX
        $.ajax({
            url: '/api/payment',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify( {userId: userid }),
            success: function(response) {
                // Handle successful response
                console.log(response.message);

                localStorage.setItem("usertype", "premium");

                // Redirect to the scheduleAppointment page
                window.location.href = '/scheduleAppointment';
            },
            error: function(xhr, status, error) {
                // Handle error response
                alert('Error: ' + xhr.responseJSON.error);
            }
        });
    });
})




