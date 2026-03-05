import { readFileSync } from "node:fs";

const expectedPeerRanges = new Map([
  [
    "packages/core/package.json",
    {
      electron: ">=28.0.0",
      "reflect-metadata": "^0.2.2",
    },
  ],
  [
    "packages/vite-plugin/package.json",
    {
      typescript: "^5.0.0",
      vite: "^5.0.0 || ^6.0.0 || ^7.0.0",
    },
  ],
]);

const failures = [];

for (const [filePath, expectedPeers] of expectedPeerRanges.entries()) {
  const packageJson = JSON.parse(readFileSync(filePath, "utf8"));
  const actualPeers = packageJson.peerDependencies ?? {};

  for (const [dependencyName, expectedRange] of Object.entries(expectedPeers)) {
    const actualRange = actualPeers[dependencyName];

    if (actualRange !== expectedRange) {
      failures.push(
        `${filePath}: peerDependencies.${dependencyName} expected "${expectedRange}" but found "${actualRange ?? "<missing>"}"`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error("Peer dependency contract check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Peer dependency contract check passed.");
