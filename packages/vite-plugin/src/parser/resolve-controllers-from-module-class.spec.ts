import path from "path";
import { forEachChild, isClassDeclaration } from "typescript";

import { resolveController } from "./resolve-controller";
import { resolveControllersFromModuleClass } from "./resolve-controllers-from-module-class";
import { createFixtureProgram } from "./test-utils";
import { ControllerMetadata } from "./types";

jest.mock("./resolve-controller");

describe("resolveControllersFromModuleClass", () => {
  const nestFixturesDir = path.resolve(__dirname, "fixtures/nest-module");

  it("should resolve controllers from module class providers/controllers", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(nestFixturesDir, "ipc.module.ts");
    const processedFiles = new Set<string>();
    const controllers: ControllerMetadata[] = [];
    const fileCache = new Map<string, ControllerMetadata[]>();

    let foundClass = false;
    forEachChild(sourceFile, function visit(node) {
      if (isClassDeclaration(node) && node.name?.text === "IpcModule") {
        resolveControllersFromModuleClass(node, typeChecker, processedFiles, controllers, fileCache);
        foundClass = true;
      }
      forEachChild(node, visit);
    });

    expect(foundClass).toBe(true);
    expect(resolveController).toHaveBeenCalled();
  });
});
