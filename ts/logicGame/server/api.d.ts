declare module Logic {
  interface Answer {
    id: number
    values: {
      symbol: string
      value: boolean
    }[]
  }

  interface FormattedAnswer {
    id: number,
    title: string
  }

  const enum StatementKind {
    PROPOSITION,
    NEGATION,
    AND,
    OR,
    IMPLIES
  }

  interface Statement {
    kind: StatementKind
  }

  interface Proposition extends Statement {
    proposition: string
  }

  interface UnaryStatement extends Statement {
    a: Statement
  }

  interface BinaryStatement extends Statement {
    a: Statement
    b: Statement
  }

  interface Results {
    [answerId: number]: number
  }

  type ResultUpdates = [number, number] /* [AnswerId, Count] */

  interface PreperationService {
    clear(): Promise<boolean>

    loadAnswers(answers: Answer[]): Promise<boolean>

    loadPremises(premises: Statement[]): Promise<boolean>
  }

  interface PlayService {
    getPremises(): Promise<Logic.Statement[]>

    getFormattedPremises(): Promise<string[]>

    getPossibleAnswers(): Promise<Logic.Answer[]>

    getPossibleFormattedAnswers(): Promise<Logic.FormattedAnswer[]>

    findValue(symbol: string): Promise<boolean>

    submitAnswer(answerId: number): Promise<boolean>
  }

  interface ResultsService {
    updateResults(): Observable<ResultUpdates>

    getResults(): Promise<Results>
  }
}
