import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const generatorPath = path.join(projectRoot, "tools", "blender", "create_garden.py");
const validatorPath = path.join(projectRoot, "scripts", "validate-models.mjs");
const runtimeModelDirectory = path.join(
  projectRoot,
  "public",
  "models",
  "garden",
  "production",
);

const blenderCandidates = [
  process.env.BLENDER_PATH,
  "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe",
  "C:\\Program Files\\Blender Foundation\\Blender 5.1\\blender.exe",
  "C:\\Program Files\\Blender Foundation\\Blender 5.0\\blender.exe",
  "/Applications/Blender.app/Contents/MacOS/Blender",
  "blender",
].filter(Boolean);

const blenderExecutable = blenderCandidates.find(
  (candidate) => candidate === "blender" || existsSync(candidate),
);

if (!blenderExecutable) {
  throw new Error(
    "Blender was not found. Set BLENDER_PATH to the Blender executable and run the command again.",
  );
}

const build = spawnSync(
  blenderExecutable,
  [
    "--background",
    "--python-exit-code",
    "1",
    "--python",
    generatorPath,
    "--",
    "--workspace",
    projectRoot,
  ],
  { cwd: projectRoot, stdio: "inherit" },
);

if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);

const validation = spawnSync(
  process.execPath,
  [validatorPath, runtimeModelDirectory],
  { cwd: projectRoot, stdio: "inherit" },
);

if (validation.error) throw validation.error;
if (validation.status !== 0) process.exit(validation.status ?? 1);

console.log("\nGarden source, modular exports, runtime copies, and GLB validation are complete.");
