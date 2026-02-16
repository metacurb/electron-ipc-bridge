import { IpcHandlerType } from "@electron-ipc-bridge/shared";
import { IpcMainEvent, IpcMainInvokeEvent } from "electron";

export interface IpcControllerMetadata {
  handlers: Map<string, IpcHandlerMetadata>;
  id: string;
  namespace: string;
  target: Constructor;
}

export interface IpcHandlerMetadata {
  channel: string;
  handler: (...args: unknown[]) => unknown;
  methodName: string;
  paramInjections?: ParameterInjection[];
  type: IpcHandlerType;
}

/**
 * Context object passed to parameter decorator resolver functions.
 *
 * @see {@link createParamDecorator}
 */
export interface ParameterInjectionContext {
  /** The fully-qualified IPC channel name for the current invocation. */
  channel: string;
}

export interface ParameterInjection<T = unknown> {
  data?: unknown;
  index: number;
  resolver: (event: IpcMainEvent | IpcMainInvokeEvent, context: ParameterInjectionContext, data?: T) => unknown;
}

export type PendingHandlerMetadata = Omit<IpcHandlerMetadata, "channel">;

export interface IpcApplicationMetadata {
  controllers: Map<string, IpcControllerMetadata>;
  disposers: Disposer[];
}

/**
 * A generic constructor type representing a class that can be instantiated.
 *
 * Used to reference controller classes throughout the library.
 *
 * @typeParam T - The instance type created by the constructor.
 */
export interface Constructor<T = unknown> {
  new (...args: unknown[]): T;
  prototype: T;
}

export type Disposer = () => void;
