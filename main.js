questionArray = [
    {   question: "Who is the blah blah blah",
        choices: ["That Guy1", "That Guy2"],
        answer: "0"
    },
    {   question: "Who is the yayaya",
        choices: ["This Girl3", "This Girl2", "That Girl3"],
        answer: "2"
    },
    {   question: "Who is the ufdasfa",
        choices: ["That Guy1", "That Guy2"],
        answer: "1"
    }
];


var quizModule = function() {
    var quizElement = document.querySelector("#quiz");
    //this.questionArray = questionArray;
    var questionObjectArray = [];
    var numberOfQuestions = questionArray.length;
    var questionCounter = 0;
    var currentQuestionCounter = 0;
    var fragment = document.createDocumentFragment();

    function Question(question, choices, correctAnswer){
        this.question = question;
        this.choices = choices;
        this.correctAnswer = correctAnswer;
        this.userAnswer = "";
    }

    Question.prototype = {
        constructor: Question,

        getCorrectAnswer: function() {
            return this.correctAnswer;
        },
        getUserAnswer: function() {
            return this.userAnswer;
        },
        questionHTML: function(){
            var questionElement = "<h1>" +
                this.question + "</h1><ul>";
            for (var i = 0; i < this.choices.length; i++){
                questionElement += "<li><input type='radio' name='choice' value='" + [i] + "'>" + this.choices[i] + "</li>";
            }
            questionElement += "</ul>";
            return questionElement;
        },
        questionToDivElement: function() {
            var child = this.questionHTML();
            var div = document.createElement("div");
            div.innerHTML = child;
            div.id = "question" + questionCounter++;
            div.className = "question";
            return div;
        }
    }


    function createQuestionObject(){
        var question = new Question(questionArray[0]["question"], questionArray[0]["choices"], questionArray[0]["answer"]);
        //store our question object in array for later reference
        questionObjectArray.push(question);
        //remove the question from the original array
        questionArray.shift();

        //send the question object to the documentfragment for storage
        fragment.appendChild(question.questionToDivElement());
    }

    function createQuestions(){
        for (var i = 0; i < numberOfQuestions; i++){
            createQuestionObject();
        }
    }

    function getCurrentQuestion(){
        var quiz = document.querySelector("#quiz");
        var currentQuestion = fragment.querySelector("#question" + currentQuestionCounter);
        console.log(currentQuestion);
        quiz.insertBefore(currentQuestion, document.querySelector("#quizPrevious"));
    }

    function removeCurrentQuestion(){
        var currentQuestion = document.querySelector("#question" + currentQuestionCounter);
        fragment.appendChild(currentQuestion);
    }

    function createButtons(){
        var quiz = document.querySelector("#quiz");

        var nextButton = document.createElement("input");
        nextButton.id = "quizNext";
        nextButton.type = "button";
        nextButton.value = "Next";
        nextButton.onclick = function() {
           nextQuestion();
        }

        var previousButton = document.createElement("input");
        previousButton.id = "quizPrevious";
        previousButton.type = "button";
        previousButton.value = "Previous";
        previousButton.onclick = function() {
            previousQuestion();
        }
        previousButton.style.opacity = .4;

        quiz.appendChild(previousButton);
        quiz.appendChild(nextButton);

    }

    function nextQuestion() {
        if (getAnswer()){
            getAnswer();
        }
        if (currentQuestionCounter < numberOfQuestions - 1 ){
            removeCurrentQuestion();
            currentQuestionCounter++;
            getCurrentQuestion();
        }
        if (currentQuestionCounter === numberOfQuestions - 1){
            submitButtonToggle();
        }

        //if next is pushed then no longer on first question, full opacity on previous button
        var button = document.querySelector("#quizPrevious");
        button.style.opacity = 1;

    }

    function previousQuestion(){
        if (getAnswer()){
            getAnswer();
        }

        //change submit button back to next button if not at end of test
        if (currentQuestionCounter === numberOfQuestions -1){
            submitButtonToggle();
        }

        //gray out previous button if unusable
        var previousButton = document.querySelector("#quizPrevious");
        if (currentQuestionCounter === 1){
            previousButton.style.opacity = .4;
        }

        //display previous question
        if (currentQuestionCounter > 0){
            removeCurrentQuestion();
            currentQuestionCounter--;
            getCurrentQuestion();
        }
    }

    function submitButtonToggle() {
        var button = document.querySelector("#quizNext");
        if (button['value'] === 'Next'){
            button['value'] = 'Submit';
            button.onclick = function() {
                submit();
            }
        } else {
            button['value'] = 'Next';
            button.onclick = function(){
                nextQuestion();
            }
        }
    }

    function submit() {
        var answerResults = calculateScore();
        var string = "<div class='results'><h1>Results:</h1><ul>";
        for (var i = 0; i < answerResults.length ; i ++){
            string += "<li>Question " + (i + 1) + ": " + answerResults[i] + "</li>";
        }
        string += "</ul></div>"
        document.querySelector("#quiz").innerHTML = string;

    }


    function getAnswer(){
        var radioButtons = document.querySelectorAll("input[type='radio']");
        for (i in radioButtons){
           if (radioButtons[i].checked){
               questionObjectArray[currentQuestionCounter].userAnswer = radioButtons[i].value;
               return true;
           }
        }
    }

    function calculateScore(){
        var answerResults = [];
        for (var i = 0; i < questionObjectArray.length; i++){
            if (questionObjectArray[i]['correctAnswer'] === questionObjectArray[i]['userAnswer']){
                answerResults[i] = 'Correct';
            } else {
                answerResults[i] = 'Incorrect';
            }
        }
        return answerResults;
    }

    function startQuiz(){
        createQuestions();
        getCurrentQuestion();
        createButtons();
    }

    return {
        startQuiz: startQuiz,
        nextQuestion: nextQuestion,
        previousQuestion: previousQuestion,
        getAnswer: getAnswer

     };
}();

window.onload = function() {
    quizModule.startQuiz();

}