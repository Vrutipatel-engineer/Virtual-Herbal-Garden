"""Save the editable source and export validated-size modular GLB candidates."""

from __future__ import annotations

import hashlib
import json
import os
import shutil

import bpy

from prepare_plants import PLANT_EXPORTS


CORE_EXPORTS = {
    # Keep the terrain export versioned as well. A browser can memory-map an older
    # GLB while previewing it on Windows, which prevents Blender from overwriting it.
    "TERRAIN": "terrain-pbr-v2.glb",
    "PATHWAYS": "pathways.glb",
    "ENVIRONMENT": "environment.glb",
    "COLLIDERS": "colliders.glb",
}

# Export and runtime paths match. Versioning the actual source export avoids replacing a file
# that may be held open by an active local preview on Windows.
RUNTIME_EXPORT_OVERRIDES: dict[str, str] = {}


def select_collection_objects(collection_name: str) -> None:
    bpy.ops.object.select_all(action="DESELECT")
    target = bpy.data.collections.get(collection_name)
    if target is None:
        raise RuntimeError(f'Missing required collection "{collection_name}"')

    objects = list(target.all_objects)
    if not objects:
        raise RuntimeError(f'Collection "{collection_name}" is empty')

    for obj in objects:
        obj.hide_set(False)
        obj.select_set(True)

    bpy.context.view_layer.objects.active = next(
        (obj for obj in objects if obj.type == "MESH"),
        objects[0],
    )


def export_collection(collection_name: str, output_path: str) -> None:
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    select_collection_objects(collection_name)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format="GLB",
        use_selection=True,
        export_cameras=False,
        export_lights=False,
        export_yup=True,
        export_tangents=collection_name == "TERRAIN",
        export_extras=True,
        export_apply=True,
    )

    if not os.path.isfile(output_path) or os.path.getsize(output_path) == 0:
        raise RuntimeError(f"Blender did not create {output_path}")


def file_record(file_path: str, root: str, role: str) -> dict:
    with open(file_path, "rb") as model_file:
        digest = hashlib.sha256(model_file.read()).hexdigest()
    return {
        "path": os.path.relpath(file_path, root).replace(os.sep, "/"),
        "role": role,
        "bytes": os.path.getsize(file_path),
        "sha256": digest,
    }


def export_garden(workspace: str) -> list[dict]:
    source_directory = os.path.join(workspace, "assets-3d", "source")
    export_directory = os.path.join(workspace, "assets-3d", "exports")
    runtime_directory = os.path.join(workspace, "public", "models", "garden", "production")
    os.makedirs(source_directory, exist_ok=True)
    os.makedirs(export_directory, exist_ok=True)
    os.makedirs(runtime_directory, exist_ok=True)

    source_path = os.path.join(source_directory, "herbal-garden.blend")
    bpy.ops.wm.save_as_mainfile(filepath=source_path)

    export_map = {**CORE_EXPORTS, **PLANT_EXPORTS}
    records = []

    for collection_name, relative_path in export_map.items():
        export_path = os.path.join(export_directory, relative_path)
        runtime_relative_path = RUNTIME_EXPORT_OVERRIDES.get(relative_path, relative_path)
        runtime_path = os.path.join(runtime_directory, runtime_relative_path)
        export_collection(collection_name, export_path)
        os.makedirs(os.path.dirname(runtime_path), exist_ok=True)
        shutil.copy2(export_path, runtime_path)
        role = "plant" if relative_path.startswith("plants/") else collection_name.lower()
        records.append(file_record(export_path, workspace, role))

    manifest = {
        "schemaVersion": 1,
        "source": "project-generated scene with vetted free materials",
        "assetDecisionStatus": "CC0 environment source selected; botanical-model selection in progress",
        "thirdPartySources": [
            {
                "name": "Poly Haven Forest Ground 01",
                "license": "CC0",
                "sourceUrl": "https://polyhaven.com/a/forrest_ground_01",
                "use": "terrain PBR material source maps",
            }
        ],
        "coordinateSystem": "Blender Z-up; GLB export Y-up",
        "files": records,
    }
    manifest_path = os.path.join(export_directory, "manifest.json")
    runtime_manifest_path = os.path.join(runtime_directory, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as manifest_file:
        json.dump(manifest, manifest_file, indent=2)
        manifest_file.write("\n")
    shutil.copy2(manifest_path, runtime_manifest_path)

    return records
