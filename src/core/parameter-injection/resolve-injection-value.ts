import { IpcMainEvent, IpcMainInvokeEvent } from "electron";

import { ParameterInjectionType } from "../../metadata/types";

export const resolveInjectionValue = (
  type: ParameterInjectionType,
  event: IpcMainEvent | IpcMainInvokeEvent,
): unknown => {
  switch (type) {
    case "RawEvent":
      return event;

    default:
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Unknown parameter injection type: ${type}`);
  }
};
