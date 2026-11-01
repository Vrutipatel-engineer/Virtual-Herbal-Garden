import { existsSync, mkdirSync, statSync } from "node:fs";
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
const scriptArguments = process.argv.slice(2);
if (scriptArguments[0] === "--") scriptArguments.shift();
const [inputArgument, outputArgument] = scriptArguments;

if (!inputArgument || !outputArgument) {
  throw new Error(
    "Usage: pnpm optimize:model -- <input.glb> <output.glb>",
  );
}

const inputPath = path.resolve(projectRoot, inputArgument);
const outputPath = path.resolve(projectRoot, outputArgument);

if (!existsSync(cliPath)) {
  throw new Error("glTF Transform is not installed. Run pnpm install first.");
}

if (!existsSync(inputPath) || !statSync(inputPath).isFile()) {
  throw new Error(`Input model does not exist: ${inputArgument}`);
}

if (!inputPath.toLowerCase().endsWith(".glb") || !outputPath.toLowerCase().endsWith(".glb")) {
  throw new Error("The input and output must both be GLB files.");
}

if (inputPath === outputPath) {
  throw new Error("Refusing to overwrite the source model. Choose a separate output path.");
}

mkdirSync(path.dirname(outputPath), { recursive: true });

const optimization = spawnSync(
  process.execPath,
  [
    cliPath,
    "optimize",
    inputPath,
    outputPath,
    "--compress",
    "meshopt",
    "--flatten",
    "false",
    "--join",
    "false",
    "--instance",
    "false",
    "--palette",
    "false",
    "--simplify",
    "false",
    "--texture-compress",
    "webp",
  ],
  { cwd: projectRoot, stdio: "inherit" },
);

if (optimization.error) throw optimization.error;
if (optimization.status !== 0) process.exit(optimization.status ?? 1);

const validation = spawnSync(
  process.execPath,
  [cliPath, "validate", outputPath, "--limit", "20"],
  { cwd: projectRoot, stdio: "inherit" },
);

if (validation.error) throw validation.error;
if (validation.status !== 0) process.exit(validation.status ?? 1);

const inputSize = statSync(inputPath).size;
const outputSize = statSync(outputPath).size;
const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);

console.log(
  `\nOptimized ${path.relative(projectRoot, inputPath)} → ${path.relative(projectRoot, outputPath)}`,
);
console.log(`${inputSize.toLocaleString()} bytes → ${outputSize.toLocaleString()} bytes (${reduction}% smaller)`);
