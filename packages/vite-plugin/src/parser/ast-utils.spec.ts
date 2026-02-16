import {
  createProgram,
  createSourceFile,
  factory,
  forEachChild,
  isAsExpression,
  isIdentifier,
  isNonNullExpression,
  isParenthesizedExpression,
  isVariableStatement,
  ScriptTarget,
  SyntaxKind,
} from "typescript";

import { resolveExpression, unwrapExpression } from "./ast-utils";

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

  describe("resolveExpression", () => {
    const createProgramFromSource = (code: string) => {
      const fileName = "test.ts";
      const host = {
        fileExists: (f: string) => f === fileName,
        getCanonicalFileName: (f: string) => f,
        getCurrentDirectory: () => "/",
        getDefaultLibFileName: () => "lib.d.ts",
        getNewLine: () => "\n",
        getSourceFile: (f: string) =>
          f === fileName ? createSourceFile(fileName, code, ScriptTarget.Latest, true) : undefined,
        readFile: () => undefined,
        useCaseSensitiveFileNames: () => true,
        writeFile: () => {},
      };
      const program = createProgram([fileName], { noLib: true }, host);
      const sourceFile = program.getSourceFile(fileName)!;
      return { sourceFile, typeChecker: program.getTypeChecker() };
    };

    it("follows variable alias to its initializer", () => {
      const { sourceFile, typeChecker } = createProgramFromSource(`
        const original = [1, 2, 3];
        const alias = original;
        alias;
      `);

      // Find the standalone `alias` expression statement at the end
      let aliasExpr: import("typescript").Expression | undefined;
      forEachChild(sourceFile, (node) => {
        if (!isVariableStatement(node) && "expression" in node) {
          aliasExpr = (node as { expression: import("typescript").Expression }).expression;
        }
      });

      expect(aliasExpr).toBeDefined();
      const resolved = resolveExpression(aliasExpr!, typeChecker);
      // Should resolve through `alias` → `original` → array literal [1, 2, 3]
      expect(resolved.kind).toBe(SyntaxKind.ArrayLiteralExpression);
    });

    it("follows chained variable aliases", () => {
      const { sourceFile, typeChecker } = createProgramFromSource(`
        const a = { x: 1 };
        const b = a;
        const c = b;
        c;
      `);

      let cExpr: import("typescript").Expression | undefined;
      forEachChild(sourceFile, (node) => {
        if (!isVariableStatement(node) && "expression" in node) {
          cExpr = (node as { expression: import("typescript").Expression }).expression;
        }
      });

      expect(cExpr).toBeDefined();
      const resolved = resolveExpression(cExpr!, typeChecker);
      expect(resolved.kind).toBe(SyntaxKind.ObjectLiteralExpression);
    });

    it("returns the identifier when it has no initializer", () => {
      const { sourceFile, typeChecker } = createProgramFromSource(`
        declare const external: number;
        external;
      `);

      let expr: import("typescript").Expression | undefined;
      forEachChild(sourceFile, (node) => {
        if (!isVariableStatement(node) && "expression" in node) {
          expr = (node as { expression: import("typescript").Expression }).expression;
        }
      });

      expect(expr).toBeDefined();
      const resolved = resolveExpression(expr!, typeChecker);
      expect(isIdentifier(resolved)).toBe(true);
    });

    it("unwraps type assertions while resolving", () => {
      const { sourceFile, typeChecker } = createProgramFromSource(`
        const value = [1, 2];
        const wrapped = value as any;
        wrapped;
      `);

      let expr: import("typescript").Expression | undefined;
      forEachChild(sourceFile, (node) => {
        if (!isVariableStatement(node) && "expression" in node) {
          expr = (node as { expression: import("typescript").Expression }).expression;
        }
      });

      expect(expr).toBeDefined();
      const resolved = resolveExpression(expr!, typeChecker);
      expect(resolved.kind).toBe(SyntaxKind.ArrayLiteralExpression);
    });

    it("returns non-identifier expressions as-is", () => {
      const { sourceFile, typeChecker } = createProgramFromSource(`
        [1, 2, 3];
      `);

      let expr: import("typescript").Expression | undefined;
      forEachChild(sourceFile, (node) => {
        if ("expression" in node) {
          expr = (node as { expression: import("typescript").Expression }).expression;
        }
      });

      expect(expr).toBeDefined();
      const resolved = resolveExpression(expr!, typeChecker);
      expect(resolved.kind).toBe(SyntaxKind.ArrayLiteralExpression);
      expect(resolved).toBe(expr);
    });
  });
});
