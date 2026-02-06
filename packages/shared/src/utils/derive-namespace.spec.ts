import { deriveNamespace } from "./derive-namespace.js";
import { toCamelCase } from "./to-camel-case.js";

jest.mock("./to-camel-case");

const mockToCamelCase = jest.mocked(toCamelCase);

describe("Naming Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockToCamelCase.mockImplementation((input) => input);
  });

  describe("deriveNamespace", () => {
    test.each([
      ["UserController", "User"],
      ["UserControllerController", "UserController"],
      ["UserProfileController", "UserProfile"],
    ])('should remove "Controller" suffix from %s', (input: string, expected: string) => {
      expect(deriveNamespace(input)).toBe(expected);
    });
  });
});
