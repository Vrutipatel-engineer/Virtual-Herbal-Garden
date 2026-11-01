"""Generate the Phase 4 Step 1 Blender proof-of-concept garden.

Run with:
  blender --background --python tools/blender/create_poc_garden.py -- <output-directory>

The script deliberately uses procedural geometry and project-owned materials. These
assets validate the Blender-to-GLB pipeline; final botanical assets remain subject
to the separate approved 3D asset decision gate.
"""

from __future__ import annotations

import math
import os
import sys

import bpy
from mathutils import Vector


def output_directory() -> str:
    if "--" not in sys.argv:
        raise RuntimeError("Expected an output directory after --")
    target = os.path.abspath(sys.argv[sys.argv.index("--") + 1])
    os.makedirs(target, exist_ok=True)
    return target


def reset_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)


def material(name: str, color: tuple[float, float, float, float], roughness: float = 0.75):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = color
    mat.use_nodes = True
    principled = mat.node_tree.nodes.get("Principled BSDF")
    principled.inputs["Base Color"].default_value = color
    principled.inputs["Roughness"].default_value = roughness
    return mat


def assign(obj, mat) -> None:
    obj.data.materials.append(mat)


def set_parent_keep_world(obj, parent) -> None:
    if parent is None:
        return
    world_matrix = obj.matrix_world.copy()
    obj.parent = parent
    obj.matrix_world = world_matrix


def bevel(obj, width: float, segments: int = 2) -> None:
    modifier = obj.modifiers.new(name="Soft edges", type="BEVEL")
    modifier.width = width
    modifier.segments = segments
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=modifier.name)


