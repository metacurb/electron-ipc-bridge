import { IPC_DEFAULT_API_ROOT } from "@electron-ipc-controller/shared";
import fs from "fs";
import * as ts from "typescript";

export const resolveApiRootFromPreload = (preloadPath: string): string => {
  if (!fs.existsSync(preloadPath)) return IPC_DEFAULT_API_ROOT;
  const sourceText = fs.readFileSync(preloadPath, "utf8");
  const sourceFile = ts.createSourceFile(preloadPath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let found: string | null = null;
  const visit = (node: ts.Node) => {
    if (found) return;
    if (ts.isCallExpression(node)) {
      if (ts.isIdentifier(node.expression) && node.expression.text === "setupPreload") {
        const args = node.arguments;
        if (args.length === 0) {
          found = IPC_DEFAULT_API_ROOT;
          return;
        }
        if (args.length > 0 && ts.isStringLiteral(args[0])) {
          found = args[0].text;
          return;
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(sourceFile, visit);
  return found || IPC_DEFAULT_API_ROOT;
};
