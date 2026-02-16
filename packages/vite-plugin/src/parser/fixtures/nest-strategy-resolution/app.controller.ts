function IpcController(): (target: typeof AppController) => void | typeof AppController {
  throw new Error("Function not implemented.");
}

function IpcHandle(
  _name?: string,
): (
  target: AppController,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<() => string>,
) => void | TypedPropertyDescriptor<() => string> {
  throw new Error("Function not implemented.");
}

@IpcController()
export class AppController {
  @IpcHandle()
  ping(): string {
    return "pong";
  }
}
