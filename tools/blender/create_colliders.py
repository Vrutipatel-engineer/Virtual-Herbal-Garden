"""Create low-complexity collision proxy meshes for inspection and later runtime use."""

from __future__ import annotations

from garden_common import collection, cube, cylinder, mark_asset, material, sphere


def create_colliders() -> None:
    target = collection("COLLIDERS")
    proxy = material("Collision proxy", (0.08, 0.5, 0.72, 0.35), 1.0)

    ground = cube("COLLIDER_Ground", (0, 0, -0.2), (12.4, 12.4, 0.2), proxy, target)
    mark_asset(ground, "collider", "ground")

    boundary_specs = [
        ("COLLIDER_Boundary_West", (-12.2, 0, 1.8), (0.2, 12.4, 2.0)),
        ("COLLIDER_Boundary_East", (12.2, 0, 1.8), (0.2, 12.4, 2.0)),
        ("COLLIDER_Boundary_North", (0, 12.2, 1.8), (12.4, 0.2, 2.0)),
        ("COLLIDER_Boundary_South", (0, -12.2, 1.8), (12.4, 0.2, 2.0)),
    ]
    for name, location, scale in boundary_specs:
        boundary = cube(name, location, scale, proxy, target)
        mark_asset(boundary, "collider", name.removeprefix("COLLIDER_").lower())

    tree = cylinder("COLLIDER_Neem_Trunk", (-6.3, -1.8, 2.6), 0.62, 5.4, proxy, target, vertices=8)
    mark_asset(tree, "collider", "neem-tree")

    for name, location, scale in (
        ("COLLIDER_Rock_West", (-8.5, 5.5, 0.42), (0.72, 0.6, 0.45)),
        ("COLLIDER_Rock_East", (7.8, -4.5, 0.36), (0.62, 0.52, 0.38)),
    ):
        rock = sphere(name, location, scale, proxy, target, segments=8, rings=5)
        mark_asset(rock, "collider", name.removeprefix("COLLIDER_").lower())
