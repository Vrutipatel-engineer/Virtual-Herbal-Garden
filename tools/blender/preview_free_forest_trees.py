"""Render a quick review row for the seven extracted forest-pack trees."""

from __future__ import annotations

import os
import sys

import bpy
from mathutils import Vector


SLUGS = ("apple", "ash", "cherry", "holly", "birch", "maple", "oak")


def main() -> None:
    args = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    if len(args) != 3:
        raise RuntimeError("Expected: -- <model-directory> <preview.png> <labels.txt>")
    model_dir, preview_path, labels_path = map(os.path.abspath, args)
    labels = []

    for index, slug in enumerate(SLUGS):
        bpy.ops.import_scene.gltf(filepath=os.path.join(model_dir, f"forest-{slug}-tree-v1.glb"))
        imported = [obj for obj in bpy.context.selected_objects if obj.type == "MESH"]
        if not imported:
            raise RuntimeError(f"No geometry imported for {slug}")
        center_x = (index - 3) * 5.7
        for obj in imported:
            obj.location.x += center_x
        labels.append(slug.title())

    bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, -0.03))
    bpy.ops.object.light_add(type="AREA", location=(0, -8, 18))
    bpy.context.object.data.energy = 3200
    bpy.context.object.data.size = 12
    bpy.ops.object.light_add(type="AREA", location=(-10, 1, 9))
    bpy.context.object.data.energy = 1800
    bpy.context.object.data.size = 10

    bpy.ops.object.camera_add(location=(0, -24, 11))
    camera = bpy.context.object
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 44
    camera.rotation_euler = (Vector((0, 0, 2.2)) - camera.location).to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = camera

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1400
    scene.render.resolution_y = 800
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = preview_path
    scene.world.color = (0.55, 0.55, 0.55)
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "Medium High Contrast"
    os.makedirs(os.path.dirname(preview_path), exist_ok=True)
    bpy.ops.render.render(write_still=True)
    with open(labels_path, "w", encoding="utf-8") as label_file:
        label_file.write(", ".join(labels))


if __name__ == "__main__":
    main()
