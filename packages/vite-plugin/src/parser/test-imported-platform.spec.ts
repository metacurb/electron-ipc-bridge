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

describe("parseMethod with imported types", () => {
  const nodeTypesFixturesDir = path.resolve(__dirname, "fixtures/node-types");

  it("handles imported Platform type correctly", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(nodeTypesFixturesDir, "imported-platform.controller.ts", {
      types: ["node"],
    });
    const method = getMethod(sourceFile, "ImportedPlatformController", "getPlatform");

    const metadata = parseMethod(method, typeChecker);

    expect(metadata).toBeDefined();

    // We want to ensure it is either fully qualified (NodeJS.Platform) or handled correctly
    // It should definitely track "node" as required reference
    expect(metadata?.requiredReferenceTypes).toContain("node");
  });
});
