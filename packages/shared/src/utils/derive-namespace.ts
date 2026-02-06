import { toCamelCase } from "./to-camel-case.js";

export const deriveNamespace = (name: string): string => toCamelCase(name.replace(/Controller$/, ""));
