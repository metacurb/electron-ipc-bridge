import { IpcMainInvokeEvent } from "electron";

import { ParameterInjectionType } from "../../metadata/types";

import { resolveInjectionValue } from "./resolve-injection-value";

describe("resolveInjectionValue", () => {
  const mockEvent = { frameId: 10, sender: { id: 1 } } as unknown as IpcMainInvokeEvent;

  test("should resolve RawEvent to the event object", () => {
    const result = resolveInjectionValue("RawEvent", mockEvent);
    expect(result).toBe(mockEvent);
  });

  test("should throw error for unknown injection type", () => {
    expect(() => {
      resolveInjectionValue("UNKNOWN_TYPE" as ParameterInjectionType, mockEvent);
    }).toThrow("Unknown parameter injection type: UNKNOWN_TYPE");
  });
});
