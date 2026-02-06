import { toSnakeCase } from "./to-snake-case.js";

export const toCamelCase = (str: string) =>
  toSnakeCase(str)
    .replace(/_([a-z0-9])/g, (_, c: string) => c.toLocaleUpperCase())
    .replace(/_/g, "")
    .replace(/^./, (s: string) => s.toLocaleLowerCase());
