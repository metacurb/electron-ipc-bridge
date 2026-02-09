export const IPC_CONTRACT_CHANNEL = "ipc_controller_contract" as const;

export const IPC_DECORATOR_ON = "IpcOn";
export const IPC_DECORATOR_ONCE = "IpcOnce";
export const IPC_DECORATOR_HANDLE = "IpcHandle";
export const IPC_DECORATOR_HANDLE_ONCE = "IpcHandleOnce";

export const IPC_METHOD_DECORATOR_NAMES = [
  IPC_DECORATOR_HANDLE,
  IPC_DECORATOR_ON,
  IPC_DECORATOR_HANDLE_ONCE,
  IPC_DECORATOR_ONCE,
] as const;

export const IPC_PARAM_INJECTION_DECORATOR_NAMES = [
  "CorrelationId",
  "Origin",
  "ProcessId",
  "RawEvent",
  "Sender",
  "Window",
] as const;
