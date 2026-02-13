import { factory, isAsExpression, isNonNullExpression, isParenthesizedExpression, SyntaxKind } from "typescript";

import { unwrapExpression } from "./ast-utils";

describe("ast-utils", () => {
  describe("unwrapExpression", () => {
    it("should return the expression if it is not wrapped", () => {
      const identifier = factory.createIdentifier("foo");
      expect(unwrapExpression(identifier)).toBe(identifier);
    });

    it("should unwrap ParenthesizedExpression", () => {
      const identifier = factory.createIdentifier("foo");
      const parenthesized = factory.createParenthesizedExpression(identifier);
      expect(unwrapExpression(parenthesized)).toBe(identifier);
      expect(isParenthesizedExpression(parenthesized)).toBe(true);
    });

    it("should unwrap AsExpression", () => {
      const identifier = factory.createIdentifier("foo");
      const asExpr = factory.createAsExpression(identifier, factory.createKeywordTypeNode(SyntaxKind.AnyKeyword));
      expect(unwrapExpression(asExpr)).toBe(identifier);
      expect(isAsExpression(asExpr)).toBe(true);
    });

    it("should unwrap NonNullExpression", () => {
      const identifier = factory.createIdentifier("foo");
      const nonNull = factory.createNonNullExpression(identifier);
      expect(unwrapExpression(nonNull)).toBe(identifier);
      expect(isNonNullExpression(nonNull)).toBe(true);
    });

    it("should unwrap recursively", () => {
      const identifier = factory.createIdentifier("foo");
      const wrapped = factory.createParenthesizedExpression(
        factory.createNonNullExpression(factory.createParenthesizedExpression(identifier)),
      );
      expect(unwrapExpression(wrapped)).toBe(identifier);
    });
  });
});
