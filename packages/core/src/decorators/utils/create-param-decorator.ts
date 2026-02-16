import { IpcMainEvent, IpcMainInvokeEvent } from "electron";

import { IPC_PARAM_INJECTIONS } from "../../metadata/constants";
import { ParameterInjection, ParameterInjectionContext } from "../../metadata/types";

/**
 * Factory function for creating custom parameter decorators.
 *
 * The provided `resolver` is called at runtime for each IPC invocation and its
 * return value is injected into the decorated parameter position.
 *
 * @typeParam T - Optional data type that can be passed to the returned decorator
 *   and forwarded to the resolver at runtime.
 * @param resolver - A function that receives the Electron IPC event, a
 *   {@link ParameterInjectionContext}, and optional decorator data, and returns
 *   the value to inject.
 * @returns A parameter decorator factory. Call it with optional data to get a `ParameterDecorator`.
 *
 * @example
 * ```ts
 * const MyParam = createParamDecorator((event, context) => {
 *   return event.sender.id;
 * });
 *
 * class MyController {
 *   @IpcHandle()
 *   greet(@MyParam() senderId: number) { ... }
 * }
 * ```
 */
export const createParamDecorator = <T = unknown>(
  resolver: (event: IpcMainEvent | IpcMainInvokeEvent, context: ParameterInjectionContext, data?: T) => unknown,
) => {
  return (data?: T): ParameterDecorator =>
    (target: object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
      if (!propertyKey) {
        return;
      }

      const existingInjections: ParameterInjection[] =
        Reflect.getOwnMetadata(IPC_PARAM_INJECTIONS, target, propertyKey) || [];

      const newInjection: ParameterInjection<T> = {
        data,
        index: parameterIndex,
        resolver,
      };

      Reflect.defineMetadata(IPC_PARAM_INJECTIONS, [...existingInjections, newInjection], target, propertyKey);
    };
};
