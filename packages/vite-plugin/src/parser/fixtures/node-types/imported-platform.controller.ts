function IpcController(): (target: typeof ImportedPlatformController) => void | typeof ImportedPlatformController {
  throw new Error("Function not implemented.");
}

function IpcHandle<T extends (...args: any[]) => any>(
  _name?: string,
): (
  target: ImportedPlatformController,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>,
) => void | TypedPropertyDescriptor<T> {
  throw new Error("Function not implemented.");
}

@IpcController()
export class ImportedPlatformController {
  @IpcHandle()
  getPlatform() {
    return process.platform;
  }
}
