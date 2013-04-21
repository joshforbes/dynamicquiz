var quizModule = function(questionArray, quiz) {
    quiz = $(quiz);
    var questionObjectArray = [];
    var numberOfQuestions = questionArray.length;
    var questionCounter = 0;
    var currentQuestionCounter = 0;

    function Question(question, choices, correctAnswer) {
        this.question = question;
        this.choices = choices;
        this.correctAnswer = correctAnswer;
    }

    Question.prototype = {
        constructor: Question,

        questionHTML: function () {
            var questionElement = '<h1>' + this.question + '</h1><ul>';
            for (var i = 0; i < this.choices.length; i++){
                questionElement += '<li><input type="radio" name="choice' + questionCounter +
                    '" value="' + [i] + '">' + this.choices[i] + '</li>';
            }
            questionElement += '</ul>';
            return questionElement;
        },
        questionToDivElement: function() {
            var div = $('<div />',{
                id: 'question' + questionCounter++,
                addClass: 'question'
            });
            div.html(this.questionHTML());
            return div;
        }
    };

    function createQuestionObject(){
        var question = new Question(questionArray[0]["question"], questionArray[0]["choices"],
            questionArray[0]["answer"]);
        //store our question object in a new array for later reference
        questionObjectArray.push(question);
        //remove the question from the original array
        questionArray.shift();

        quiz.append(question.questionToDivElement().hide());
    }

    function createQuestions(){
        for (var i = 0; i < numberOfQuestions; i++){
            createQuestionObject();
        }
    }

    function getCurrentQuestion(){
        return $('#question' + currentQuestionCounter);
    }

    function createButtons(){
        var nextButton = $('<input />',{
            id: 'quizNext',
            type: 'button',
            addClass: 'button',
            value: 'Next',
            click: nextQuestion
        });

        var previousButton = $('<input />',{
            id: 'quizPrevious',
            type: 'button',
            value: 'Previous',
            addClass: 'button',
            style: 'opacity: 0.4',
            click: previousQuestion
        });

        var submitButton = $('<input />',{
            id: 'submit',
            type: 'button',
            addClass: 'button',
            value: 'Submit',
            click: submit
        });

        quiz.append(previousButton);
        quiz.append(nextButton);
        submitButton.appendTo(quiz).hide();

        //event handler for nextButton
        function nextQuestion() {
            if (currentQuestionCounter < numberOfQuestions - 1 ){
                getCurrentQuestion().stop().fadeOut(200, function(){
                    currentQuestionCounter++;
                    getCurrentQuestion().fadeIn(200);
                    if (currentQuestionCounter === numberOfQuestions - 1){
                        $('#quizNext').toggle();
                        $('#submit').toggle();
                    }
                });
            }

            //if next is pushed then no longer on first question, full opacity on previous button
            var button = $('#quizPrevious');
            button.fadeTo(200, 1);

        }

        //event handler for previousButton
        function previousQuestion(){
            //change submit button back to next button if not at end of test
            if (currentQuestionCounter === numberOfQuestions -1){
                $('#quizNext').toggle();
                $('#submit').toggle();
            }

            //gray out previous button if unusable
            var previousButton = $('#quizPrevious');
            if (currentQuestionCounter === 1){
                previousButton.fadeTo(200, 0.4);
            }

            //display previous question
            if (currentQuestionCounter > 0){
                getCurrentQuestion().stop().fadeOut(200, function(){
                    currentQuestionCounter--;
                    getCurrentQuestion().fadeIn(200);
                });
            }
        }

        //event handler for submitButton
        function submit() {
            var answerResults = calculateScore();
            var string = '<div class="results"><h1>Results:</h1><ul>';
            for (var i = 0; i < answerResults.length ; i ++){
                string += '<li>Question ' + (i + 1) + ': ' + answerResults[i] + '</li>';
            }
            string += '</ul></div>';
            quiz.html(string);

        }
    }

    //this is a MESS, come up with a better method
    function getAnswer(){
        var userAnswerArray = [];
        $('.question').each(function (index) {
            var radioButtons = $(this).find($('input[type="radio"]'));
            for (var i in radioButtons) {
                if (radioButtons[i].checked) {
                    userAnswerArray.push(radioButtons[i].value);
                }
            }
            if (!userAnswerArray[index]) {
                userAnswerArray.push('');
            }
        });
        return userAnswerArray;
    }

    function calculateScore(){
        var userAnswerArray = getAnswer();
        var answerResults = [];
        for (var i = 0; i < questionObjectArray.length; i++){
            if (questionObjectArray[i]['correctAnswer'] === userAnswerArray[i]){
                answerResults[i] = 'Correct';
            } else {
                answerResults[i] = 'Incorrect';
            }
        }
        return answerResults;
    }

    function startQuiz(){
        createQuestions();
        getCurrentQuestion().show();
        createButtons();
    }

    return {
        startQuiz: startQuiz
    };
}(questionArray, '#quiz');

window.onload = function() {
    quizModule.startQuiz();
};

