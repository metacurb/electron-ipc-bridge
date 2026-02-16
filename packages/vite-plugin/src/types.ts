export interface PluginTypesOptions {
  /** Output path for generated global Window augmentation d.ts. @default auto-detected */
  global?: string | false;
  /** Output path for generated runtime types module. @default auto-detected */
  runtime?: string | false;
}

/** Built-in resolution strategy names. Use when `controllers` is a call and the primary path finds nothing. */
export type ResolutionStrategy = "nest";

/**
 * Options for the electron-ipc-bridge Vite plugin.
 */
export interface PluginOptions {
  /** Path to your main process entry file. @default "src/main/index.ts" */
  main?: string;
  /** Path to your preload entry file. @default "src/preload/index.ts" */
  preload?: string;
  /**
   * Optional resolution strategy when `controllers` is a call (e.g. getIpcControllers(app))
   * and the primary path finds no controllers. Set to `"nest"` for NestJS apps.
   */
  resolutionStrategy?: ResolutionStrategy;
  /** Output configuration for generated types. */
  types?: PluginTypesOptions;
}
