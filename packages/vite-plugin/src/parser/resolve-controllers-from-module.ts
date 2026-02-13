import {
  CallExpression,
  isArrayLiteralExpression,
  isCallExpression,
  isClassDeclaration,
  isIdentifier,
  isObjectLiteralExpression,
  isPropertyAssignment,
  PropertyAssignment,
  TypeChecker,
} from "typescript";

import { getDecorator } from "./get-decorator.js";
import { resolveController } from "./resolve-controller.js";
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

    const moduleDecorator = getDecorator(targetDecl, "Module");
    if (!moduleDecorator || !isCallExpression(moduleDecorator.expression)) return;

    const moduleArgs = moduleDecorator.expression.arguments;
    const moduleOptions = moduleArgs[0];
    if (!moduleOptions || !isObjectLiteralExpression(moduleOptions)) return;

    const providersProp = moduleOptions.properties.find(
      (p): p is PropertyAssignment => isPropertyAssignment(p) && isIdentifier(p.name) && p.name.text === "providers",
    );
    if (!providersProp || !isArrayLiteralExpression(providersProp.initializer)) return;

    const providerElements = providersProp.initializer.elements;
    providerElements.forEach((element) => {
      resolveController(element, typeChecker, processedFiles, controllers, fileCache);
    });
  }
};
