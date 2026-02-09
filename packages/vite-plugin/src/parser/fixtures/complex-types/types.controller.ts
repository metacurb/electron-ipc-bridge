function IpcController(): (target: typeof TypesController) => void | typeof TypesController {
  throw new Error("Function not implemented.");
}

function IpcHandle(
  _name?: string,
): (
  target: TypesController,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<(input: ComplexInput) => boolean>,
) => void | TypedPropertyDescriptor<(input: ComplexInput) => boolean> {
  throw new Error("Function not implemented.");
}

type AnotherType = {
  key: boolean;
  key2: string;
};

type ComplexInput = {
  nested: { [k: string]: number };
  another: AnotherType;
};

@IpcController()
export class TypesController {
  @IpcHandle()
  test(input: ComplexInput): boolean {
    return true;
  }
}
