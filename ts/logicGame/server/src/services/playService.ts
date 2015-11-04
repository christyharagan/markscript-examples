import {toString} from '../utils/statement'
import {mlService, mlMethod, resolve, resolveIterator, METHOD} from 'markscript-uservices'
import {variable, prefix, select} from 'speckle'
import {incrementCounter} from 'markscript-basic'

@mlService('play')
export class PlayService implements Logic.PlayService {
  @mlMethod()
  getPremises(): Promise<Logic.Statement[]> {
    return resolveIterator(xdmp.directory('/premises/'))
  }

  @mlMethod()
  getFormattedPremises(): Promise<string[]> {
    function formatStatement(statement:Logic.Statement):string {
      switch (statement.kind) {
        case Logic.StatementKind.PROPOSITION:
          return (<Logic.Proposition>statement).proposition
        case Logic.StatementKind.NEGATION:
          return '! (' + formatStatement((<Logic.UnaryStatement>statement).a) + ')'
        case Logic.StatementKind.AND:
          return formatStatement((<Logic.BinaryStatement>statement).a) + ' & ' + formatStatement((<Logic.BinaryStatement>statement).b)
        case Logic.StatementKind.OR:
          return formatStatement((<Logic.BinaryStatement>statement).a) + ' | ' + formatStatement((<Logic.BinaryStatement>statement).b)
        case Logic.StatementKind.IMPLIES:
          return formatStatement((<Logic.BinaryStatement>statement).a) + ' => ' + formatStatement((<Logic.BinaryStatement>statement).b)
      }
    }
    return this.getPremises().then(function(premises){
      return premises.map(formatStatement)
    })
  }

  @mlMethod()
  getPossibleAnswers(): Promise<Logic.Answer[]> {
    return resolveIterator(xdmp.directory('/answers/'))
  }

  @mlMethod()
  getPossibleFormattedAnswers(): Promise<Logic.FormattedAnswer[]> {
    return this.getPossibleAnswers().then(function(answers){
      return answers.map(function(answer){
        return {
          id: answer.id, title: answer.values.reduce(function (previousValue, currentValue) {
            return previousValue + (previousValue === '' ? '' : ' and ') + currentValue.symbol + ' is ' + (currentValue.value ? 'true' : 'false')
          }, '')
        }
      })
    })
  }

  @mlMethod()
  findValue(symbol: string): Promise<boolean> {
    return resolve(this._findValue(symbol))
  }

  @mlMethod({
    method: METHOD.PUT
  })
  submitAnswer(answerId: number): Promise<boolean> {
    incrementCounter('/guesses/' + answerId)

    let guess = <Logic.Answer><any>cts.doc('/answers/' + answerId).root.toObject()

    for (let i = 0; i < guess.values.length; i++) {
      let value = guess.values[i]
      if (this._findValue(value.symbol) !== value.value) {
        return resolve(false)
      }
    }
    return resolve(true)
  }

  _findValue(symbol: string): boolean {
    let value = variable('value')
    let sem = <semFunctions>require('/MarkLogic/semantics.xqy')
    let logic = prefix('l', 'http://logic/')
    let queryResult = <ValueIterator<{value:string}>>sem.sparql(select(value).where(logic.uri(symbol), logic.uri('is'), value).toSparql())
    if (queryResult.count !== 1) {
      return null
    } else {
      return queryResult.next().value.value.toString() === 'http://logic/true'
    }
  }
}
