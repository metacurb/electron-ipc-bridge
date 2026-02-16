function IpcController(): (target: typeof InferredPlatformController) => void | typeof InferredPlatformController {
  throw new Error("Function not implemented.");
}

function IpcHandle<T extends (...args: any[]) => any>(
  _name?: string,
): (
  target: InferredPlatformController,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>,
) => void | TypedPropertyDescriptor<T> {
  throw new Error("Function not implemented.");
}

@IpcController()
export class InferredPlatformController {
  @IpcHandle()
  getPlatform() {
    return process.platform;
  }
}
