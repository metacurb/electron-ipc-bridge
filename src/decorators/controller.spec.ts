import Container from "typedi";

import { createControllerMetadata } from "../metadata/controller-metadata";

import { Controller } from "./controller";

jest.mock("../metadata/controller-metadata");

const mockCreateControllerMetadata = jest.mocked(createControllerMetadata);

describe("Controller decorator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Container.reset();
  });

  test("should register class in Container", () => {
    @Controller()
    class TestController {}

    expect(Container.has(TestController)).toBe(true);
    expect(Container.get(TestController)).toBeInstanceOf(TestController);
  });

  test("should set default namespace from class name", () => {
    @Controller()
    class UserProfileController {}

    expect(mockCreateControllerMetadata).toHaveBeenCalledWith(UserProfileController, {
      namespace: undefined,
    });
  });

  test("should set custom namespace if provided", () => {
    const namespace = "custom";

    @Controller({ namespace })
    class MyController {}

    expect(mockCreateControllerMetadata).toHaveBeenCalledWith(MyController, {
      namespace,
    });
  });
});
