import { toSnakeCase } from "@electron-ipc-controller/shared";

import { createChannelName } from "./create-channel-name";

jest.mock("@electron-ipc-controller/shared");

const mockToSnakeCase = jest.mocked(toSnakeCase);

describe("createChannelName", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockToSnakeCase.mockImplementation((input) => input);
  });

  test("should combine namespace and method with a dot", () => {
    expect(createChannelName("user", "create")).toBe("user.create");
  });
});
