import type { IpcDecoratorName } from "@electron-ipc-bridge/shared";

export interface ControllerMetadata {
  className: string;
  filePath: string;
  methods: MethodMetadata[];
  namespace: string;
  referencedTypes: TypeDefinition[];
  requiredReferenceTypes?: string[];
}
export interface TypeDefinition {
  definition: string;
  name: string;
  referencedTypes: TypeDefinition[];
  sourceFile: string;
}

export interface MethodMetadata {
  decoratorName: IpcDecoratorName;
  name: string;
  params: ParamMetadata[];
  referencedTypes: TypeDefinition[];
  requiredReferenceTypes?: string[];
  returnType: string;
}

export interface ParamMetadata {
  name: string;
  optional: boolean;
  type: string;
}
