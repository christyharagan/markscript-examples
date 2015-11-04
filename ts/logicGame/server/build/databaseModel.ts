import {mlDeploy, contentDatabase, triggersDatabase, modulesDatabase, schemaDatabase, mlRuleSet} from 'markscript-basic-build'
import {variable, prefix, rule} from 'speckle'

@mlDeploy()
export class LogicGameDatabase {
  name: string
  host: string
  port: number

  constructor(name: string, port: number, host?: string) {
    this.name = name
    this.host = host
    this.port = port
  }

  get server(): MarkScript.ServerSpec {
    return {
      name: this.name,
      host: this.host,
      port: this.port
    }
  }

  @contentDatabase()
  get contentDatabase(): MarkScript.DatabaseSpec {
    return {
      name: this.name + '-content',
      triples: true,
      defaultRulesets: ['/rules/logic.rules']
    }
  }

  @triggersDatabase()
  get triggersDatabase(): MarkScript.DatabaseSpec {
    return {
      name: this.name + '-triggers'
    }
  }

  @modulesDatabase()
  get modulesDatabase(): MarkScript.DatabaseSpec {
    return {
      name: this.name + '-modules'
    }
  }

  @schemaDatabase()
  get schemaDatabase(): MarkScript.DatabaseSpec {
    return {
      name: this.name + '-schema'
    }
  }

  @mlRuleSet({
    path: '/rules/logic.rules'
  })
  logicRuleSet(): string {
    let logic = prefix('l', 'http://logic/')
    let a = variable('a')
    let b = variable('b')
    let ab = variable('ab')
    let notAB = variable('notAB')
    let is = logic.uri('is')
    let T = logic.uri('true')
    let F = logic.uri('false')
    let NOT = logic.uri('not')
    let AND = logic.uri('and')
    let OR = logic.uri('or')
    let IMPLIES_LEFT = logic.uri('leftImplies')
    let IMPLIES_RIGHT = logic.uri('rightImplies')

    return rule('negationTa')
      .when(a, is, T)
      .and(a, NOT, b)
      .then(b, is, F)

      .rule('negationTb')
      .when(b, is, T)
      .and(a, NOT, b)
      .then(a, is, F)

      .rule('negationFa')
      .when(a, is, F)
      .and(a, NOT, b)
      .then(b, is, T)

      .rule('negationFb')
      .when(b, is, F)
      .and(a, NOT, b)
      .then(a, is, T)

      .rule('conjunction')
      .when(ab, is, T)
      .and(ab, AND, a)
      .then(a, is, T)

      .rule('disjunction')
      .when(ab, is, F)
      .and(ab, OR, a)
      .then(a, is, F)

      .rule('modusPollens')
      .when(ab, is, T)
      .and(ab, IMPLIES_LEFT, a)
      .and(ab, IMPLIES_RIGHT, b)
      .and(a, is, T)
      .then(b, is, T)

      .rule('modusTollens')
      .when(ab, is, T)
      .and(ab, IMPLIES_LEFT, a)
      .and(ab, IMPLIES_RIGHT, b)
      .and(b, is, F)
      .then(a, is, F)

      .rule('conjunctiveSyllogism')
      .when(ab, is, F)
      .and(ab, AND, a)
      .and(ab, AND, b)
      .and(a, is, T)
      .then(b, is, F)

      .rule('disjunctiveSyllogism')
      .when(ab, is, T)
      .and(ab, OR, a)
      .and(ab, OR, b)
      .and(a, is, F)
      .then(b, is, T)

      .toSparql()
  }
}
