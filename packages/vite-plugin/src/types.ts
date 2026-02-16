export interface PluginTypesOptions {
  /** Output path for generated global Window augmentation d.ts. @default auto-detected */
  global?: string | false;
  /** Output path for generated runtime types module. @default auto-detected */
  runtime?: string | false;
}

/**
 * Options for the electron-ipc-bridge Vite plugin.
 */
export interface PluginOptions {
  /** Path to your main process entry file. @default "src/main/index.ts" */
  main?: string;
  /** Path to your preload entry file. @default "src/preload/index.ts" */
  preload?: string;
  /** Output configuration for generated types. */
  types?: PluginTypesOptions;
}

export interface electronIpcBridgePlugin {
  buildStart?(): void | Promise<void>;
  configResolved?(config: { root: string }): void | Promise<void>;
  configureServer?(server: {
    watcher: { add: (path: string) => void; on: (e: "change", fn: (path: string) => void) => void };
  }): void;
  name: string;
  transform?(code: string, id: string): null | Promise<null>;
}
