import { existsSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const cliPath = path.join(
  projectRoot,
  "node_modules",
  "@gltf-transform",
  "cli",
  "bin",
  "cli.js",
);
const requestedTargets = process.argv.slice(2).filter((argument) => argument !== "--");
const targets = requestedTargets.length > 0 ? requestedTargets : ["public/models/garden"];

function collectGlbFiles(targetPath) {
  const absolutePath = path.resolve(projectRoot, targetPath);

  if (!existsSync(absolutePath)) {
    throw new Error(`Model target does not exist: ${targetPath}`);
  }

  if (statSync(absolutePath).isFile()) {
    return absolutePath.toLowerCase().endsWith(".glb") ? [absolutePath] : [];
  }

  return readdirSync(absolutePath, { withFileTypes: true }).flatMap((entry) => {
    const childPath = path.join(absolutePath, entry.name);
    if (entry.isDirectory()) return collectGlbFiles(childPath);
    return entry.isFile() && entry.name.toLowerCase().endsWith(".glb") ? [childPath] : [];
  });
}

if (!existsSync(cliPath)) {
  throw new Error("glTF Transform is not installed. Run pnpm install first.");
}

const models = [...new Set(targets.flatMap(collectGlbFiles))].sort();

if (models.length === 0) {
  throw new Error(`No GLB models found in: ${targets.join(", ")}`);
}

let failed = false;

for (const modelPath of models) {
  const relativePath = path.relative(projectRoot, modelPath);
  console.log(`\nValidating ${relativePath}`);
  const result = spawnSync(
    process.execPath,
    [cliPath, "validate", modelPath, "--limit", "8"],
    { cwd: projectRoot, stdio: "inherit" },
  );

  if (result.error) throw result.error;
  if (result.status !== 0) failed = true;
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log(`\nValidated ${models.length} garden model${models.length === 1 ? "" : "s"}.`);
}
