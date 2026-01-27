export const buildChannel = (namespace: string, method: string): string => `${namespace}:${method}`;

export const deriveNamespaceFromClassName = (name: string): string =>
  name
    .replace(/Controller$/, "")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLocaleLowerCase();
