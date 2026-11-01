"""Create a labelled contact sheet for a multi-object GLB asset pack.

Each mesh is copied, re-centred and scaled into a small review cell. This lets us
select a genuine downloaded ground-cover object before exporting anything to the
browser; the source pack itself is never placed wholesale in the garden.
"""

from __future__ import annotations

import argparse
import math
import os
import sys

import bpy
from mathutils import Matrix, Vector


def arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--output", required=True)
    blender_arguments = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    return parser.parse_args(blender_arguments)


def bounds(object_: bpy.types.Object) -> tuple[Vector, Vector]:
    corners = [object_.matrix_world @ Vector(corner) for corner in object_.bound_box]
    return (
        Vector((min(corner.x for corner in corners), min(corner.y for corner in corners), min(corner.z for corner in corners))),
        Vector((max(corner.x for corner in corners), max(corner.y for corner in corners), max(corner.z for corner in corners))),
    )


def main() -> None:
    options = arguments()
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(options.source))
    source_meshes = [object_ for object_ in bpy.context.scene.objects if object_.type == "MESH"]
    if not source_meshes:
        raise RuntimeError("No mesh objects found")

    for object_ in list(bpy.context.scene.objects):
        if object_.type != "MESH":
            bpy.data.objects.remove(object_, do_unlink=True)

    columns = 4
    cell_size = 3.4
    for index, source in enumerate(source_meshes):
        lower, upper = bounds(source)
        dimensions = upper - lower
        largest = max(dimensions.x, dimensions.y, dimensions.z, 0.001)
        column = index % columns
        row = index // columns
        duplicate = source.copy()
        duplicate.data = source.data.copy()
        bpy.context.collection.objects.link(duplicate)
        source.hide_render = True
        scale = 2.1 / largest
        # Source asset packs often have their mesh coordinates baked at their
        # showcase position. Transform the copied geometry itself, rather than
        # merely moving its object origin, for a true per-object preview.
        duplicate.data.transform(Matrix.Translation(-(lower + upper) / 2))
        duplicate.data.transform(Matrix.Diagonal((scale, scale, scale, 1)))
        duplicate.location = (column * cell_size, -row * cell_size, 0)

        bpy.ops.object.text_add(location=(column * cell_size, -row * cell_size - 1.25, 0.02))
        label = bpy.context.object
        label.data.body = source.name.replace("Object_", "#")
        label.data.align_x = "CENTER"
        label.data.size = 0.3

    bpy.ops.mesh.primitive_plane_add(size=40, location=(4.8, -5.2, -0.03))
    ground = bpy.context.object
    ground.name = "Review ground"
    material = bpy.data.materials.new("Review ground material")
    material.diffuse_color = (0.08, 0.1, 0.08, 1)
    ground.data.materials.append(material)

    bpy.ops.object.light_add(type="AREA", location=(4, -2, 11))
    bpy.context.object.data.energy = 1500
    bpy.context.object.data.shape = "DISK"
    bpy.context.object.data.size = 9
    bpy.ops.object.light_add(type="AREA", location=(-5, -10, 5))
    bpy.context.object.data.energy = 700
    bpy.context.object.data.size = 7

    bpy.ops.object.camera_add(location=(4.8, -5.2, 15))
    camera = bpy.context.object
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 14.6
    camera.rotation_euler = (0, 0, 0)
    camera.rotation_euler[0] = 0
    camera.rotation_euler[1] = 0
    camera.rotation_euler[2] = 0
    camera.rotation_mode = "QUATERNION"
    camera.rotation_quaternion = Vector((0, 0, -1)).to_track_quat("-Z", "Y")
    bpy.context.scene.camera = camera

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1400
    scene.render.resolution_y = 1200
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = os.path.abspath(options.output)
    scene.world.color = (0.035, 0.04, 0.035)
    bpy.ops.render.render(write_still=True)
    print(f"Rendered {len(source_meshes)} object previews to {options.output}")


if __name__ == "__main__":
    main()
