"""Realign the saved Aloe planting bed and refresh the pathways GLB exports."""

from __future__ import annotations

import hashlib
import json
import os
import sys

import bpy

sys.path.insert(0, os.path.dirname(__file__))
from export_glb import export_collection


def main() -> None:
    workspace = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    source_path = os.path.join(workspace, "assets-3d", "source", "herbal-garden.blend")
    bpy.ops.wm.open_mainfile(filepath=source_path)

    bed = bpy.data.objects.get("Planting_Bed_1")
    if bed is None:
        raise RuntimeError("Could not find Planting_Bed_1 in the garden source scene")
    bed.location.x = 3.0
    bpy.ops.wm.save_as_mainfile(filepath=source_path)

    export_paths = [
        os.path.join(workspace, "assets-3d", "exports", "pathways.glb"),
        os.path.join(workspace, "public", "models", "garden", "production", "pathways.glb"),
    ]
    for output_path in export_paths:
        export_collection("PATHWAYS", output_path)

    for manifest_path in (
        os.path.join(workspace, "assets-3d", "exports", "manifest.json"),
        os.path.join(workspace, "public", "models", "garden", "production", "manifest.json"),
    ):
        with open(manifest_path, encoding="utf-8") as manifest_file:
            manifest = json.load(manifest_file)
        rel_path = "assets-3d/exports/pathways.glb"
        model_path = os.path.join(workspace, *rel_path.split("/"))
        with open(model_path, "rb") as model_file:
            digest = hashlib.sha256(model_file.read()).hexdigest()
        record = next(item for item in manifest["files"] if item["path"] == rel_path)
        record["bytes"] = os.path.getsize(model_path)
        record["sha256"] = digest
        with open(manifest_path, "w", encoding="utf-8") as manifest_file:
            json.dump(manifest, manifest_file, indent=2)
            manifest_file.write("\n")

    print("Aligned Planting_Bed_1 at Blender coordinates (3.0, -5.5) and refreshed pathways exports.")


if __name__ == "__main__":
    main()
