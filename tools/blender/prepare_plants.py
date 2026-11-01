"""Create normalized project-owned plant placeholders and web LOD candidates."""

from __future__ import annotations

import math

import bpy
from mathutils import Vector

from garden_common import (
    angle,
    assign,
    branch_between,
    collection,
    empty,
    leaf,
    mark_asset,
    material,
    move_to_collection,
    set_parent_keep_world,
    sphere,
)


PLANT_EXPORTS = {
    "PLANT_TULSI_LOD0": "plants/tulsi.glb",
    "PLANT_TULSI_LOD1": "plants/tulsi-lod1.glb",
    "PLANT_ALOE_LOD0": "plants/aloe-vera.glb",
    "PLANT_ALOE_LOD1": "plants/aloe-vera-lod1.glb",
    "PLANT_HIBISCUS_LOD0": "plants/hibiscus.glb",
    "PLANT_HIBISCUS_LOD1": "plants/hibiscus-lod1.glb",
}


def build_tulsi(lod: int) -> None:
    target = collection(f"PLANT_TULSI_LOD{lod}")
    stem_material = material("Bark", (0.19, 0.105, 0.045, 1.0), 0.95)
    leaf_material = material("Fresh leaves", (0.12, 0.38, 0.13, 1.0), 0.76)
    flower_material = material("Tulsi flowers", (0.47, 0.28, 0.48, 1.0), 0.7)
    root = empty("Plant_Tulsi", target)
    mark_asset(root, "interactive-plant", "tulsi", lod)

    stems = [
        ((0.0, 0.0, 0.0), (0.0, 0.0, 1.7)),
        ((0.0, 0.0, 0.55), (-0.55, 0.05, 1.35)),
        ((0.0, 0.0, 0.72), (0.5, -0.08, 1.5)),
        ((0.0, 0.0, 0.9), (0.15, 0.5, 1.65)),
    ]
    for index, (start, end) in enumerate(stems[: 2 if lod else 4]):
        branch_between(
            f"Tulsi_Stem_{index}",
            start,
            end,
            0.055,
            stem_material,
            target,
            root,
            vertices=7 if lod else 10,
        )

    leaves = [
        (-0.42, 0.02, 0.72, -0.25),
        (0.4, -0.04, 0.82, 0.25),
        (-0.55, 0.05, 1.18, -0.35),
        (0.5, -0.08, 1.28, 0.35),
        (-0.12, 0.42, 1.25, 1.0),
        (0.18, -0.38, 1.42, -1.0),
        (-0.24, 0.05, 1.58, -0.25),
        (0.22, -0.02, 1.64, 0.25),
    ]
    for index, (x, y, z, rotation) in enumerate(leaves[::2] if lod else leaves):
        leaf(
            f"Tulsi_Leaf_{index}",
            (x, y, z),
            (0.34, 0.16, 0.055),
            leaf_material,
            target,
            (0.2, 0.0, rotation),
            root,
            segments=7 if lod else 10,
            rings=4 if lod else 6,
        )

    for index, z in enumerate((1.78, 1.94) if lod else (1.76, 1.88, 2.0)):
        sphere(
            f"Tulsi_Flower_{index}",
            (0.0, 0.0, z),
            (0.1, 0.1, 0.09),
            flower_material,
            target,
            segments=6 if lod else 8,
            rings=4 if lod else 5,
            parent=root,
        )


