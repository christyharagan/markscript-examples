Polymer({
  is: 'marklogic-results',
  properties: {
    formattedAnswers: Array,

    results: Object,

    resultUpdates: Object,

    rows: {
      type: Array,
      readOnly: true,
      notify: true
    },

    columns: {
      type: Array,
      readOnly: true,
      notify: true
    }
  },
  observers: [
    'onAnswers(formattedAnswers)',
    'onResults(results)',
    'onResultUpdates(resultUpdates)'
  ],
  onResults: function() {
    if (this.results && this.formattedAnswers) {
      var rows = []
      var self = this
      this.formattedAnswers.forEach(function(formattedAnswer) {
        var result = self.results[formattedAnswer.id]
        rows.push(result || 0)
      })
      this.notifyPath('rows', [rows])
    }
  },
  onResultUpdates: function() {
    if (this.results) {
      this.results[this.resultUpdates[0]] = this.resultUpdates[1]
      this.onResults()
    }
  },
  onAnswers: function() {
    this.notifyPath('columns', this.formattedAnswers.map(function(formattedAnswer) {
      return formattedAnswer.title
    }))
  }
})
