export const answers: Logic.Answer[] = [
  {
    id: 1,
    values: [{
      symbol: 'R',
      value: false
    }, {
        symbol: 'S',
        value: false
      }]
  },
  {
    id: 2,
    values: [{
      symbol: 'R',
      value: true
    }, {
        symbol: 'S',
        value: false
      }]
  },
  {
    id: 3,
    values: [{
      symbol: 'R',
      value: false
    }, {
        symbol: 'S',
        value: true
      }]
  },
  {
    id: 4,
    values: [{
      symbol: 'R',
      value: true
    }, {
        symbol: 'S',
        value: true
      }]
  }
]

export const premises: Logic.BinaryStatement[] = [
  {
    kind: Logic.StatementKind.AND,
    a: <Logic.Proposition>{
      kind: Logic.StatementKind.PROPOSITION,
      proposition: 'P'
    },
    b: <Logic.Proposition>{
      kind: Logic.StatementKind.PROPOSITION,
      proposition: 'Q'
    }
  },
  {
    kind: Logic.StatementKind.IMPLIES,
    a: <Logic.Proposition>{
      kind: Logic.StatementKind.PROPOSITION,
      proposition: 'S'
    },
    b: <Logic.Proposition>{
      kind: Logic.StatementKind.PROPOSITION,
      proposition: 'R'
    }
  }, {
    kind: Logic.StatementKind.IMPLIES,
    a: <Logic.Proposition>{
      kind: Logic.StatementKind.PROPOSITION,
      proposition: 'P'
    },
    b: <Logic.UnaryStatement>{
      kind: Logic.StatementKind.NEGATION,
      a: <Logic.BinaryStatement>{
        kind: Logic.StatementKind.AND,
        a: <Logic.Proposition>{
          kind: Logic.StatementKind.PROPOSITION,
          proposition: 'R'
        },
        b: <Logic.Proposition>{
          kind: Logic.StatementKind.PROPOSITION,
          proposition: 'Q'
        }
      }
    }
  }
]
