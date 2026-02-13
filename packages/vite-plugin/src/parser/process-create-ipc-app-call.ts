import {
  CallExpression,
  isArrayLiteralExpression,
  isCallExpression,
  isIdentifier,
  isObjectLiteralExpression,
  isPropertyAssignment,
  PropertyAssignment,
  TypeChecker,
} from "typescript";

import { unwrapExpression } from "./ast-utils.js";
import { resolveControllersFromArray } from "./resolve-controllers-from-array.js";
import { resolveControllersFromModule } from "./resolve-controllers-from-module.js";
import { ControllerMetadata } from "./types.js";

export const processCreateIpcAppCall = (
  node: CallExpression,
  typeChecker: TypeChecker,
  processedFiles: Set<string>,
  controllers: ControllerMetadata[],
  fileCache: Map<string, ControllerMetadata[]>,
): void => {
  const args = node.arguments;
  if (args.length === 0) return;

  const optionsObj = args[0];
  if (!isObjectLiteralExpression(optionsObj)) return;

  const controllersProp = optionsObj.properties.find(
    (p): p is PropertyAssignment => isPropertyAssignment(p) && isIdentifier(p.name) && p.name.text === "controllers",
  );

  if (!controllersProp) return;

  const initializer = unwrapExpression(controllersProp.initializer);

  if (isArrayLiteralExpression(initializer)) {
    resolveControllersFromArray(initializer, typeChecker, processedFiles, controllers, fileCache);
    return;
  }

  if (isCallExpression(initializer)) {
    resolveControllersFromModule(initializer, typeChecker, processedFiles, controllers, fileCache);
  }
};
