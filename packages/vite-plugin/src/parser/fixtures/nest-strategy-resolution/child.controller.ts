function IpcController(): (target: typeof ChildController) => void | typeof ChildController {
  throw new Error("Function not implemented.");
}

function IpcHandle(
  _name?: string,
): (
  target: ChildController,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<() => number>,
) => void | TypedPropertyDescriptor<() => number> {
  throw new Error("Function not implemented.");
}

@IpcController()
export class ChildController {
  @IpcHandle()
  getCount(): number {
    return 0;
  }
}
