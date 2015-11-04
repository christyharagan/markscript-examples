Polymer({
    is: 'marklogic-play',
    properties: {
        selectedAnswer: Object,
        isCorrect: Boolean,
        formattedPremises: {
            type: Array,
            readOnly: true,
            notify: true
        },
        formattedAnswers: {
            type: Array,
            readOnly: true,
            notify: true
        },
        guess: {
            type: Array,
            readOnly: true,
            notify: true
        },
        answeredCorrectly: {
            type: Boolean,
            readOnly: true,
            notify: true
        },
        hasAnswered: {
            type: Boolean,
            readOnly: true,
            notify: true
        }
    },
    observers: [
        'onIsCorrect(isCorrect)'
    ],
    onIsCorrect: function () {
        if (this.isCorrect) {
            this.notifyPath('answeredCorrectly', true);
        }
        else {
            this.notifyPath('answeredIncorrectly', true);
        }
    },
    submit: function () {
        this.notifyPath('hasAnswered', true);
        this.notifyPath('guess', [this.selectedAnswer.id]);
    }
});
//# sourceMappingURL=play.js.map