import { ControllerMetadata, TypeDefinition } from "./types.js";

export const collectDependencies = (
  referencedTypes: ControllerMetadata["referencedTypes"],
  processedFiles: Set<string>,
) => {
  const visited = new Set<TypeDefinition>();

  const visit = (types: typeof referencedTypes) => {
    for (const type of types) {
      if (visited.has(type)) {
        continue;
      }
      visited.add(type);

      if (type.sourceFile) {
        processedFiles.add(type.sourceFile);
      }
      visit(type.referencedTypes);
    }
  };
  visit(referencedTypes);
};
