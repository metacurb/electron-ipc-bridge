import { BrowserWindow, IpcMainInvokeEvent } from "electron";

import { ParameterInjectionType } from "../../metadata/types";

import { resolveInjectionValue } from "./resolve-injection-value";

describe("resolveInjectionValue", () => {
  const mockEvent = { frameId: 10, sender: { id: 1 } } as unknown as IpcMainInvokeEvent;

  test("should resolve RawEvent to the event object", () => {
    const result = resolveInjectionValue("RawEvent", mockEvent);
    expect(result).toBe(mockEvent);
  });

  test("should resolve Sender to event.sender", () => {
    const result = resolveInjectionValue("Sender", mockEvent);
    expect(result).toBe(mockEvent.sender);
  });

  test("should resolve ProcessId to event.processId", () => {
    mockEvent.processId = 123;
    const result = resolveInjectionValue("ProcessId", mockEvent);
    expect(result).toBe(123);
  });

  test("should resolve Origin to event.senderFrame", () => {
    Object.defineProperty(mockEvent, "senderFrame", {
      configurable: true,
      value: { name: "frame" },
    });
    const result = resolveInjectionValue("Origin", mockEvent);
    expect(result).toBe(mockEvent.senderFrame);
  });

  test("should resolve Window to BrowserWindow", () => {
    const mockWindow = { id: 1 };

    (BrowserWindow.fromWebContents as jest.Mock).mockReturnValue(mockWindow);

    const result = resolveInjectionValue("Window", mockEvent);
    expect(result).toBe(mockWindow);
    expect(BrowserWindow.fromWebContents).toHaveBeenCalledWith(mockEvent.sender);
  });

  test("should throw error for unknown injection type", () => {
    expect(() => {
      resolveInjectionValue("UNKNOWN_TYPE" as ParameterInjectionType, mockEvent);
    }).toThrow("Unknown parameter injection type: UNKNOWN_TYPE");
  });
});
