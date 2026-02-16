import type { SourceFile, TypeChecker } from "typescript";

import type { ControllerMetadata } from "../parser/types.js";

/** Context passed to a resolution strategy when fallback resolution is triggered. */
export interface ResolutionContext {
  fileCache: Map<string, ControllerMetadata[]>;
  processedFiles: Set<string>;
  /** The main entry source file where `createIpcApp(...)` was found. */
  sourceFile: SourceFile;
  typeChecker: TypeChecker;
}

/** A function that discovers controllers when the primary static analysis paths find nothing. */
export type DependencyResolutionStrategy = (context: ResolutionContext) => ControllerMetadata[];
