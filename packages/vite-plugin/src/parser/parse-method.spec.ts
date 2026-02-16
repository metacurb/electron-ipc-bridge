import path from "path";
import { forEachChild, isClassDeclaration, isMethodDeclaration, MethodDeclaration, SourceFile } from "typescript";

import { parseMethod } from "./parse-method";
import { createFixtureProgram } from "./test-utils";

const getMethod = (sourceFile: SourceFile, className: string, methodName: string): MethodDeclaration => {
  let method: MethodDeclaration | undefined;

  forEachChild(sourceFile, (node) => {
    if (isClassDeclaration(node) && node.name?.text === className) {
      node.members.forEach((member) => {
        if (isMethodDeclaration(member) && member.name.getText() === methodName) {
          method = member;
        }
      });
    }
  });

  if (!method) {
    throw new Error(`Method ${className}.${methodName} not found in source file`);
  }
  return method;
};

describe("parseMethod", () => {
  const fixturesDir = path.resolve(__dirname, "fixtures/simple");
  const nodeTypesFixturesDir = path.resolve(__dirname, "fixtures/node-types");

  it("parses IpcHandle method", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(fixturesDir, "counter.controller.ts");
    const method = getMethod(sourceFile, "CounterController", "getCount");

    const metadata = parseMethod(method, typeChecker);

    expect(metadata).toBeDefined();
    expect(metadata?.name).toBe("getCount");
    expect(metadata?.decoratorName).toBe("IpcHandle");
    expect(metadata?.returnType).toBe("number");
  });

  it("parses method with parameters", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(fixturesDir, "counter.controller.ts");
    const method = getMethod(sourceFile, "CounterController", "increment");

    const metadata = parseMethod(method, typeChecker);

    expect(metadata).toBeDefined();
    expect(metadata?.name).toBe("inc"); // @IpcHandle("inc") overrides the method name
    expect(metadata?.params).toHaveLength(1);
    expect(metadata?.params[0].name).toBe("amount");
    expect(metadata?.params[0].type).toBe("number");
  });

  it("parses IpcOn method", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(fixturesDir, "counter.controller.ts");
    const method = getMethod(sourceFile, "CounterController", "reset");

    const metadata = parseMethod(method, typeChecker);

    expect(metadata).toBeDefined();
    expect(metadata?.name).toBe("reset");
    expect(metadata?.decoratorName).toBe("IpcOn");
    expect(metadata?.returnType).toBe("void");
  });

  it("collects inferred return type definitions when return annotation is missing", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(fixturesDir, "counter.controller.ts");
    const method = getMethod(sourceFile, "CounterController", "getInferredList");

    const metadata = parseMethod(method, typeChecker);

    expect(metadata).toBeDefined();
    expect(metadata?.returnType).toBe("ListModel[]");
    const names = metadata?.referencedTypes.map((t) => t.name) ?? [];
    expect(names).toContain("ListModel");
  });

  it("collects node external type references from return types", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(nodeTypesFixturesDir, "platform.controller.ts", {
      types: ["node"],
    });
    const method = getMethod(sourceFile, "PlatformController", "getPlatform");

    const metadata = parseMethod(method, typeChecker);

    expect(metadata).toBeDefined();
    expect(metadata?.returnType).toBe("NodeJS.Platform");
    expect(metadata?.requiredReferenceTypes).toContain("node");
  });
});
