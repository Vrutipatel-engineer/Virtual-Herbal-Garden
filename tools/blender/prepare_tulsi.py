"""Normalize the downloaded Tulsi source for the interactive garden hotspot.

The source includes a real cement planter. It is deliberately retained: it gives
the otherwise sparse plant an honest, grounded presentation and avoids replacing
it with the former procedural placeholder. The model is lifted so the planter's
base sits on the garden surface at world Y=0 after GLB export.
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


def minimum_height(meshes: list[bpy.types.Object]) -> float:
    return min(
        (mesh.matrix_world @ Vector(corner)).z
        for mesh in meshes
        for corner in mesh.bound_box
    )


def main() -> None:
    options = arguments()
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(options.source))
    # The source's actual botanical meshes are named Object_*. Blender can expose
    # a separate white helper cube from the original scene; never ship it.
    meshes = [
        object_
        for object_ in bpy.context.scene.objects
        if object_.type == "MESH" and object_.name.startswith("Object_")
    ]
    if not meshes:
        raise RuntimeError("The Tulsi source did not contain any mesh objects")

    root = bpy.data.objects.new("Plant_Tulsi", None)
    bpy.context.scene.collection.objects.link(root)
    root["garden_role"] = "interactive-plant"
    root["asset_id"] = "tulsi"
    root["source"] = "Tulsi Tree on a cement tub by Prakash.Chatterjee (CC BY)"
    root.location.z = -minimum_height(meshes)

    for mesh in meshes:
        world_matrix = mesh.matrix_world.copy()
        mesh.parent = root
        mesh.matrix_world = world_matrix

    bpy.ops.object.select_all(action="DESELECT")
    root.select_set(True)
    for mesh in meshes:
        mesh.select_set(True)
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
    print(f"Prepared {len(meshes)} Tulsi source meshes to {options.output}")


if __name__ == "__main__":
    main()
