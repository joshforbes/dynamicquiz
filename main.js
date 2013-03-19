questionsArray = [
    {   question: "Who is the blah blah blah",
        choices: ["That Guy1", "That Guy2"],
        answer: "That Guy1"
    },
    {   question: "Who is the yayaya",
        choices: ["This Girl3", "This Girl2", "That Girl3"],
        answer: "That Guy1"
    },
    {   question: "Who is the ufdasfa",
        choices: ["That Guy1", "That Guy2"],
        answer: "That Guy1"
    }
];

function Quiz(questionsArray){
    this.questionsArray = questionsArray;
    this.totalQuestions = this.questionsArray.length;
    this.counter = 0;

    var userAnswers = [];
    var userScore = [];

    this.calculateScore = function() {
        for (var i in userAnswers){
            if (userAnswers[i] === this.questionsArray[i]["answer"]){
                this.incrementUserScore(i);
            }
        }
    }

    this.getUserScore = function() {
        return "You answered " + userScore.length + " questions correctly out of a possible " + this.questionsArray.length + ".";
    }

    this.incrementUserScore = function(correctAnswerNumber) {
        userScore.push(correctAnswerNumber);
    }

    this.getUserAnswers = function() {
        return userAnswers;
    }
    this.setUserAnswers = function(value) {
        userAnswers.push(value);
    }
}



Quiz.prototype = {
    constructor: Quiz,

    displayQuestion: function(e, counter) {
        var currentQuestion = this.questionsArray[counter]["question"];
        e = document.getElementById(e);
        e.innerHTML = "Question " + (counter + 1) + ": " + currentQuestion + "<br>"
    },

    createInput: function(type, name, value){
        this.type = type;
        this.name = name;
        this.value = value;

        var createdInput = document.createElement('input');
        createdInput.setAttribute('type', this.type);
        createdInput.setAttribute('name', this.name);
        createdInput.setAttribute('value', this.value);
        return createdInput;
    },

    displayChoices: function(e, counter) {
        e = document.getElementById(e);
        var currentChoices = this.questionsArray[counter]["choices"];
        e.innerHTML = "";

        for (var choice in currentChoices) {
            radio = this.createInput('radio', 'answerChoice', currentChoices[choice]);
            e.appendChild(radio);
            e.innerHTML += currentChoices[choice] + "<br>";
        }

    },

    getAnswer: function() {
        //don't like this, figure out a better way to pass the radio buttons from createInput or displayChoices
        var choices = document.getElementsByTagName("input");

        for (var i in choices){
            if (choices[i].checked){
                this.setUserAnswers(choices[i].value);
                return true;
            }
        }
    },

    nextQuestion: function() {
        if (!this.getAnswer()){
            alert("please select an answer");
            return;
        }
        if (this.counter < (this.totalQuestions - 1)){
            this.counter++;
            this.displayQuiz();
        } else {
            this.calculateScore();
            alert(this.getUserScore());
        }
    },

    previousQuestion: function() {
        if (this.counter > 0) this.counter--;
        this.displayQuiz();
    },

    displayQuiz: function() {
        this.displayQuestion("questions", this.counter);
        this.displayChoices("choices", this.counter);

    }

}

var quiz = new Quiz(questionsArray);
window.onload = function() {
    quiz.displayQuiz();
}