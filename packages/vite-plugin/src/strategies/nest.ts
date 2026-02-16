import {
  ClassDeclaration,
  forEachChild,
  isCallExpression,
  isClassDeclaration,
  isIdentifier,
  isPropertyAccessExpression,
  SourceFile,
  TypeChecker,
} from "typescript";

import { resolveControllersFromNestRoot } from "../parser/resolve-controllers-from-nest-root.js";

import type { DependencyResolutionStrategy, ResolutionContext } from "./types.js";

/**
 * Scans a source file for `NestFactory.createApplicationContext(ModuleClass)` and
 * returns the class declaration of `ModuleClass` if found.
 */
const findNestRootModule = (sourceFile: SourceFile, typeChecker: TypeChecker): ClassDeclaration | undefined => {
  let found: ClassDeclaration | undefined;

  const visit = (node: import("typescript").Node): void => {
    if (found) return;
    if (!isCallExpression(node)) {
      forEachChild(node, visit);
      return;
    }
    const expr = node.expression;
    if (!isPropertyAccessExpression(expr) || expr.name.text !== "createApplicationContext") {
      forEachChild(node, visit);
      return;
    }
    const firstArg = node.arguments[0];
    if (!firstArg || !isIdentifier(firstArg)) {
      forEachChild(node, visit);
      return;
    }
    const symbol = typeChecker.getSymbolAtLocation(firstArg);
    if (!symbol) {
      forEachChild(node, visit);
      return;
    }
    let targetSymbol = symbol;
    try {
      const aliased = typeChecker.getAliasedSymbol(symbol);
      if (aliased) targetSymbol = aliased;
    } catch {
      // not an alias
    }
    const decl = targetSymbol.declarations?.[0];
    if (decl && isClassDeclaration(decl)) {
      found = decl;
      return;
    }
    forEachChild(node, visit);
  };

  forEachChild(sourceFile, visit);
  return found;
};

/**
 * NestJS resolution strategy: locates the root module via
 * `NestFactory.createApplicationContext(ModuleClass)` and recursively walks
 * `@Module({ imports: [...] })` to discover all IPC controllers.
 */
export const nestResolutionStrategy = (context: ResolutionContext): ReturnType<DependencyResolutionStrategy> => {
  const { fileCache, processedFiles, sourceFile, typeChecker } = context;
  const rootModule = findNestRootModule(sourceFile, typeChecker);
  if (!rootModule) return [];

  const controllers: ReturnType<DependencyResolutionStrategy> = [];
  const visitedModules = new Set<string>();
  resolveControllersFromNestRoot(rootModule, typeChecker, processedFiles, controllers, fileCache, visitedModules);
  return controllers;
};
