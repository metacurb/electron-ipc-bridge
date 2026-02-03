import { IpcMainInvokeEvent } from "electron";

import { createParameterInjectionWrapper } from "./create-parameter-injection-wrapper";

describe("createParameterInjectionWrapper", () => {
  const handler = jest.fn();
  const mockEvent = { sender: { id: 1 } } as IpcMainInvokeEvent;

  beforeEach(() => {
    handler.mockClear();
  });

  test("should strip event and pass args when no injections", () => {
    const wrapper = createParameterInjectionWrapper(handler, undefined);
    wrapper(mockEvent, "arg1", "arg2");

    expect(handler).toHaveBeenCalledWith("arg1", "arg2");
    expect(handler).not.toHaveBeenCalledWith(mockEvent, "arg1", "arg2");
  });

  test("should inject RawEvent at index 0", () => {
    const wrapper = createParameterInjectionWrapper(handler, [{ index: 0, type: "RawEvent" }]);
    wrapper(mockEvent, "arg1");

    expect(handler).toHaveBeenCalledWith(mockEvent, "arg1");
  });

  test("should inject RawEvent at index 1", () => {
    const wrapper = createParameterInjectionWrapper(handler, [{ index: 1, type: "RawEvent" }]);
    wrapper(mockEvent, "arg1");

    expect(handler).toHaveBeenCalledWith("arg1", mockEvent);
  });

  test("should inject RawEvent at index 2 (argument shifting)", () => {
    const wrapper = createParameterInjectionWrapper(handler, [{ index: 1, type: "RawEvent" }]);
    wrapper(mockEvent, "arg1", "arg2");

    expect(handler).toHaveBeenCalledWith("arg1", mockEvent, "arg2");
  });

  test("should handle multiple injections correctly (reverse order sort)", () => {
    const wrapper = createParameterInjectionWrapper(handler, [
      { index: 0, type: "RawEvent" },
      { index: 2, type: "RawEvent" },
    ]);

    wrapper(mockEvent, "arg1", "arg2");

    expect(handler).toHaveBeenCalledWith(mockEvent, "arg1", mockEvent, "arg2");
  });
});
