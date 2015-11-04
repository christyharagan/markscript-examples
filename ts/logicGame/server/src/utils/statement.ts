export function toString(statement: Logic.Statement) {
  switch (statement.kind) {
    case Logic.StatementKind.PROPOSITION:
      return (<Logic.Proposition>statement).proposition
    case Logic.StatementKind.NEGATION:
      return 'NOT_' + toString((<Logic.UnaryStatement>statement).a)
    case Logic.StatementKind.AND:
      return 'AND_' + toString((<Logic.BinaryStatement>statement).a) + '_' + toString((<Logic.BinaryStatement>statement).b)
    case Logic.StatementKind.OR:
      return 'OR_' + toString((<Logic.BinaryStatement>statement).a) + '_' + toString((<Logic.BinaryStatement>statement).b)
    case Logic.StatementKind.IMPLIES:
      return 'IMPLIES_' + toString((<Logic.BinaryStatement>statement).a) + '_' + toString((<Logic.BinaryStatement>statement).b)
  }
}
