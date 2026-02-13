import { exec } from "child_process";
import * as esbuild from "esbuild";
import { promisify } from "util";

const execAsync = promisify(exec);

const commonConfig = {
  bundle: true,
  external: ["vite", "typescript"],
  minify: false,
  platform: "node",
  sourcemap: true,
  target: "node18",
};

async function build() {
  console.log("🚀 Starting build...");

  try {
    const start = Date.now();

    console.log("📦 Building plugin...");
    await esbuild.build({
      ...commonConfig,
      entryPoints: ["src/index.ts"],
      format: "esm",
      outfile: "dist/index.js",
    });

    console.log("📝 Generating types...");
    await execAsync("tsc -p tsconfig.build.json --emitDeclarationOnly");

    const end = Date.now();
    console.log(`✅ Build completed in ${(end - start) / 1000}s`);
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

build().catch(console.error);
