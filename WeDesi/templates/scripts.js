

$(document).ready(function(){

    var username = localStorage.getItem('username');

    if (username) {
        console.log('User details:', username);
        // Display welcome message
        $('#welcomeMessage').text('Welcome, ' + username+'!');
    } else {
        // Redirect to login page if no user details are found
        window.location.href = '/login';
    }

    // $("#card-container").on('click', '.card', function(){
    //     //$(this).addClass("toggled");
    //     var id = $(this).data('title');
    //     window.location.href = "questionDetails?id="+id;
    //   });
 });

    document.addEventListener('DOMContentLoaded', function() {
        // Apply background gradient
        const body = document.querySelector('body');
        body.style.background = 'linear-gradient(to right, #f0f2f5, #0073e6)';
        body.style.color = '#333'; // Set text color for better readability
    
        
      

        
        
    //Fetching recent questions on home page load
    
    const recent_questions=[
        {
          "question_id": 1,
          "title": "no visa slots available",
          "description": "What if there are no visa slots available?",
          "author_name": "John Smith",
          "created_at": "2023-05-12T08:30:00Z"
        },
        {
          "question_id": 2,
          "title": "Cooking with Passion",
          "description": "A collection of gourmet recipes that bring joy and flavor to the kitchen.",
          "author_name": "Jane Doe",
          "created_at": "2023-06-25T14:45:00Z"
        },
        {
          "question_id": 3,
          "title": "The Lost City",
          "description": "A thrilling journey to uncover the secrets of an ancient, forgotten metropolis.",
          "author_name": "Emily Clark",
          "created_at": "2023-07-03T10:20:00Z"
        },
        {
          "question_id": 4,
          "title": "Digital Revolution",
          "description": "Exploring the impact of technology on modern society and future trends.",
          "author_name": "Michael Brown",
          "created_at": "2023-04-15T09:00:00Z"
        },
        {
          "question_id": 5,
          "title": "Gardening Tips for Beginners",
          "description": "Essential advice and techniques for starting your own garden.",
          "author_name": "Sarah Wilson",
          "created_at": "2023-03-22T13:30:00Z"
        },
        {
          "question_id": 6,
          "title": "Mindfulness and Meditation",
          "description": "A guide to achieving peace and balance through mindfulness practices.",
          "author_name": "David Lee",
          "created_at": "2023-02-18T17:00:00Z"
        },
        {
          "question_id": 7,
          "title": "Exploring the Cosmos",
          "description": "An introduction to the wonders of space and the universe.",
          "author_name": "Laura Davis",
          "created_at": "2023-01-11T16:15:00Z"
        },
        {
          "question_id": 8,
          "title": "History's Greatest Inventions",
          "description": "A look at the innovations that have shaped human progress.",
          "author_name": "Paul Johnson",
          "created_at": "2023-08-19T11:50:00Z"
        },
        {
          "question_id": 9,
          "title": "Fitness and Well-being",
          "description": "Strategies and tips for maintaining a healthy lifestyle and physical fitness.",
          "author_name": "Anna Martinez",
          "created_at": "2023-09-27T07:40:00Z"
        },
        {
          "question_id": 10,
          "title": "Art and Creativity",
          "description": "Exploring the various forms of artistic expression and creativity.",
          "author_name": "Mark Thompson",
          "created_at": "2023-10-05T15:25:00Z"
        }
      ];
    
      //Creating card for home page questions
      
    $(document).ready(function(){


        function createCard(item) {
            return `
            <div class="row mt-3">
                <div class="col-md-10 mb-10 mx-auto">
                    <div class="card" data-question-id=${item.question_id}>
                        <div class="card-body">
                            <h5 class="card-title font-weight-bold">${item.title}</h5>
                            <p class="card-text">${item.description}</p>
                            <p id="questionAuthor"class="card-text"><small class="text-muted">By ${item.author_name} on ${item.created_at}</small></p>
                        </div>
                    </div>
                </div>
                </div>
            `
        }

        function generateQuestionCards(questionsdata){
            const cardContainer = $('#card-container');
                // Generate and append cards to the container

                cardContainer.empty();
                questionsdata.forEach(item => {
                     cardContainer.append(createCard(item));
                });
                
        }
        
       // generateQuestionCards(recent_questions);


        $('#searchBar').keypress(function(event) {
            if (event.which === 13) { // Enter key corresponds to keycode 13
                $('#searchButton').click();
            }
        });
        
        // document.getElementById('searchButton').addEventListener('click', function() {
        //     const keywords = $('#searchBar').val();
        //     console.log(keywords);
        //         if (typeof keywords !== 'string' ||keywords.trim() === '') {
        //             return;
        //         }
        //         else
        //         {
                   
        //         }
        //         // else if (typeof keywords === 'string' && keywords.trim() !== '') {
        //         //     const filteredQuestions = filterQuestions(keywords.trim());
                    
        //         //     generateQuestionCards(filteredQuestions);
        //         // } 
        //         // else {
        //         //     generateQuestionCards(recent_questions);
        //         // }
        // });

        $('#searchButton').click(function() {
            var searchInput = $('#searchBar').val().trim();

            if (searchInput === '') {
                // alert('Please enter a search term.');
                return;
            }

            $.ajax({
                url: '/api/search',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ search_input: searchInput }),
                success: function(response) {
                    if (response.success) {
                        generateQuestionCards(response.questions);
                    } else {
                        alert('Error: ' + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    alert('An error occurred: ' + error);
                }
            });
        });


        function filterQuestions(keywords) {
            return recent_questions
                .filter(question => question.Description.toLowerCase().includes(keywords.toLowerCase()) || question.Title.toLowerCase().includes(keywords.toLowerCase()))
                .sort((a, b) => new Date(b.date) - new Date(a.date));
        }


        // submit the question
        $('#submitQuestionBtn').click(function() {
            var title = $('#title').val().trim();
            var description = $('#description').val().trim();

            var userid = localStorage.getItem('userid');

            if (userid) {
                console.log('User id:', userid);
            } else {
                // Redirect to login page if no user details are found
                window.location.href = '/login';
            }

            var authorId = userid;

            if (!title || !description || !authorId) {
                $('#responseMessage').text('Title, description are required.');
                return;
            }

            $.ajax({
                url: '/api/add-question',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ title: title, description: description, author_id: authorId }),
                success: function(response) {
                    if (response.success) {
                        $('#responseMessage').text('Question added successfully.');
                        $('#title').val('');
                        $('#description').val('');
                    } else {
                        $('#responseMessage').text('Error: ' + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    $('#responseMessage').text('An error occurred: ' + error);
                }
            });
        });

        //get recent questions
        $.ajax({
            url: '/api/recent-questions',
            method: 'GET',
            success: function(response) {
                if (response.success) {
                    generateQuestionCards(response.questions);
                } else {
                    alert('Failed to fetch recent questions.');
                }
            },
            error: function(xhr, status, error) {
                alert('An error occurred: ' + error);
            }
        });

        //Question card click event
        $("#card-container").on('click', '.card', function(){
            console.log("aasdsadasd")
            var questionId = $(this).data('question-id');
            var questionTitle = $(this).find('.card-title').text();
            var questionDescription = $(this).find('.card-text').first().text();
            var questionAuthor = $(this).find('#questionAuthor').text().split('By ')[1].split(' on ')[0];
            var questionCreatedAt = $(this).find('#questionAuthor').text().split(' on ')[1];

            $.ajax({
                url: '/api/get-answers',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ question_id: questionId }),
                success: function(response) {
                    if (response.success) {

                        var questionDetails = {
                            question_id: questionId,
                            title: questionTitle,
                            description: questionDescription,
                            author_name: questionAuthor,
                            created_at: questionCreatedAt,
                            answers: response.answers === undefined ? [] : response.answers
                        };

                        sessionStorage.clear();
                        // Store the response in session storage
                        sessionStorage.setItem('questionDetails', JSON.stringify(questionDetails));

                        // Redirect to questiondetails.html
                        window.location.href = '/questionDetails';
                    } else {
                        alert('Error: ' + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    alert('An error occurred: ' + error);
                }
            });
        });


    })
    
    })
    


