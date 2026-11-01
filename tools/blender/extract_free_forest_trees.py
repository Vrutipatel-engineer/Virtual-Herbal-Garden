"""Extract a few reviewed trees from the already-downloaded CC-BY forest pack."""

from __future__ import annotations

import os
import sys

import bpy
from mathutils import Matrix, Vector


TREES = (
    ("apple", "AppleTree", ("Object_4", "Object_5"), 3.8),
    ("ash", "AshTree", ("Object_7", "Object_8"), 4.2),
    ("cherry", "CherryTree", ("Object_10", "Object_11"), 3.5),
    ("holly", "HollyShrub", ("Object_16", "Object_17"), 2.6),
    ("birch", "BirchTree", ("Object_55", "Object_56"), 4.8),
    ("maple", "MapleTree", ("Object_67", "Object_68"), 4.8),
    ("oak", "OakTree", ("Object_70", "Object_71"), 5.0),
)


def parse_args() -> tuple[str, str]:
    args = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    if len(args) != 2:
        raise RuntimeError("Expected: -- <source-forest-pack.glb> <output-directory>")
    return os.path.abspath(args[0]), os.path.abspath(args[1])


def normalize(obj: bpy.types.Object, target_height: float) -> None:
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    corners = [Vector(point) for point in obj.bound_box]
    center_x = sum(point.x for point in corners) / len(corners)
    center_y = sum(point.y for point in corners) / len(corners)
    minimum_z = min(point.z for point in corners)
    height = max(point.z for point in corners) - minimum_z
    if height <= 0:
        raise RuntimeError(f"{obj.name} has invalid bounds")
    obj.data.transform(Matrix.Translation((-center_x, -center_y, -minimum_z)))
    scale = target_height / height
    obj.data.transform(Matrix.Diagonal((scale, scale, scale, 1)))
    obj.matrix_world = Matrix.Identity(4)
    obj.name = obj.name.split(".")[0]
    obj.data.name = obj.name + "Mesh"
    obj["garden_role"] = "decorative-tree"
    obj["source"] = "Various Forest Assets Pack by Dari (CC BY)"


def main() -> None:
    source_path, output_directory = parse_args()
    os.makedirs(output_directory, exist_ok=True)
    bpy.ops.import_scene.gltf(filepath=source_path)
    source_objects = {obj.name: obj for obj in bpy.context.scene.objects if obj.type == "MESH"}

    for slug, node_name, object_names, target_height in TREES:
        missing = [name for name in object_names if name not in source_objects]
        if missing:
            raise RuntimeError(f"Missing source meshes for {slug}: {missing}")

        bpy.ops.object.select_all(action="DESELECT")
        for name in object_names:
            source_objects[name].select_set(True)
        bpy.context.view_layer.objects.active = source_objects[object_names[0]]
        bpy.ops.object.duplicate(linked=False)
        copies = [obj for obj in bpy.context.selected_objects if obj.type == "MESH"]
        for obj in copies:
            bpy.context.view_layer.objects.active = obj
            bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        bpy.ops.object.select_all(action="DESELECT")
        for obj in copies:
            obj.select_set(True)
        bpy.context.view_layer.objects.active = copies[0]
        if len(copies) > 1:
            bpy.ops.object.join()
        tree = bpy.context.object
        tree.name = node_name
        normalize(tree, target_height)

        output_path = os.path.join(output_directory, f"forest-{slug}-tree-v1.glb")
        bpy.ops.object.select_all(action="DESELECT")
        tree.select_set(True)
        bpy.context.view_layer.objects.active = tree
        bpy.ops.export_scene.gltf(
            filepath=output_path,
            export_format="GLB",
            use_selection=True,
            export_yup=True,
            export_extras=True,
            export_apply=True,
            export_cameras=False,
            export_lights=False,
        )
        print(f"Extracted {slug}: {target_height:.1f}m, {output_path}")
        bpy.data.objects.remove(tree, do_unlink=True)


if __name__ == "__main__":
    main()
