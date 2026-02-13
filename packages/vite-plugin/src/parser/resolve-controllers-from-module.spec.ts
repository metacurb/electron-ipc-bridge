import path from "path";
import { forEachChild, isCallExpression } from "typescript";

import { resolveController } from "./resolve-controller";
import { resolveControllersFromModule } from "./resolve-controllers-from-module";
import { createFixtureProgram } from "./test-utils";
import { ControllerMetadata } from "./types";

jest.mock("./resolve-controller");

describe("resolveControllersFromModule", () => {
  const nestFixturesDir = path.resolve(__dirname, "fixtures/nest-module");

  it("should resolve controllers from module providers", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(nestFixturesDir, "index.ts");
    const processedFiles = new Set<string>();
    const controllers: ControllerMetadata[] = [];
    const fileCache = new Map<string, ControllerMetadata[]>();

    let foundCall = false;
    forEachChild(sourceFile, function visit(node) {
      if (isCallExpression(node) && node.expression.getText() === "getIpcControllersFromModule") {
        resolveControllersFromModule(node, typeChecker, processedFiles, controllers, fileCache);
        foundCall = true;
      }
      forEachChild(node, visit);
    });

    expect(foundCall).toBe(true);
    expect(resolveController).toHaveBeenCalled();
  });
});
