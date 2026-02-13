import { ArrayLiteralExpression, TypeChecker } from "typescript";

import { resolveController } from "./resolve-controller.js";
import { ControllerMetadata } from "./types.js";

export const resolveControllersFromArray = (
  initializer: ArrayLiteralExpression,
  typeChecker: TypeChecker,
  processedFiles: Set<string>,
  controllers: ControllerMetadata[],
  fileCache: Map<string, ControllerMetadata[]>,
): void => {
  initializer.elements.forEach((element) => {
    resolveController(element, typeChecker, processedFiles, controllers, fileCache);
  });
};
