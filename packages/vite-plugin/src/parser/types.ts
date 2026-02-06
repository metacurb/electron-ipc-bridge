export interface ControllerMetadata {
  className: string;
  filePath: string;
  methods: MethodMetadata[];
  namespace: string;
}

import type { IpcDecoratorName } from "@electron-ipc-controller/shared";

export interface MethodMetadata {
  decoratorName: IpcDecoratorName;
  isAsync: boolean;
  name: string;
  params: ParamMetadata[];
  returnType: string;
}

export interface ParamMetadata {
  name: string;
  optional: boolean;
  type: string;
}
