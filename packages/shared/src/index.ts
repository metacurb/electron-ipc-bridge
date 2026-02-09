export type {
  IpcHandlerType,
  IpcDecoratorName,
  SerializedHandler,
  SerializedController,
  SerializedIpcContract,
} from "./types.js";
export {
  IPC_CONTRACT_CHANNEL,
  IPC_DECORATOR_ON,
  IPC_DECORATOR_ONCE,
  IPC_DECORATOR_HANDLE,
  IPC_DECORATOR_HANDLE_ONCE,
  IPC_METHOD_DECORATOR_NAMES,
  IPC_PARAM_INJECTION_DECORATOR_NAMES,
} from "./constants.js";
export { toSnakeCase } from "./utils/to-snake-case.js";
export { toCamelCase } from "./utils/to-camel-case.js";
export { deriveNamespace } from "./utils/derive-namespace.js";
