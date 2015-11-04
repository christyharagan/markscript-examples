import {toString} from '../utils/statement'
import {mlService, mlMethod, resolve, METHOD} from 'markscript-uservices'
import {createCounter, deleteAll, deleteGraph} from 'markscript-basic'

@mlService('preperation')
export class PreperationService implements Logic.PreperationService {
  @mlMethod({
    method: METHOD.PUT
  })
  clear(): Promise<boolean> {
    deleteAll('/answers')
    deleteAll('/premises')
    deleteAll('/guesses')
    deleteGraph()
    return resolve(true)
  }

  @mlMethod({
    method: METHOD.PUT
  })
  loadAnswers(answers: Logic.Answer[]): Promise<boolean> {
    answers.forEach(function(answer) {
      xdmp.documentInsert(`/answers/${answer.id}`, answer)
      createCounter(`/guesses/${answer.id}`)
    })
    return resolve(true)
  }

  @mlMethod({
    method: METHOD.PUT
  })
  loadPremises(premises: Logic.Statement[]): Promise<boolean> {
    let sem = <semFunctions>require('/MarkLogic/semantics.xqy')
    premises.forEach(function(premise) {
      let str = processStatement(premise)
      sem.rdfInsert(
        sem.triple(
          sem.iri(`http://logic/${str}`),
          sem.iri('http://logic/is'),
          sem.iri(`http://logic/true`)))
      xdmp.documentInsert(`/premises/${str}`, premise)
    })

    function processStatement(statement: Logic.Statement): string {
      let str = toString(statement)
      switch (statement.kind) {
        case Logic.StatementKind.NEGATION:
          sem.rdfInsert(
            sem.triple(
              sem.iri(`http://logic/${str}`),
              sem.iri('http://logic/not'),
              sem.iri(`http://logic/${processStatement((<Logic.UnaryStatement>statement).a) }`)))
          break
        case Logic.StatementKind.AND:
          sem.rdfInsert(
            sem.triple(
              sem.iri(`http://logic/${str}`),
              sem.iri('http://logic/and'),
              sem.iri(`http://logic/${processStatement((<Logic.BinaryStatement>statement).a) }`)))
          sem.rdfInsert(
            sem.triple(
              sem.iri(`http://logic/${str}`),
              sem.iri('http://logic/and'),
              sem.iri(`http://logic/${processStatement((<Logic.BinaryStatement>statement).b) }`)))
          break
        case Logic.StatementKind.OR:
          sem.rdfInsert(
            sem.triple(
              sem.iri(`http://logic/${str}`),
              sem.iri('http://logic/or'),
              sem.iri(`http://logic/${processStatement((<Logic.BinaryStatement>statement).a) }`)))
          sem.rdfInsert(
            sem.triple(
              sem.iri(`http://logic/${str}`),
              sem.iri('http://logic/or'),
              sem.iri(`http://logic/${processStatement((<Logic.BinaryStatement>statement).b) }`)))
          break
        case Logic.StatementKind.IMPLIES:
          sem.rdfInsert(
            sem.triple(
              sem.iri(`http://logic/${str}`),
              sem.iri('http://logic/leftImplies'),
              sem.iri(`http://logic/${processStatement((<Logic.BinaryStatement>statement).a) }`)))
          sem.rdfInsert(
            sem.triple(
              sem.iri(`http://logic/${str}`),
              sem.iri('http://logic/rightImplies'),
              sem.iri(`http://logic/${processStatement((<Logic.BinaryStatement>statement).b) }`)))
          break
      }
      return str
    }
    return resolve(true)
  }
}
