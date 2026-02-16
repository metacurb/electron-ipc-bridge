import { CallExpression, isClassDeclaration, isIdentifier, TypeChecker } from "typescript";

import { resolveControllersFromModuleClass } from "./resolve-controllers-from-module-class.js";
import { ControllerMetadata } from "./types.js";

export const resolveControllersFromModule = (
  callExpr: CallExpression,
  typeChecker: TypeChecker,
  processedFiles: Set<string>,
  controllers: ControllerMetadata[],
  fileCache: Map<string, ControllerMetadata[]>,
): void => {
  const moduleArg = callExpr.arguments[0];
  if (moduleArg && isIdentifier(moduleArg)) {
    const moduleSymbol = typeChecker.getSymbolAtLocation(moduleArg);
    if (!moduleSymbol) return;

    let targetSymbol = moduleSymbol;
    try {
      const aliasedSymbol = typeChecker.getAliasedSymbol(moduleSymbol);
      targetSymbol = aliasedSymbol || moduleSymbol;
    } catch {
      // Not an alias
    }

    const targetDecl = targetSymbol.declarations?.[0];
    if (!targetDecl || !isClassDeclaration(targetDecl)) return;

    resolveControllersFromModuleClass(targetDecl, typeChecker, processedFiles, controllers, fileCache);
  }
};
