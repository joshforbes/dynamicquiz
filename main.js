(function() {

var dynamicQuiz = {

    settings: {
        currentQuestion: 0,
        questionsTemplate: $('#quiz-template').html(),
        resultsTemplate: $('#quiz-results-template').html(),
        questionsContainer: $('#questions'),
        resultsContainer: $('#results'),
        buttons: $('#quiz input:button'),
        nextButton: $('#quizNext'),
        previousButton: $('#quizPrevious'),
        submitButton: $('#quizSubmit'),
        questionsURL: 'scripts/questions.json'
    },

    init: function() {
        var self = this;

        //assign the result of getData to a promise
        var dataPromise = this.getData();

        //upon the fulfilment of dataPromise, call functions to create question
        //objects and attach to handlebars template. Create a questionPromise 
        //that will indicate when these actions have been completed
        var questionPromise = dataPromise.then(function(data) {
            self.createQuestions(data);
            self.attachQuestionsTemplate();
            return data;
        });

        questionPromise.then(function(data) {
            self.bindEvents();
        });

        questionPromise.then(function(data) {
            self.questionToggle();
        });
    },

    //retrieve quiz questions from JSON file
	getData: function() {
        return $.getJSON(this.settings.questionsURL);
    },

    //maps the specified data to the Question constructor
    createQuestions: function(data) {
        this.questions = $.map(data, function(q) {
            return new Question(q.id, q.question, q.choices, q.answer);
        });
    },

    //attach handlebars questions template
    attachQuestionsTemplate: function() {
        var template = Handlebars.compile(this.settings.questionsTemplate);
        this.settings.questionsContainer.append(template(this.questions));
    },

    //attach handlebars results template
    attachResultsTemplate: function() {
        var template = Handlebars.compile(this.settings.resultsTemplate);
        this.settings.resultsContainer.append(template(this.results));
    },

    //bind event handlers to DOM elements
    bindEvents: function() {
        this.settings.nextButton.on('click', this.validateAnswer);
        this.settings.submitButton.on('click', this.validateAnswer);
        this.settings.buttons.on('click', this.questionController);
        $('input:radio').on('change', this.storeAnswer);
    },

    //verify that user has selected an answer before proceeding
    validateAnswer: function(event) {
        var self = dynamicQuiz;

        if (!self.questions[self.settings.currentQuestion].getUserAnswer()) {
            alert('Please choose an answer');
            event.stopImmediatePropagation();
        }
    },

    //save user selected answer to question object
    storeAnswer: function() {
        var self = dynamicQuiz;

        self.questions[self.settings.currentQuestion].setUserAnswer($(this).val());
    },

    //controls the state of the application
    //handles button presses and determines what should be displayed
    questionController: function(event) {
        var self = dynamicQuiz;

        if (event.target.value === 'Next' && self.settings.currentQuestion < self.questions.length - 1) {
            self.nextQuestion();
        }
        if (event.target.value === 'Previous' && self.settings.currentQuestion > 0) {
            self.previousQuestion();
        }
        if (event.target.value === 'Submit') {
            self.getResults();
            self.settings.questionsContainer.hide();
            self.attachResultsTemplate();
        }

        self.submitToggle();
        self.previousToggle();
    },

    nextQuestion: function() {
        this.questionToggle();
        this.settings.currentQuestion++;
        this.questionToggle();
    },

    previousQuestion: function() {
        this.questionToggle();
        this.settings.currentQuestion--;
        this.questionToggle();
    },

    //toggles display of current question
    questionToggle: function() {
        $('#question' + this.settings.currentQuestion).toggle();
    },

    //compares user answer to correct answer and maps result to an array
    getResults: function() {
        this.results = $.map(this.questions, function(value, index) {
            if (value.getUserAnswer() === value.getCorrectAnswer()) {
                return {
                    'index': index + 1,
                    'result': 'Correct'
                };
            } else {
                return {
                    'index': index + 1,
                    'result': 'Incorrect'
                };
            }
        });
    },

    //helper function to switch between display of 'next' and 'submit' on last question
    submitToggle: function() {
        if (this.settings.currentQuestion === this.questions.length - 1) {
            this.settings.nextButton.hide();
            this.settings.submitButton.show();
        } else {
            this.settings.nextButton.show();
            this.settings.submitButton.hide();
        }
    },

    //helper function to toggle opacity of previous button when it is disabled
    previousToggle: function() {
        if (this.settings.currentQuestion === 0) {
            this.settings.previousButton.addClass('faded');
        } else {
            this.settings.previousButton.removeClass('faded');
        }
    }
};

function Question(id, question, choices, answer) {
    this.id = id;
    this.question = question;
    this.choices = choices;
    this.answer = answer;
    this.userAnswer = '';
}

Question.prototype = {
    getCorrectAnswer: function() {
        return this.answer;
    },
    getUserAnswer: function() {
        return this.userAnswer;
    },
    setUserAnswer: function(answer) {
        this.userAnswer = answer;
    }
};

dynamicQuiz.init();
})();

