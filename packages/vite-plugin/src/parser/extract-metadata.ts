import { forEachChild, isClassDeclaration, SourceFile, TypeChecker } from "typescript";

import { getDecorator } from "./get-decorator.js";
import { parseController } from "./parse-controller.js";
import { ControllerMetadata } from "./types.js";

export const extractControllerMetadata = (sourceFile: SourceFile, typeChecker: TypeChecker): ControllerMetadata[] => {
  const controllers: ControllerMetadata[] = [];

  forEachChild(sourceFile, (node) => {
    if (isClassDeclaration(node)) {
      const decorator = getDecorator(node, "IpcController");
      if (decorator) {
        const controller = parseController(node, decorator, sourceFile, typeChecker);
        if (controller) {
          controllers.push(controller);
        }
      }
    }
  });

  return controllers;
};
