import crypto from "crypto";
import fs from "fs";
import path from "path";

import pkg from "../package.json" with { type: "json" };

import { generateTypes } from "./generator/generate-types.js";
import { hashControllerMetadata } from "./hash-metadata.js";
import { findControllers } from "./parser/find-controllers.js";
import { PluginState } from "./plugin-state.js";
import { resolveApiRootFromPreload } from "./preload/resolve-api-root.js";

/**
 * Options for the electron-ipc-controller Vite plugin.
 */
export interface PluginOptions {
  /** Path to your main process entry file. @default "src/main/index.ts" */
  main?: string;
  /** Output path for generated type definitions. @default "src/ipc.d.ts" */
  output?: string;
  /** Path to your preload entry file. @default "src/preload/index.ts" */
  preload?: string;
}
export interface ElectronIpcControllerPlugin {
  buildStart?(): void | Promise<void>;
  configResolved?(config: { root: string }): void | Promise<void>;
  name: string;
  transform?(code: string, id: string): null | Promise<null>;
}

/**
 * Creates a Vite plugin that generates TypeScript type definitions
 * for your IPC controllers, enabling type-safe `window` usage in the renderer.
 *
 * @param options - Plugin configuration
 * @returns Vite plugin instance
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { electronIpcController } from "@electron-ipc-controller/vite-plugin";
 *
 * export default defineConfig({
 *   plugins: [electronIpcController(options)],
 * });
 * ```
 */
export function electronIpcController({
  main = "src/main/index.ts",
  output = "src/ipc.d.ts",
  preload = "src/preload/index.ts",
}: PluginOptions = {}): ElectronIpcControllerPlugin {
  const normalizePath = (p: string) => p.replace(/\\/g, "/");

  let root = process.cwd();
  const state = new PluginState();

  const generate = () => {
    try {
      const preloadPath = path.resolve(root, preload);
      const resolvedApiRoot = resolveApiRootFromPreload(preloadPath);
      const entryPath = path.resolve(root, main);
      if (!fs.existsSync(entryPath)) {
        console.warn(`[${pkg.name}] Main entry not found at: ${entryPath}`);
        return;
      }

      console.log(`[${pkg.name}] Generating IPC types from ${entryPath}...`);
      const { controllers, processedFiles } = findControllers(entryPath);
      if (controllers.length === 0) {
        console.warn(`[${pkg.name}] No createIpcApp() call found in ${entryPath}; generated types will be empty.`);
      }

      const metadataHash = hashControllerMetadata(controllers);
      const absOutput = path.resolve(root, output);
      if (!state.updateMetadataHash(metadataHash)) return;

      state.setControllerFiles(new Set([...processedFiles].map(normalizePath)));

      const typeDef = generateTypes(controllers, resolvedApiRoot);

      const hash = crypto.createHash("md5").update(typeDef).digest("hex");
      if (!state.updateHash(hash)) return;

      fs.mkdirSync(path.dirname(absOutput), { recursive: true });
      fs.writeFileSync(absOutput, typeDef);
      console.log(`[${pkg.name}] Types generated at ${output}`);
    } catch (err) {
      console.error(`[${pkg.name}] Type generation failed:`, err);
    }
  };

  return {
    buildStart() {
      if (state.claimInitialGeneration()) {
        generate();
      }
    },
    configResolved(config) {
      root = config.root;
    },
    name: "electron-ipc-controller",
    transform(_code, id) {
      if (id.includes("node_modules") || id.endsWith(".d.ts")) return null;

      const absId = normalizePath(path.resolve(id));
      const mainEntryPath = normalizePath(path.resolve(root, main));

      if (state.shouldRegenerate(absId, mainEntryPath)) {
        state.scheduleGenerate(generate);
      }
      return null;
    },
  };
}
