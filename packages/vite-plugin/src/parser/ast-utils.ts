import {
  Expression,
  isAsExpression,
  isAwaitExpression,
  isIdentifier,
  isNonNullExpression,
  isParenthesizedExpression,
  isSatisfiesExpression,
  isTypeAssertionExpression,
  isVariableDeclaration,
  TypeChecker,
} from "typescript";

export const unwrapExpression = (expr: Expression): Expression => {
  let current = expr;
  while (true) {
    if (isAwaitExpression(current)) {
      current = current.expression;
      continue;
    }
    if (isParenthesizedExpression(current)) {
      current = current.expression;
      continue;
    }
    if (isAsExpression(current)) {
      current = current.expression;
      continue;
    }
    if (isTypeAssertionExpression(current)) {
      current = current.expression;
      continue;
    }
    if (isNonNullExpression(current)) {
      current = current.expression;
      continue;
    }
    if (isSatisfiesExpression(current)) {
      current = current.expression;
      continue;
    }
    return current;
  }
};

export const resolveExpression = (expr: Expression, typeChecker: TypeChecker): Expression => {
  let current = unwrapExpression(expr);
  const visited = new Set<Expression>();

  while (isIdentifier(current)) {
    if (visited.has(current)) break;
    visited.add(current);

    const symbol = typeChecker.getSymbolAtLocation(current);
    if (!symbol) break;

    let targetSymbol = symbol;
    try {
      const aliasedSymbol = typeChecker.getAliasedSymbol(symbol);
      targetSymbol = aliasedSymbol || symbol;
    } catch {
      // Not an alias
    }

    const decl = targetSymbol.declarations?.[0];
    if (decl && isVariableDeclaration(decl) && decl.initializer) {
      current = unwrapExpression(decl.initializer);
    } else {
      break;
    }
  }

  return current;
};
