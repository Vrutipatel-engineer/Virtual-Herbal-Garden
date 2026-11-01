"""Extract one reviewed, genuine grass clump from the downloaded Plants Asset Set."""

from __future__ import annotations

import argparse
import os
import sys

import bpy
from mathutils import Matrix, Vector


def arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--object", default="Object_5")
    blender_arguments = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    return parser.parse_args(blender_arguments)


def main() -> None:
    options = arguments()
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(options.source))
    source = bpy.data.objects.get(options.object)
    if source is None or source.type != "MESH":
        available = ", ".join(object_.name for object_ in bpy.context.scene.objects if object_.type == "MESH")
        raise RuntimeError(f"Ground cover object '{options.object}' was not found. Available: {available}")

    corners = [Vector(corner) for corner in source.bound_box]
    center_x = sum(corner.x for corner in corners) / len(corners)
    center_y = sum(corner.y for corner in corners) / len(corners)
    minimum_z = min(corner.z for corner in corners)
    # Pack objects have their showcase location baked into their mesh data. Make
    # a centred, metre-scale derivative so it can be instanced in the garden.
    source.data.transform(Matrix.Translation((-center_x, -center_y, -minimum_z)))
    source.data.transform(Matrix.Diagonal((0.01, 0.01, 0.01, 1)))
    source.matrix_world = Matrix.Identity(4)
    source.name = "GroundCover_GrassClump"
    source["garden_role"] = "ground-cover"
    source["source"] = "Plants Asset Set by Em Marshall (CC BY)"

    bpy.ops.object.select_all(action="DESELECT")
    source.select_set(True)
    bpy.context.view_layer.objects.active = source
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
    print(f"Extracted {options.object} to {options.output}")


if __name__ == "__main__":
    main()