def cube(name: str, location, scale, mat, rotation=(0.0, 0.0, 0.0), bevel_width=0.0, parent=None):
    bpy.ops.mesh.primitive_cube_add(location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel_width:
        bevel(obj, bevel_width)
    assign(obj, mat)
    set_parent_keep_world(obj, parent)
    return obj


def cylinder(name: str, location, radius: float, depth: float, mat, vertices=12, rotation=(0.0, 0.0, 0.0), parent=None):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    assign(obj, mat)
    set_parent_keep_world(obj, parent)
    return obj


def sphere(name: str, location, scale, mat, segments=16, rings=10, parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    assign(obj, mat)
    set_parent_keep_world(obj, parent)
    return obj


def empty(name: str, location=(0.0, 0.0, 0.0)):
    obj = bpy.data.objects.new(name, None)
    obj.empty_display_type = "PLAIN_AXES"
    obj.location = location
    bpy.context.collection.objects.link(obj)
    return obj


def branch_between(name: str, start, end, radius: float, mat, parent=None):
    start_v = Vector(start)
    end_v = Vector(end)
    delta = end_v - start_v
    midpoint = (start_v + end_v) / 2
    obj = cylinder(name, midpoint, radius, delta.length, mat, vertices=10, parent=parent)
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = delta.to_track_quat("Z", "Y")
    return obj


def leaf(name: str, location, scale, mat, rotation=(0.0, 0.0, 0.0), parent=None):
    obj = sphere(name, location, scale, mat, segments=10, rings=6, parent=parent)
    obj.rotation_euler = rotation
    return obj


def build_tree(bark, leaf_dark, leaf_light):
    root = empty("Tree_Neem", (-6.3, -1.8, 0.0))
    cylinder("Neem_Trunk", (-6.3, -1.8, 2.4), 0.48, 4.8, bark, vertices=14, parent=root)
    branch_between("Neem_Branch_A", (-6.3, -1.8, 3.1), (-7.9, -1.0, 5.0), 0.18, bark, root)
    branch_between("Neem_Branch_B", (-6.3, -1.8, 3.5), (-4.8, -2.6, 5.2), 0.2, bark, root)
    branch_between("Neem_Branch_C", (-6.3, -1.8, 3.7), (-6.2, -0.1, 5.5), 0.16, bark, root)
    canopy = empty("Tree_Canopy")
    set_parent_keep_world(canopy, root)
    clusters = [
        ((-7.7, -1.0, 5.2), (1.5, 1.2, 1.25), leaf_dark),
        ((-5.0, -2.5, 5.3), (1.6, 1.25, 1.35), leaf_light),
        ((-6.2, -0.3, 5.8), (1.7, 1.4, 1.25), leaf_dark),
        ((-6.3, -1.7, 6.2), (1.8, 1.5, 1.35), leaf_light),
        ((-7.4, -2.2, 5.8), (1.35, 1.1, 1.1), leaf_dark),
    ]
    for index, (location, scale, mat) in enumerate(clusters):
        sphere(f"Neem_Canopy_{index}", location, scale, mat, segments=14, rings=8, parent=canopy)


def build_tulsi(stem_mat, leaf_mat, flower_mat):
    root = empty("Plant_Tulsi", (-3.2, 4.0, 0.0))
    stems = [
        ((0.0, 0.0, 0.0), (0.0, 0.0, 1.7)),
        ((0.0, 0.0, 0.55), (-0.55, 0.05, 1.35)),
        ((0.0, 0.0, 0.72), (0.5, -0.08, 1.5)),
        ((0.0, 0.0, 0.9), (0.15, 0.5, 1.65)),
    ]
    for index, (start, end) in enumerate(stems):
        start_world = Vector(root.location) + Vector(start)
        end_world = Vector(root.location) + Vector(end)
        branch_between(f"Tulsi_Stem_{index}", start_world, end_world, 0.055, stem_mat, root)
    leaf_specs = [
        (-0.42, 0.02, 0.72, -0.25), (0.4, -0.04, 0.82, 0.25),
        (-0.55, 0.05, 1.18, -0.35), (0.5, -0.08, 1.28, 0.35),
        (-0.12, 0.42, 1.25, 1.0), (0.18, -0.38, 1.42, -1.0),
        (-0.24, 0.05, 1.58, -0.25), (0.22, -0.02, 1.64, 0.25),
    ]
    for index, (x, y, z, rz) in enumerate(leaf_specs):
        leaf(f"Tulsi_Leaf_{index}", root.location + Vector((x, y, z)), (0.34, 0.16, 0.055), leaf_mat, (0.2, 0.0, rz), root)
    for index, z in enumerate((1.76, 1.88, 2.0)):
        sphere(f"Tulsi_Flower_{index}", root.location + Vector((0.0, 0.0, z)), (0.1, 0.1, 0.09), flower_mat, segments=8, rings=5, parent=root)


def build_aloe(leaf_mat, edge_mat):
    root = empty("Plant_Aloe", (2.2, -5.5, 0.0))
    for index in range(12):
        angle = (math.tau / 12) * index
        radius = 0.26 + (index % 3) * 0.05
        x = root.location.x + math.cos(angle) * radius
        y = root.location.y + math.sin(angle) * radius
        height = 0.95 + (index % 4) * 0.12
        bpy.ops.mesh.primitive_cone_add(vertices=7, radius1=0.16, radius2=0.025, depth=height, location=(x, y, height / 2))
        blade = bpy.context.object
        blade.name = f"Aloe_Leaf_{index}"
        blade.rotation_euler = (0.16 + 0.06 * (index % 2), math.cos(angle) * 0.22, angle)
        assign(blade, leaf_mat if index % 3 else edge_mat)
        set_parent_keep_world(blade, root)


def build_hibiscus(stem_mat, leaf_mat, petal_mat, flower_center):
    root = empty("Plant_Hibiscus", (4.6, 6.0, 0.0))
    branch_between("Hibiscus_Stem", root.location, root.location + Vector((0.0, 0.0, 2.6)), 0.1, stem_mat, root)
    branch_between("Hibiscus_Branch_A", root.location + Vector((0.0, 0.0, 1.0)), root.location + Vector((-0.7, 0.0, 2.0)), 0.065, stem_mat, root)
    branch_between("Hibiscus_Branch_B", root.location + Vector((0.0, 0.0, 1.2)), root.location + Vector((0.7, 0.05, 2.2)), 0.065, stem_mat, root)
    leaves = [(-0.55, 0.0, 1.45, -0.3), (0.55, 0.02, 1.65, 0.3), (-0.72, 0.0, 1.95, -0.55), (0.68, 0.04, 2.1, 0.55), (-0.2, 0.04, 2.35, -0.1)]
    for index, (x, y, z, rz) in enumerate(leaves):
        leaf(f"Hibiscus_Leaf_{index}", root.location + Vector((x, y, z)), (0.42, 0.22, 0.06), leaf_mat, (0.15, 0.0, rz), root)
    flower_origin = root.location + Vector((0.0, -0.06, 2.65))
    for index in range(6):
        angle = (math.tau / 6) * index
        location = flower_origin + Vector((math.cos(angle) * 0.34, math.sin(angle) * 0.12, math.sin(angle) * 0.34))
        petal = sphere(f"Hibiscus_Petal_{index}", location, (0.38, 0.09, 0.24), petal_mat, segments=12, rings=7, parent=root)
        petal.rotation_euler = (angle, 0.0, angle)
    sphere("Hibiscus_Flower_Center", flower_origin, (0.14, 0.14, 0.14), flower_center, segments=10, rings=6, parent=root)


def build_scene() -> None:
    reset_scene()
    bpy.context.scene.unit_settings.system = "METRIC"

    soil = material("Soil", (0.16, 0.12, 0.065, 1.0), 0.96)
    moss = material("Moss grass", (0.16, 0.28, 0.105, 1.0), 0.92)
    path_mat = material("Warm stone path", (0.39, 0.31, 0.21, 1.0), 0.88)
    bark = material("Bark", (0.19, 0.105, 0.045, 1.0), 0.95)
    rock = material("Garden stone", (0.31, 0.34, 0.28, 1.0), 0.98)
    leaf_dark = material("Deep leaves", (0.055, 0.24, 0.085, 1.0), 0.8)
    leaf_mid = material("Fresh leaves", (0.12, 0.38, 0.13, 1.0), 0.76)
    leaf_light = material("Sunlit leaves", (0.28, 0.49, 0.16, 1.0), 0.74)
    tulsi_flower = material("Tulsi flowers", (0.47, 0.28, 0.48, 1.0), 0.7)
    aloe = material("Aloe leaves", (0.17, 0.46, 0.24, 1.0), 0.62)
    aloe_edge = material("Aloe edge", (0.3, 0.57, 0.24, 1.0), 0.68)
    hibiscus = material("Hibiscus petals", (0.58, 0.035, 0.055, 1.0), 0.54)
    flower_center = material("Flower center", (0.95, 0.58, 0.08, 1.0), 0.6)

    cube("Garden_Ground", (0.0, 0.0, -0.28), (12.5, 12.5, 0.28), soil, bevel_width=0.12)
    cube("Garden_Grass_Inset", (0.0, 0.0, 0.015), (11.9, 11.9, 0.025), moss, bevel_width=0.18)

    path_specs = [
        ((0.0, -8.3, 0.08), (1.65, 4.25, 0.06), -0.03),
        ((-0.55, -1.0, 0.08), (1.65, 3.35, 0.06), 0.16),
        ((0.45, 5.7, 0.08), (1.65, 3.7, 0.06), -0.12),
    ]
    for index, (location, scale, angle) in enumerate(path_specs):
        cube(f"Path_{index}", location, scale, path_mat, rotation=(0.0, 0.0, angle), bevel_width=0.3)

    for index, (x, y, size) in enumerate(((-8.5, 5.5, 0.7), (-8.9, 4.7, 0.45), (7.8, -4.5, 0.6), (8.6, -3.9, 0.4), (7.6, 8.0, 0.5))):
        sphere(f"Rock_{index}", (x, y, size * 0.55), (size, size * 0.72, size * 0.55), rock, segments=10, rings=6)

    for x in (-11.2, 11.2):
        for y in range(-10, 12, 3):
            cylinder(f"Fence_Post_{x}_{y}", (x, float(y), 0.55), 0.075, 1.1, bark, vertices=8)
    for y in (-11.2, 11.2):
        for x in range(-10, 12, 3):
            cylinder(f"Fence_Post_{x}_{y}", (float(x), y, 0.55), 0.075, 1.1, bark, vertices=8)

    build_tree(bark, leaf_dark, leaf_light)
    build_tulsi(bark, leaf_mid, tulsi_flower)
    build_aloe(aloe, aloe_edge)
    build_hibiscus(bark, leaf_dark, hibiscus, flower_center)

    # Ground markers make the three interactive specimens easy to locate during
    # the technical prototype and can be removed after the visual checkpoint.
    marker = material("Planting bed", (0.2, 0.15, 0.08, 1.0), 0.92)
    for index, (x, y, radius) in enumerate(((-3.2, 4.0, 0.9), (2.2, -5.5, 0.8), (4.6, 6.0, 1.0))):
        bpy.ops.mesh.primitive_cylinder_add(vertices=28, radius=radius, depth=0.12, location=(x, y, 0.08))
        bed = bpy.context.object
        bed.name = f"Planting_Bed_{index}"
        assign(bed, marker)


def main() -> None:
    target = output_directory()
    build_scene()
    blend_path = os.path.join(target, "phase4-poc-garden.blend")
    glb_path = os.path.join(target, "phase4-poc-garden.glb")
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    bpy.ops.export_scene.gltf(
        filepath=glb_path,
        export_format="GLB",
        export_cameras=False,
        export_lights=False,
        export_yup=True,
    )
    print(f"Created {blend_path}")
    print(f"Created {glb_path}")


if __name__ == "__main__":
    main()
