"""Create a repeatable technical and visual inspection report for an imported GLB source."""

from __future__ import annotations

import argparse
import json
import math
import os
import sys

import bpy
from mathutils import Vector


def arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--report", required=True)
    parser.add_argument("--preview")
    blender_arguments = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    return parser.parse_args(blender_arguments)


def reset_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)


def bounds(mesh_objects: list[bpy.types.Object]) -> tuple[Vector, Vector]:
    corners = [obj.matrix_world @ Vector(corner) for obj in mesh_objects for corner in obj.bound_box]
    return (
        Vector((min(corner.x for corner in corners), min(corner.y for corner in corners), min(corner.z for corner in corners))),
        Vector((max(corner.x for corner in corners), max(corner.y for corner in corners), max(corner.z for corner in corners))),
    )


def look_at(obj: bpy.types.Object, target: Vector) -> None:
    obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()


def render_preview(mesh_objects: list[bpy.types.Object], output_path: str) -> None:
    minimum, maximum = bounds(mesh_objects)
    center = (minimum + maximum) / 2
    span = maximum - minimum
    radius = max(span.x, span.y, span.z, 0.1)

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1000
    scene.render.resolution_y = 1000
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = output_path
    scene.world.color = (0.025, 0.038, 0.03)

    bpy.ops.object.camera_add(location=center + Vector((radius * 1.55, -radius * 1.9, radius * 1.15)))
    camera = bpy.context.object
    look_at(camera, center + Vector((0, 0, span.z * 0.05)))
    scene.camera = camera
    camera.data.lens = 52

    for location, energy, size in (
        (center + Vector((radius, -radius, radius * 1.8)), 1500, radius),
        (center + Vector((-radius, -radius * 0.4, radius)), 900, radius * 0.8),
    ):
        bpy.ops.object.light_add(type="AREA", location=location)
        light = bpy.context.object
        light.data.energy = energy
        light.data.shape = "DISK"
        light.data.size = size
        look_at(light, center)

    bpy.ops.mesh.primitive_plane_add(size=radius * 5, location=(center.x, center.y, minimum.z - 0.004))
    plane = bpy.context.object
    plane_material = bpy.data.materials.new("Inspection backdrop")
    plane_material.diffuse_color = (0.08, 0.11, 0.085, 1)
    plane.data.materials.append(plane_material)
    bpy.ops.wm.save_as_mainfile(filepath=output_path.replace(".png", ".blend"))
    bpy.ops.render.render(write_still=True)


def main() -> None:
    options = arguments()
    source_path = os.path.abspath(options.source)
    reset_scene()
    bpy.ops.import_scene.gltf(filepath=source_path)
    mesh_objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    minimum, maximum = bounds(mesh_objects)
    material_names = sorted({slot.material.name for obj in mesh_objects for slot in obj.material_slots if slot.material})
    def object_record(obj: bpy.types.Object) -> dict:
        object_minimum, object_maximum = bounds([obj])
        return {
            "name": obj.name,
            "vertices": len(obj.data.vertices),
            "polygons": len(obj.data.polygons),
            "materials": [slot.material.name for slot in obj.material_slots if slot.material],
            "bounds": {
                "min": list(object_minimum),
                "max": list(object_maximum),
                "dimensions": list(object_maximum - object_minimum),
            },
        }

    report = {
        "source": source_path,
        "meshObjectCount": len(mesh_objects),
        "meshObjects": [object_record(obj) for obj in mesh_objects],
        "materials": material_names,
        "bounds": {"min": list(minimum), "max": list(maximum), "dimensions": list(maximum - minimum)},
    }
    os.makedirs(os.path.dirname(options.report), exist_ok=True)
    with open(options.report, "w", encoding="utf-8") as report_file:
        json.dump(report, report_file, indent=2)
        report_file.write("\n")
    if options.preview:
        os.makedirs(os.path.dirname(options.preview), exist_ok=True)
        render_preview(mesh_objects, os.path.abspath(options.preview))
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
