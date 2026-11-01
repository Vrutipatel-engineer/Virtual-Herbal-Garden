"""Build terrain, pathways, and project-owned environmental placeholders."""

from __future__ import annotations

import math

import bpy

from garden_common import (
    assign,
    branch_between,
    collection,
    cube,
    cylinder,
    empty,
    mark_asset,
    material,
    move_to_collection,
    pbr_texture_material,
    set_parent_keep_world,
    sphere,
)


def build_terrain(texture_directory: str | None = None) -> None:
    target = collection("TERRAIN")
    soil = material("Soil", (0.16, 0.12, 0.065, 1.0), 0.96)
    moss = material("Moss grass", (0.16, 0.28, 0.105, 1.0), 0.92)
    terrain_material = moss
    if texture_directory:
        terrain_material = pbr_texture_material(
            "Poly Haven Forest Ground 01 (CC0)",
            f"{texture_directory}/forrest_ground_01_diff_1k.png",
            f"{texture_directory}/forrest_ground_01_nor_gl_1k.jpg",
            f"{texture_directory}/forrest_ground_01_rough_ao_1k.jpg",
            texture_scale=3.4,
        )

    cube(
        "Terrain_Soil_Base",
        # Keep the structural base below the textured terrain surface. The previous
        # co-planar placement caused z-fighting, exposing the plain brown material.
        (0.0, 0.0, -0.37),
        (12.5, 12.5, 0.3),
        soil,
        target,
        bevel_width=0.12,
    )

    grid_size = 16
    half_extent = 11.9
    vertices = []
    faces = []
    for row in range(grid_size + 1):
        y = -half_extent + (row / grid_size) * half_extent * 2
        for column in range(grid_size + 1):
            x = -half_extent + (column / grid_size) * half_extent * 2
            edge = max(abs(x), abs(y)) / half_extent
            height = math.sin(x * 0.33) * math.cos(y * 0.29) * 0.035 * edge
            vertices.append((x, y, height))

    for row in range(grid_size):
        for column in range(grid_size):
            start = row * (grid_size + 1) + column
            faces.append(
                (
                    start,
                    start + 1,
                    start + grid_size + 2,
                    start + grid_size + 1,
                )
            )

    mesh = bpy.data.meshes.new("Terrain_Surface_Mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    uv_layer = mesh.uv_layers.new(name="GardenUV")
    for polygon in mesh.polygons:
        for loop_index in polygon.loop_indices:
            vertex = mesh.vertices[mesh.loops[loop_index].vertex_index].co
            uv_layer.data[loop_index].uv = (
                (vertex.x + half_extent) / (half_extent * 2),
                (vertex.y + half_extent) / (half_extent * 2),
            )
    mesh.calc_tangents(uvmap="GardenUV")
    surface = bpy.data.objects.new("Terrain_Grass_Surface", mesh)
    target.objects.link(surface)
    assign(surface, terrain_material)
    surface["asset_source"] = "Poly Haven Forest Ground 01 (CC0)"
    mark_asset(surface, "terrain", "garden-terrain")


def build_pathways() -> None:
    target = collection("PATHWAYS")
    path_material = material("Warm stone path", (0.39, 0.31, 0.21, 1.0), 0.88)
    planting_bed = material("Planting bed", (0.2, 0.15, 0.08, 1.0), 0.92)

    path_specs = [
        ((0.0, -8.3, 0.08), (1.65, 4.25, 0.06), -0.03),
        ((-0.55, -1.0, 0.08), (1.65, 3.35, 0.06), 0.16),
        ((0.45, 5.7, 0.08), (1.65, 3.7, 0.06), -0.12),
    ]
    for index, (location, scale, rotation) in enumerate(path_specs):
        stone = cube(
            f"Path_Section_{index}",
            location,
            scale,
            path_material,
            target,
            rotation=(0.0, 0.0, rotation),
            bevel_width=0.3,
        )
        mark_asset(stone, "pathway", f"path-{index}")

    # Keep Aloe's circular bed aligned with its runtime placement at (3, 5.5).
    # Moving it east also leaves a clear gap from the path along the garden centre.
    for index, (x, y, radius) in enumerate(
        ((-3.2, 4.0, 0.9), (3.0, -5.5, 0.8), (4.6, 6.0, 1.0))
    ):
        bpy.ops.mesh.primitive_cylinder_add(
            vertices=28,
            radius=radius,
            depth=0.12,
            location=(x, y, 0.08),
        )
        bed = bpy.context.object
        bed.name = f"Planting_Bed_{index}"
        assign(bed, planting_bed)
        move_to_collection(bed, target)
        mark_asset(bed, "planting-bed", f"planting-bed-{index}")


def build_environment() -> None:
    target = collection("ENVIRONMENT")
    bark = material("Bark", (0.19, 0.105, 0.045, 1.0), 0.95)
    rock = material("Garden stone", (0.31, 0.34, 0.28, 1.0), 0.98)
    leaf_dark = material("Deep leaves", (0.055, 0.24, 0.085, 1.0), 0.8)
    leaf_light = material("Sunlit leaves", (0.28, 0.49, 0.16, 1.0), 0.74)

    tree_root = empty("Tree_Neem", target, (-6.3, -1.8, 0.0))
    mark_asset(tree_root, "decoration", "neem-tree")
    cylinder(
        "Neem_Trunk",
        (-6.3, -1.8, 2.4),
        0.48,
        4.8,
        bark,
        target,
        vertices=14,
        parent=tree_root,
    )
    branch_between("Neem_Branch_A", (-6.3, -1.8, 3.1), (-7.9, -1.0, 5.0), 0.18, bark, target, tree_root)
    branch_between("Neem_Branch_B", (-6.3, -1.8, 3.5), (-4.8, -2.6, 5.2), 0.2, bark, target, tree_root)
    branch_between("Neem_Branch_C", (-6.3, -1.8, 3.7), (-6.2, -0.1, 5.5), 0.16, bark, target, tree_root)
    canopy = empty("Tree_Canopy", target, (-6.3, -1.8, 5.4))
    set_parent_keep_world(canopy, tree_root)
    clusters = [
        ((-7.7, -1.0, 5.2), (1.5, 1.2, 1.25), leaf_dark),
        ((-5.0, -2.5, 5.3), (1.6, 1.25, 1.35), leaf_light),
        ((-6.2, -0.3, 5.8), (1.7, 1.4, 1.25), leaf_dark),
        ((-6.3, -1.7, 6.2), (1.8, 1.5, 1.35), leaf_light),
        ((-7.4, -2.2, 5.8), (1.35, 1.1, 1.1), leaf_dark),
    ]
    for index, (location, scale, assigned_material) in enumerate(clusters):
        sphere(
            f"Neem_Canopy_{index}",
            location,
            scale,
            assigned_material,
            target,
            segments=14,
            rings=8,
            parent=canopy,
        )

    for index, (x, y, size) in enumerate(
        ((-8.5, 5.5, 0.7), (-8.9, 4.7, 0.45), (7.8, -4.5, 0.6), (8.6, -3.9, 0.4), (7.6, 8.0, 0.5))
    ):
        stone = sphere(
            f"Rock_{index}",
            (x, y, size * 0.55),
            (size, size * 0.72, size * 0.55),
            rock,
            target,
            segments=10,
            rings=6,
        )
        mark_asset(stone, "decoration", f"rock-{index}")

    for x in (-11.2, 11.2):
        for y in range(-10, 12, 3):
            cylinder(f"Fence_Post_{x}_{y}", (x, float(y), 0.55), 0.075, 1.1, bark, target, vertices=8)
    for y in (-11.2, 11.2):
        for x in range(-10, 12, 3):
            cylinder(f"Fence_Post_{x}_{y}", (float(x), y, 0.55), 0.075, 1.1, bark, target, vertices=8)
