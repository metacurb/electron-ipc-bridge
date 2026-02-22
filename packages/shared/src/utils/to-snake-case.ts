export const toSnakeCase = (str: string): string =>
  str
    .trim()
    .replace(/[\s-]+|(?<=[a-z\d])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/g, "_")
    .toLocaleLowerCase();
