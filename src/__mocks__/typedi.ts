const registry = new Map<unknown, unknown>();

interface MockContainer {
  get: jest.Mock;
  has: jest.Mock;
  reset: jest.Mock;
  set: jest.Mock;
}

const mockContainer: MockContainer = {
  get: jest.fn((id: unknown) => registry.get(id)),
  has: jest.fn((id: unknown) => registry.has(id)),
  reset: jest.fn(() => {
    registry.clear();
  }),
  set: jest.fn((id: unknown, value: unknown) => {
    registry.set(id, value);
    return mockContainer;
  }),
};

export const Container = mockContainer;
export default mockContainer;
