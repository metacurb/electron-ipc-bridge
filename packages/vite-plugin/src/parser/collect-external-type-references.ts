import {
  isEnumDeclaration,
  isInterfaceDeclaration,
  isTypeAliasDeclaration,
  Symbol,
  Type,
  TypeChecker,
} from "typescript";

const NODE_TYPES_PATH_RE = /[\\/]@types[\\/]node[\\/]/i;

const pickDeclaration = (symbol: Symbol | undefined) =>
  symbol
    ?.getDeclarations()
    ?.find((d) => isTypeAliasDeclaration(d) || isInterfaceDeclaration(d) || isEnumDeclaration(d));

const resolveDeclarationFromSymbol = (symbol: Symbol | undefined, typeChecker: TypeChecker) => {
  let decl = pickDeclaration(symbol);
  if (!decl && symbol) {
    try {
      const aliased = typeChecker.getAliasedSymbol(symbol);
      const aliasedDecl = pickDeclaration(aliased);
      if (aliasedDecl) {
        decl = aliasedDecl;
      }
    } catch {
      // Not an alias; fall back to original symbol
    }
  }
  return decl;
};

const addReferenceTypeIfExternal = (symbol: Symbol | undefined, typeChecker: TypeChecker, out: Set<string>): void => {
  const decl = resolveDeclarationFromSymbol(symbol, typeChecker);
  if (!decl) return;

  const sourceFile = decl.getSourceFile();
  if (NODE_TYPES_PATH_RE.test(sourceFile.fileName)) {
    out.add("node");
  }
};

const walkTypeForExternalRefs = (type: Type, typeChecker: TypeChecker, seen: Set<Type>, out: Set<string>): void => {
  if (seen.has(type)) return;
  seen.add(type);

  addReferenceTypeIfExternal(type.getSymbol(), typeChecker, out);

  const typeWithAlias = type as Type & { aliasSymbol?: Symbol };
  addReferenceTypeIfExternal(typeWithAlias.aliasSymbol, typeChecker, out);

  const typeWithNested = type as Type & {
    aliasTypeArguments?: readonly Type[];
    typeArguments?: readonly Type[];
    types?: readonly Type[];
  };

  typeWithNested.aliasTypeArguments?.forEach((arg) => walkTypeForExternalRefs(arg, typeChecker, seen, out));
  typeWithNested.typeArguments?.forEach((arg) => walkTypeForExternalRefs(arg, typeChecker, seen, out));
  typeWithNested.types?.forEach((nested) => walkTypeForExternalRefs(nested, typeChecker, seen, out));
};

export const collectExternalTypeReferencesFromType = (
  type: Type,
  typeChecker: TypeChecker,
  out = new Set<string>(),
): Set<string> => {
  walkTypeForExternalRefs(type, typeChecker, new Set<Type>(), out);
  return out;
};
