import { toSnakeCase } from "@electron-ipc-controller/shared";

export const createChannelName = (namespace: string, method: string): string =>
  [namespace, method].map(toSnakeCase).join(".");
