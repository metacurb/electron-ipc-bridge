import type { Signature } from "typescript";
import { createPrinter, EmitHint, MethodDeclaration, TypeChecker, TypeFormatFlags } from "typescript";

import { isTruncatedTypeString } from "./is-truncated-type-string.js";

const printer = createPrinter();

export const resolveReturnType = (
  node: MethodDeclaration,
  signature: Signature | undefined,
  typeChecker: TypeChecker,
): string => {
  if (node.type) {
    return printer.printNode(EmitHint.Unspecified, node.type, node.getSourceFile()).trim();
  }
  const inferred =
    signature != null
      ? typeChecker.typeToString(
          signature.getReturnType(),
          undefined,
          TypeFormatFlags.NoTruncation | TypeFormatFlags.UseFullyQualifiedType,
        )
      : "unknown";

  if (isTruncatedTypeString(inferred)) return "unknown";

  // Strip import("...") wrappers only for local file paths (starting with ./, ../, /, or Drive letter)
  // This keeps external package imports (like import("zod")) intact, while simplifying local types to their names
  // (since we generate definitions for them in the same file).
  return inferred.replace(/import\("(?:\.|\/|[a-zA-Z]:).*?"\)\./g, "");
};
