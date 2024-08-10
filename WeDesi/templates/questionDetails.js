// const question={
//     "question_id" :"1",
//     "title": "Understanding JavaScript Closures",
//     "description": "A comprehensive guide to understanding closures in JavaScript, their uses, and common pitfalls.",
//     "author_name": "Alice Johnson",
//     "createdTimeStamp": "2023-07-18T10:00:00Z",
//     "comments": [
//       {
//         "description": "This article really helped me grasp the concept of closures. Thank you!",
//         "author_name": "Bob Smith",
//         "createdTimeStamp": "2023-07-18T11:15:00Z",
//         "numberOfUpVotes": 15,
//         "isLikeDisabled" : true
//       },
//       {
//         "description": "Can you provide more examples of closures in a real-world scenario?",
//         "author_name": "Carol White",
//         "createdTimeStamp": "2023-07-18T12:30:00Z",
//         "numberOfUpVotes": 8,
//         "isLikeDisabled" : false
//       },
//       {
//         "description": "The examples were very helpful. Could you write more about advanced topics in JavaScript?",
//         "author_name": "Henry Taylor",
//         "createdTimeStamp": "2023-07-18T17:00:00Z",
//         "numberOfUpVotes": 12,
//         "isLikeDisabled" : false
//       },
      
//       {
//         "description": "This is one of the best explanations of closures I've read. Well done!",
//         "author_name": "Kathy Adams",
//         "createdTimeStamp": "2023-07-18T20:45:00Z",
//         "numberOfUpVotes": 22,
//         "isLikeDisabled" : false
//       }
//     ]
//   }
  
  document.getElementById('myTextarea').addEventListener('input', function() {
    const charCount = this.value.length;
    document.getElementById('charCount').innerText = charCount + ' characters';
});

function getQueryParams() {
    var params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Get the query parameter
var id = getQueryParams();

console.log(id);



$(document).ready(function(){

    function createQuestionCard(item) {
        return `
        <div class="row mt-3">
            <div class="col-md-10 mb-10 mx-auto">
                <div class="card">
                    <div class="card-body" >
                        <h5 class="card-title font-weight-bold">${item.title}</h5>
                        <p class="card-text">${item.description}</p>
                        <p id="questionAuthor"class="card-text"><small class="text-muted">By ${item.author_name} on ${item.createdTimeStamp}</small></p>
                    </div>
                </div>
            </div>
            </div>
        `;
    }

    function createAnswersCard(item) {
        return `
        <div class="row mt-3">
            <div class="col-md-10 mb-10 mx-auto">
                <div class="card" data-answer-id=${item.answer_id}>
                    <div class="card-body">
                        <p class="card-text">${item.description}</p>
                        <div id="upvoteAndAuthorinAnswerCard"class="row">
                            <div class="col-md-4">
                                <a class= "like active-icon" ><i class="fas fa-thumbs-up"></i></a>&nbsp<span  class="upVotes">${item.like_count}</span>
                            </div>
                            <div class="col-md-8">
                                <p id="questionAuthor"class="card-text"><small class="text-muted">By ${item.author_name} on ${item.created_at}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        `;
    }
    

    function generateQuestionDetailCards(question){

        // Generate and append cards to the container
        const questionCardContainer = $('.question');

            questionCardContainer.append(createQuestionCard(question))
            
            const numberOfAnswers=$('#numOfAnswers')
            numberOfAnswers.append(question.answers.length+ " Answers")

            const answersCardContainer=$('.answers');

            question.answers.forEach(item => {
                 answersCardContainer.append(createAnswersCard(item));
            });
    }

    // Retrieve the data from session storage
    var questionDetails = JSON.parse(sessionStorage.getItem('questionDetails'));

    if (questionDetails) {
        console.log(questionDetails);
        generateQuestionDetailCards(questionDetails);
    }
    
    $('#submitAnswerButton').click(function() {
        var question = JSON.parse(sessionStorage.getItem('questionDetails'));
        var answerContent = $('#myTextarea').val().trim();
        var authorId = localStorage.getItem('userid');
        var questionId = question.question_id;

        if (answerContent === '') {
            return;
        }

        $.ajax({
            url: '/api/add-answer',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                content: answerContent,
                author_id: authorId,
                question_id: questionId
            }),
            success: function(response) {
                if (response.success) {
                    //var answer = response.answer;

                    // const answersCardContainer=$('.answers');
                    // console.log(response.answer);
                    
                    // answersCardContainer.append(createAnswersCard(answer));
                    $('#myTextarea').val(''); // Clear the textarea
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                alert('An error occurred: ' + error);
            }
        });
    });

    $(document).on('click', '.like', function() {
        var answerId = $(this).closest('.card').data('answer-id');
       

        $.ajax({
            url: '/api/like-answer',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                answer_id: answerId
            }),
            success: function(response) {
                if (response.success) {
                    // var voteCountElem = $(this).siblings('.vote-count');
                    // var currentVotes = parseInt(voteCountElem.text());
                    // voteCountElem.text(currentVotes + 1);
                    var $valueContainer = $(this).siblings(".upVotes");

                    // Get the current value from the <p> tag
                    var currentValue = parseInt($valueContainer.text());
                   
                    // Increment the value by 1
                    var newValue = currentValue + 1;
                   
                    // Update the <p> tag with the new value
                    $valueContainer.text(newValue);
            
                    $(this).removeClass("active-icon").addClass("disabled-icon");;

                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                alert('An error occurred: ' + error);
            }
        });
    });

    $(".like").on("click", function(event){
        event.preventDefault(); // Prevent the default action

        // Find the sibling <p> tag with the class 'valueContainer'
        var $valueContainer = $(this).siblings(".upVotes");

        // Get the current value from the <p> tag
        var currentValue = parseInt($valueContainer.text());
       
        // Increment the value by 1
        var newValue = currentValue + 1;
       
        // Update the <p> tag with the new value
        $valueContainer.text(newValue);

        $(this).removeClass("active-icon").addClass("disabled-icon");;
       
    });
});