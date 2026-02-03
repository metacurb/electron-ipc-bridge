import { IpcMainEvent, IpcMainInvokeEvent } from "electron";

import { ParameterInjection } from "../../metadata/types";

import { resolveInjectionValue } from "./resolve-injection-value";

export const createParameterInjectionWrapper = <TArgs extends unknown[], TReturn>(
  handler: (...args: TArgs) => TReturn,
  paramInjections: ParameterInjection[] | undefined,
): ((event: IpcMainEvent | IpcMainInvokeEvent, ...args: TArgs) => TReturn) => {
  if (!paramInjections?.length) {
    return (event: IpcMainEvent | IpcMainInvokeEvent, ...args: TArgs) => {
      return handler(...args);
    };
  }

  return (event: IpcMainEvent | IpcMainInvokeEvent, ...args: TArgs) => {
    const injectionsMap = new Map((paramInjections || []).map((i) => [i.index, i]));
    const totalArgsCount = (paramInjections?.length || 0) + args.length;
    const finalArgs: unknown[] = [];
    let argIndex = 0;

    for (let i = 0; i < totalArgsCount; i++) {
      const injection = injectionsMap.get(i);
      if (injection) {
        finalArgs.push(resolveInjectionValue(injection.type, event));
      } else {
        if (argIndex < args.length) {
          finalArgs.push(args[argIndex++]);
        } else {
          finalArgs.push(undefined);
        }
      }
    }

    while (argIndex < args.length) {
      finalArgs.push(args[argIndex++]);
    }

    return handler(...(finalArgs as TArgs));
  };
};
