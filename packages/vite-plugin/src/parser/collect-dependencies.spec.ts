import { collectDependencies } from "./collect-dependencies";
import { TypeDefinition } from "./types";

describe("collectDependencies", () => {
  it("should add source files from referenced types", () => {
    const processedFiles = new Set<string>();
    const referencedTypes: TypeDefinition[] = [
      {
        definition: "",
        name: "TypeA",
        referencedTypes: [],
        sourceFile: "/src/type-a.ts",
      },
    ];

    collectDependencies(referencedTypes, processedFiles);

    expect(processedFiles.size).toBe(1);
    expect(processedFiles.has("/src/type-a.ts")).toBe(true);
  });

  it("should recurse into nested referenced types", () => {
    const processedFiles = new Set<string>();
    const referencedTypes: TypeDefinition[] = [
      {
        definition: "",
        name: "TypeA",
        referencedTypes: [
          {
            definition: "",
            name: "TypeB",
            referencedTypes: [],
            sourceFile: "/src/type-b.ts",
          },
        ],
        sourceFile: "/src/type-a.ts",
      },
    ];

    collectDependencies(referencedTypes, processedFiles);

    expect(processedFiles.size).toBe(2);
    expect(processedFiles.has("/src/type-a.ts")).toBe(true);
    expect(processedFiles.has("/src/type-b.ts")).toBe(true);
  });

  it("should handle types without source files (e.g. built-ins or in-file types)", () => {
    const processedFiles = new Set<string>();
    const referencedTypes: TypeDefinition[] = [
      {
        definition: "",
        name: "TypeA",
        referencedTypes: [],
        sourceFile: undefined as unknown as string,
      },
    ];

    collectDependencies(referencedTypes, processedFiles);

    expect(processedFiles.size).toBe(0);
  });

  it("should handle circular references gracefully", () => {
    const processedFiles = new Set<string>();

    const typeA: TypeDefinition = {
      definition: "",
      name: "TypeA",
      referencedTypes: [],
      sourceFile: "/src/type-a.ts",
    };

    const typeB: TypeDefinition = {
      definition: "",
      name: "TypeB",
      referencedTypes: [typeA],
      sourceFile: "/src/type-b.ts",
    };

    // Create cycle: A -> B -> A
    typeA.referencedTypes.push(typeB);

    collectDependencies([typeA], processedFiles);

    expect(processedFiles.size).toBe(2);
    expect(processedFiles.has("/src/type-a.ts")).toBe(true);
    expect(processedFiles.has("/src/type-b.ts")).toBe(true);
  });
});