def build_aloe(lod: int) -> None:
    target = collection(f"PLANT_ALOE_LOD{lod}")
    leaf_material = material("Aloe leaves", (0.17, 0.46, 0.24, 1.0), 0.62)
    edge_material = material("Aloe edge", (0.3, 0.57, 0.24, 1.0), 0.68)
    root = empty("Plant_Aloe", target)
    mark_asset(root, "interactive-plant", "aloe-vera", lod)
    leaf_count = 7 if lod else 12

    for index in range(leaf_count):
        blade_angle = angle(index, leaf_count)
        radius = 0.26 + (index % 3) * 0.05
        x = math.cos(blade_angle) * radius
        y = math.sin(blade_angle) * radius
        height = 0.95 + (index % 4) * 0.12
        bpy.ops.mesh.primitive_cone_add(
            vertices=5 if lod else 7,
            radius1=0.16,
            radius2=0.025,
            depth=height,
            location=(x, y, height / 2),
        )
        blade = bpy.context.object
        blade.name = f"Aloe_Leaf_{index}"
        blade.rotation_euler = (
            0.16 + 0.06 * (index % 2),
            math.cos(blade_angle) * 0.22,
            blade_angle,
        )
        assign(blade, leaf_material if index % 3 else edge_material)
        move_to_collection(blade, target)
        set_parent_keep_world(blade, root)


def build_hibiscus(lod: int) -> None:
    target = collection(f"PLANT_HIBISCUS_LOD{lod}")
    stem_material = material("Bark", (0.19, 0.105, 0.045, 1.0), 0.95)
    leaf_material = material("Deep leaves", (0.055, 0.24, 0.085, 1.0), 0.8)
    petal_material = material("Hibiscus petals", (0.58, 0.035, 0.055, 1.0), 0.54)
    center_material = material("Flower center", (0.95, 0.58, 0.08, 1.0), 0.6)
    root = empty("Plant_Hibiscus", target)
    mark_asset(root, "interactive-plant", "hibiscus", lod)

    branches = [
        ("Hibiscus_Stem", (0.0, 0.0, 0.0), (0.0, 0.0, 2.6), 0.1),
        ("Hibiscus_Branch_A", (0.0, 0.0, 1.0), (-0.7, 0.0, 2.0), 0.065),
        ("Hibiscus_Branch_B", (0.0, 0.0, 1.2), (0.7, 0.05, 2.2), 0.065),
    ]
    for name, start, end, radius in branches[: 2 if lod else 3]:
        branch_between(
            name,
            start,
            end,
            radius,
            stem_material,
            target,
            root,
            vertices=7 if lod else 10,
        )

    leaves = [
        (-0.55, 0.0, 1.45, -0.3),
        (0.55, 0.02, 1.65, 0.3),
        (-0.72, 0.0, 1.95, -0.55),
        (0.68, 0.04, 2.1, 0.55),
        (-0.2, 0.04, 2.35, -0.1),
    ]
    for index, (x, y, z, rotation) in enumerate(leaves[::2] if lod else leaves):
        leaf(
            f"Hibiscus_Leaf_{index}",
            (x, y, z),
            (0.42, 0.22, 0.06),
            leaf_material,
            target,
            (0.15, 0.0, rotation),
            root,
            segments=7 if lod else 10,
            rings=4 if lod else 6,
        )

    flower_origin = Vector((0.0, -0.06, 2.65))
    petal_count = 4 if lod else 6
    for index in range(petal_count):
        petal_angle = angle(index, petal_count)
        location = flower_origin + Vector(
            (
                math.cos(petal_angle) * 0.34,
                math.sin(petal_angle) * 0.12,
                math.sin(petal_angle) * 0.34,
            )
        )
        petal = sphere(
            f"Hibiscus_Petal_{index}",
            location,
            (0.38, 0.09, 0.24),
            petal_material,
            target,
            segments=8 if lod else 12,
            rings=5 if lod else 7,
            parent=root,
        )
        petal.rotation_euler = (petal_angle, 0.0, petal_angle)

    sphere(
        "Hibiscus_Flower_Center",
        flower_origin,
        (0.14, 0.14, 0.14),
        center_material,
        target,
        segments=7 if lod else 10,
        rings=4 if lod else 6,
        parent=root,
    )


def prepare_plants() -> None:
    for lod in (0, 1):
        build_tulsi(lod)
        build_aloe(lod)
        build_hibiscus(lod)
