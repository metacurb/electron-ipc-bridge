import path from "path";
import { forEachChild, isClassDeclaration, isMethodDeclaration, MethodDeclaration, SourceFile } from "typescript";

import { collectExternalTypeReferencesFromType } from "./collect-external-type-references";
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

describe("collectExternalTypeReferencesFromType", () => {
  const nodeTypesDir = path.resolve(__dirname, "fixtures/node-types");

  it("collects node when type is NodeJS.Platform", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(nodeTypesDir, "platform.controller.ts", {
      types: ["node"],
    });
    const method = getMethod(sourceFile, "PlatformController", "getPlatform");
    const signature = typeChecker.getSignatureFromDeclaration(method);

    expect(signature).toBeDefined();
    const out = collectExternalTypeReferencesFromType(signature!.getReturnType(), typeChecker);

    expect(out.has("node")).toBe(true);
  });

  it("returns empty set for types from project source", () => {
    const simpleDir = path.resolve(__dirname, "fixtures/simple");
    const { sourceFile, typeChecker } = createFixtureProgram(simpleDir, "counter.controller.ts");
    const method = getMethod(sourceFile, "CounterController", "getCount");
    const signature = typeChecker.getSignatureFromDeclaration(method);

    expect(signature).toBeDefined();
    const out = collectExternalTypeReferencesFromType(signature!.getReturnType(), typeChecker);

    expect(out.size).toBe(0);
  });
});
