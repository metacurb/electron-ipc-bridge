import { IPC_CONTROLLER_METADATA } from "./constants";
import type { Constructor } from "./types";

/**
 * Type guard that checks whether the given value is a constructor decorated
 * with {@link IpcController}.
 *
 * @param value - The value to check.
 * @returns `true` if `value` is a constructor with IPC controller metadata, narrowing
 *   the type to {@link Constructor}.
 */
export const isIpcController = (value: unknown): value is Constructor => {
  if (typeof value !== "function") return false;
  if (!("prototype" in value) || value.prototype === undefined) return false;
  const meta = Reflect.getMetadata(IPC_CONTROLLER_METADATA, value);
  return meta !== undefined;
};
