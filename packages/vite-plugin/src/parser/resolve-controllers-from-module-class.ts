import {
  ClassDeclaration,
  getDecorators,
  isArrayLiteralExpression,
  isCallExpression,
  isIdentifier,
  isObjectLiteralExpression,
  isPropertyAssignment,
  TypeChecker,
} from "typescript";

import { resolveController } from "./resolve-controller.js";
import { ControllerMetadata } from "./types.js";

export const resolveControllersFromModuleClass = (
  targetDecl: ClassDeclaration,
  typeChecker: TypeChecker,
  processedFiles: Set<string>,
  controllers: ControllerMetadata[],
  fileCache: Map<string, ControllerMetadata[]>,
): void => {
  const decorators = getDecorators(targetDecl);
  if (!decorators) return;

  for (const decorator of decorators) {
    if (!isCallExpression(decorator.expression)) continue;
    const moduleArgs = decorator.expression.arguments;
    const moduleOptions = moduleArgs[0];
    if (!moduleOptions || !isObjectLiteralExpression(moduleOptions)) continue;

    const properties = moduleOptions.properties;
    for (const prop of properties) {
      if (!isPropertyAssignment(prop) || !isIdentifier(prop.name)) continue;
      if (prop.name.text === "providers" || prop.name.text === "controllers") {
        if (!isArrayLiteralExpression(prop.initializer)) continue;
        const providerElements = prop.initializer.elements;
        providerElements.forEach((element) => {
          resolveController(element, typeChecker, processedFiles, controllers, fileCache);
        });
      }
    }
  }
};
