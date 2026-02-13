import {
  Expression,
  isAsExpression,
  isNonNullExpression,
  isParenthesizedExpression,
  isSatisfiesExpression,
  isTypeAssertionExpression,
} from "typescript";

export const unwrapExpression = (expr: Expression): Expression => {
  let current = expr;
  while (true) {
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
