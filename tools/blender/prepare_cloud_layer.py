"""Create one image-backed transparent cloud card as a browser GLB source.

Run with Blender:
  blender --background --python tools/blender/prepare_cloud_layer.py -- \
    --source <cloud.png> --output <cloud-layer.glb> --name <layer-name>
"""

from __future__ import annotations

import argparse
from array import array
import math
import os
import sys

import bpy


def arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--name", required=True)
    blender_arguments = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    return parser.parse_args(blender_arguments)


def main() -> None:
    options = arguments()
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)

    source_image = bpy.data.images.load(os.path.abspath(options.source), check_existing=True)
    width, height = source_image.size
    aspect = width / max(height, 1)
    content_height = max(1, min(256, round(512 / aspect)))
    source_image.scale(512, content_height)
    source_pixels = array("f", source_image.pixels[:])
    padded_pixels = array("f", [0.0]) * (512 * 256 * 4)
    vertical_offset = (256 - content_height) // 2
    row_length = 512 * 4
    for row in range(content_height):
        source_start = row * row_length
        target_start = (vertical_offset + row) * row_length
        padded_pixels[target_start : target_start + row_length] = source_pixels[
            source_start : source_start + row_length
        ]
    image = bpy.data.images.new(f"{options.name} power-of-two alpha", width=512, height=256, alpha=True)
    image.pixels.foreach_set(padded_pixels)
    source_texture_path = os.path.splitext(os.path.abspath(options.output))[0] + ".png"
    image.filepath_raw = source_texture_path
    image.file_format = "PNG"
    image.save()

    bpy.ops.mesh.primitive_plane_add(size=2)
    cloud = bpy.context.object
    cloud.name = options.name
    cloud.rotation_euler.x = math.pi / 2
    cloud.scale = (1, 0.5, 1)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)

    material = bpy.data.materials.new(f"{options.name} photographic alpha")
    material.use_nodes = True
    material.diffuse_color = (1, 1, 1, 0.8)
    material.use_backface_culling = False
    if hasattr(material, "surface_render_method"):
        material.surface_render_method = "BLENDED"
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    shader = nodes.get("Principled BSDF")
    texture = nodes.new("ShaderNodeTexImage")
    texture.image = image
    links.new(texture.outputs["Color"], shader.inputs["Base Color"])
    links.new(texture.outputs["Alpha"], shader.inputs["Alpha"])
    shader.inputs["Roughness"].default_value = 1
    cloud.data.materials.append(material)

    os.makedirs(os.path.dirname(os.path.abspath(options.output)), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=os.path.abspath(options.output),
        export_format="GLB",
        export_materials="EXPORT",
        export_image_format="AUTO",
        export_apply=True,
        export_yup=True,
    )
    print(f"Exported transparent cloud layer: {options.output}")


if __name__ == "__main__":
    main()
