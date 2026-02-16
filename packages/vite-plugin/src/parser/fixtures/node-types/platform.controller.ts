function IpcController(): (target: typeof PlatformController) => void | typeof PlatformController {
  throw new Error("Function not implemented.");
}

function IpcHandle<T extends (...args: any[]) => any>(
  _name?: string,
): (
  target: PlatformController,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>,
) => void | TypedPropertyDescriptor<T> {
  throw new Error("Function not implemented.");
}

@IpcController()
export class PlatformController {
  @IpcHandle()
  getPlatform(): NodeJS.Platform {
    return process.platform;
  }
}
