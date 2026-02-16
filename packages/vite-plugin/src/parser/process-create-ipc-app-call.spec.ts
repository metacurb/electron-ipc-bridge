import path from "path";
import { forEachChild, isCallExpression, isIdentifier } from "typescript";

import { processCreateIpcAppCall } from "./process-create-ipc-app-call";
import { resolveController } from "./resolve-controller";
import { resolveControllersFromModuleClass } from "./resolve-controllers-from-module-class";
import { createFixtureProgram } from "./test-utils";
import { ControllerMetadata } from "./types";

jest.mock("./resolve-controller");
jest.mock("./resolve-controllers-from-module-class");

describe("processCreateIpcAppCall", () => {
  const fixturesDir = path.resolve(__dirname, "fixtures/simple");
  const nestFixturesDir = path.resolve(__dirname, "fixtures/nest-module");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("processes createIpcApp call and calls resolveController", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(fixturesDir, "index.ts");
    const processedFiles = new Set<string>();
    const controllers: ControllerMetadata[] = [];
    let processed = false;

    forEachChild(sourceFile, function visit(node) {
      if (isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === "createIpcApp") {
        processCreateIpcAppCall(node, typeChecker, processedFiles, controllers, new Map());
        processed = true;
      }
      forEachChild(node, visit);
    });

    expect(processed).toBe(true);
    expect(resolveController).toHaveBeenCalled();
  });

  it("resolves controllers from module providers when passed via helper", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(nestFixturesDir, "index.ts");
    const processedFiles = new Set<string>();
    const controllers: ControllerMetadata[] = [];
    let processed = false;

    forEachChild(sourceFile, function visit(node) {
      if (isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === "createIpcApp") {
        processCreateIpcAppCall(node, typeChecker, processedFiles, controllers, new Map());
        processed = true;
      }
      forEachChild(node, visit);
    });

    expect(processed).toBe(true);
    expect(resolveControllersFromModuleClass).toHaveBeenCalled();
  });

  it("resolves controllers from passed app variable", () => {
    const runtimeAppFixturesDir = path.resolve(__dirname, "fixtures/runtime-app-resolution");
    const { sourceFile, typeChecker } = createFixtureProgram(runtimeAppFixturesDir, "index.ts");
    const processedFiles = new Set<string>();
    const controllers: ControllerMetadata[] = [];
    let processed = false;

    forEachChild(sourceFile, function visit(node) {
      if (isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === "createIpcApp") {
        processCreateIpcAppCall(node, typeChecker, processedFiles, controllers, new Map());
        processed = true;
      }
      forEachChild(node, visit);
    });

    expect(processed).toBe(true);
    expect(resolveControllersFromModuleClass).toHaveBeenCalled();
  });

  it("resolves convoluted application setup", () => {
    const convolutedFixturesDir = path.resolve(__dirname, "fixtures/convoluted-app-resolution");
    const { sourceFile, typeChecker } = createFixtureProgram(convolutedFixturesDir, "index.ts");
    const processedFiles = new Set<string>();
    const controllers: ControllerMetadata[] = [];
    let processed = false;

    forEachChild(sourceFile, function visit(node) {
      if (isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === "createIpcApp") {
        processCreateIpcAppCall(node, typeChecker, processedFiles, controllers, new Map());
        processed = true;
      }
      forEachChild(node, visit);
    });

    expect(processed).toBe(true);
    expect(resolveControllersFromModuleClass).toHaveBeenCalled();
  });

  it("invokes resolutionStrategy when call expression yields no controllers", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(nestFixturesDir, "index.ts");
    const processedFiles = new Set<string>();
    const controllers: ControllerMetadata[] = [];
    const mockStrategy = jest.fn().mockReturnValue([]);

    forEachChild(sourceFile, function visit(node) {
      if (isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === "createIpcApp") {
        processCreateIpcAppCall(node, typeChecker, processedFiles, controllers, new Map(), mockStrategy);
      }
      forEachChild(node, visit);
    });

    expect(mockStrategy).toHaveBeenCalledWith(
      expect.objectContaining({
        fileCache: expect.any(Map),
        processedFiles: expect.any(Set),
        sourceFile: expect.anything(),
        typeChecker: expect.anything(),
      }),
    );
  });

  it("does NOT invoke resolutionStrategy when primary resolution succeeds", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(fixturesDir, "index.ts");
    const processedFiles = new Set<string>();
    const controllers: ControllerMetadata[] = [];
    const mockStrategy = jest.fn().mockReturnValue([]);

    forEachChild(sourceFile, function visit(node) {
      if (isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === "createIpcApp") {
        processCreateIpcAppCall(node, typeChecker, processedFiles, controllers, new Map(), mockStrategy);
      }
      forEachChild(node, visit);
    });

    expect(mockStrategy).not.toHaveBeenCalled();
  });
});
