"""Extract the centred Aloe plant from its photogrammetry garden-patch source.

The selected bimage source contains a large soil slab and an off-centre duplicate
in addition to the hero Aloe cluster. Only the origin-centred 37 mesh pieces are
kept for the browser plant asset.
"""

from __future__ import annotations

import argparse
import os
import sys

import bpy
from mathutils import Vector


def arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--output", required=True)
    blender_arguments = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    return parser.parse_args(blender_arguments)


def object_center_y(obj: bpy.types.Object) -> float:
    corners = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    return sum(corner.y for corner in corners) / len(corners)


def main() -> None:
    options = arguments()
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(options.source))
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]

    # The slab is the only non-BASE_01 mesh. The three y≈-2.6 duplicates are
    # intentionally excluded; the centred cluster spans y≈-0.7 to 0.3.
    kept = [
        obj
        for obj in meshes
        if obj.active_material and obj.active_material.name == "BASE_01" and object_center_y(obj) > -1.5
    ]
    if len(kept) < 20:
        raise RuntimeError(f"Unexpected Aloe extraction set: found {len(kept)} mesh pieces")

    for obj in meshes:
        obj.select_set(obj in kept)
    bpy.context.view_layer.objects.active = kept[0]

    root = bpy.data.objects.new("Plant_Aloe", None)
    bpy.context.scene.collection.objects.link(root)
    root["garden_role"] = "interactive-plant"
    root["asset_id"] = "aloe-vera"
    root["source"] = "N031 Aloe Vera — Free version by bimage (CC BY)"
    root.scale = (0.55, 0.55, 0.55)
    for obj in kept:
        world_matrix = obj.matrix_world.copy()
        obj.parent = root
        obj.matrix_world = world_matrix

    bpy.ops.object.select_all(action="DESELECT")
    root.select_set(True)
    for obj in kept:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = root
    os.makedirs(os.path.dirname(os.path.abspath(options.output)), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=os.path.abspath(options.output),
        export_format="GLB",
        use_selection=True,
        export_yup=True,
        export_cameras=False,
        export_lights=False,
        export_extras=True,
        export_apply=True,
    )
    print(f"Extracted {len(kept)} Aloe mesh pieces to {options.output}")


if __name__ == "__main__":
    main()
