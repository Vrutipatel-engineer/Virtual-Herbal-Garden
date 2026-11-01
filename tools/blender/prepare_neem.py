"""Normalize a high-detail Neem source into one browser-ready decorative tree."""

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


def main() -> None:
    options = arguments()
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(options.source))
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if not meshes:
        raise RuntimeError("The Neem source did not contain any mesh objects")

    bpy.ops.object.select_all(action="DESELECT")
    for mesh in meshes:
        mesh.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.join()
    tree = bpy.context.object
    tree.name = "Neem_Tree"
    tree["garden_role"] = "decoration"
    tree["asset_id"] = "neem-tree"
    tree["source"] = "Neem Tree by Rohit Pawar (CC BY)"
    # Source uses centimetre-scale coordinates; normalise it to metres.
    tree.scale = (0.01, 0.01, 0.01)
    bpy.context.view_layer.objects.active = tree
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    minimum_z = min(
        (tree.matrix_world @ Vector(corner)).z
        for corner in tree.bound_box
    )
    # Ground the imported tree after normalising its centimetre-scale source.
    tree.location.z = -minimum_z

    bpy.ops.object.select_all(action="DESELECT")
    tree.select_set(True)
    bpy.context.view_layer.objects.active = tree
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
    print(f"Prepared Neem tree from {len(meshes)} source mesh objects")


if __name__ == "__main__":
    main()
