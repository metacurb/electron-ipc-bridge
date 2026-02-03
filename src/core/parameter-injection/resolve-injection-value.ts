import { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent } from "electron";

import { ParameterInjectionType } from "../../metadata/types";

export const resolveInjectionValue = (
  type: ParameterInjectionType,
  event: IpcMainEvent | IpcMainInvokeEvent,
): unknown => {
  switch (type) {
    case "RawEvent":
      return event;
    case "Sender":
      return event.sender;
    case "ProcessId":
      return event.processId;
    case "Origin":
      return event.senderFrame;
    case "Window":
      return BrowserWindow.fromWebContents(event.sender);

    default:
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Unknown parameter injection type: ${type}`);
  }
};
