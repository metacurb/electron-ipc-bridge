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

import { DependencyResolutionStrategy } from "../strategies/types.js";

import { resolveExpression } from "./ast-utils.js";
import { resolveControllersFromArray } from "./resolve-controllers-from-array.js";
import { resolveControllersFromModule } from "./resolve-controllers-from-module.js";
import { resolveControllersFromModuleClass } from "./resolve-controllers-from-module-class.js";
import { ControllerMetadata } from "./types.js";

export const processCreateIpcAppCall = (
  node: CallExpression,
  typeChecker: TypeChecker,
  processedFiles: Set<string>,
  controllers: ControllerMetadata[],
  fileCache: Map<string, ControllerMetadata[]>,
  resolutionStrategy?: DependencyResolutionStrategy,
): void => {
  const args = node.arguments;
  if (args.length === 0) return;

  const optionsObj = resolveExpression(args[0], typeChecker);
  if (!isObjectLiteralExpression(optionsObj)) return;

  const controllersProp = optionsObj.properties.find(
    (p): p is PropertyAssignment => isPropertyAssignment(p) && isIdentifier(p.name) && p.name.text === "controllers",
  );

  if (!controllersProp) return;

  const initializer = resolveExpression(controllersProp.initializer, typeChecker);

  if (isArrayLiteralExpression(initializer)) {
    resolveControllersFromArray(initializer, typeChecker, processedFiles, controllers, fileCache);
    return;
  }

  if (isCallExpression(initializer)) {
    resolveControllersFromModule(initializer, typeChecker, processedFiles, controllers, fileCache);

    for (const arg of initializer.arguments) {
      const resolvedArg = resolveExpression(arg, typeChecker);

      if (isCallExpression(resolvedArg)) {
        for (const factoryArg of resolvedArg.arguments) {
          const resolvedFactoryArg = resolveExpression(factoryArg, typeChecker);

          if (!isIdentifier(resolvedFactoryArg)) continue;
          const factorySymbol = typeChecker.getSymbolAtLocation(resolvedFactoryArg);
          if (!factorySymbol) continue;

          let targetSymbol = factorySymbol;
          try {
            const aliased = typeChecker.getAliasedSymbol(factorySymbol);
            targetSymbol = aliased || factorySymbol;
          } catch {
            // Not an alias
          }

          const targetDecl = targetSymbol.declarations?.[0];
          if (targetDecl && isClassDeclaration(targetDecl)) {
            resolveControllersFromModuleClass(targetDecl, typeChecker, processedFiles, controllers, fileCache);
          }
        }
      }
    }

    if (controllers.length === 0 && resolutionStrategy) {
      const context = {
        fileCache,
        processedFiles,
        sourceFile: node.getSourceFile(),
        typeChecker,
      };
      const resolved = resolutionStrategy(context);
      controllers.push(...resolved);
    }
  }
};
