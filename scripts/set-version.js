const fs = require("fs");
const path = require("path");

const v = process.env.VERSION;
if (!v) {
  console.error("VERSION env var is required");
  process.exit(1);
}

function findPackageJsons(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.name === "node_modules") continue;
    if (e.isDirectory()) findPackageJsons(full, list);
    else if (e.name === "package.json") list.push(full);
  }
  return list;
}

for (const p of findPackageJsons(".")) {
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  if ("version" in j) {
    j.version = v;
    fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
  }
}
