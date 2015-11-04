import {Runtime} from 'markscript-koa'
import {answers, premises} from '../example/data'

function printValue(answerId) {
  return function(value) {
    console.log('Submitted answerId ' + answerId + ': ' + value)
    return
  }
}

export function test(runtime: Runtime) {
  let preperationService = <Logic.PreperationService>runtime.getService('preperation')
  let playService = <Logic.PlayService>runtime.getService('play')
  let resultsService = <Logic.ResultsService>runtime.getService('results')
  return preperationService.clear().then(function() {
    return preperationService.loadPremises(premises)
  }).then(function() {
    return preperationService.loadAnswers(answers)
  }).then(function() {
    resultsService.updateResults().subscribe({
      onNext: function(result) {
        console.log('Updated result:')
        console.log(JSON.stringify(result))
      }, onError: function(e) {
        console.log(e)
        console.log(e.stack)
      }, onCompleted: function() {
        throw 'UpdateResults Should never complete'
      }
    })

    return playService.getPremises()
  }).then(function(premises) {
    console.log('Got Premises:')
    console.log(JSON.stringify(premises))

    return playService.getPossibleAnswers()
  }).then(function(answers) {
    console.log('Got Answers:')
    console.log(JSON.stringify(answers))

    return playService.getFormattedPremises()
  }).then(function(formattedPremises) {
    console.log('Got Formatted Premises:')
    console.log(JSON.stringify(formattedPremises))

    return playService.getPossibleFormattedAnswers()
  }).then(function(formattedAnswers) {
    console.log('Got Formatted Answers:')
    console.log(JSON.stringify(formattedAnswers))

    return Promise.all([
      playService.submitAnswer(1).then(printValue(1)),
      playService.submitAnswer(2).then(printValue(1)),
      playService.submitAnswer(3).then(printValue(1)),
      playService.submitAnswer(4).then(printValue(1))
    ])
  }).then(function() {
    return resultsService.getResults().then(function(results) {
      console.log('Got Results:')
      console.log(JSON.stringify(results))
      return
    })
  })
}
