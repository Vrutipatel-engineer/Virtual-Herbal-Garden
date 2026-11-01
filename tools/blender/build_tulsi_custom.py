"""Build a fuller, project-owned Tulsi shrub and export a browser-ready GLB."""

from __future__ import annotations

import math
import os
import random
import sys

import bpy
from mathutils import Vector


def parse_args() -> tuple[str, str, str]:
    args = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    if len(args) != 3:
        raise RuntimeError("Expected: -- <glb-output> <blend-output> <preview-output>")
    return tuple(os.path.abspath(value) for value in args)  # type: ignore[return-value]


def make_material(name: str, color: tuple[float, float, float, float], roughness: float) -> bpy.types.Material:
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = color
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = color
    shader.inputs["Roughness"].default_value = roughness
    return mat


def make_leaf_material(name: str, base_color: tuple[float, float, float, float], young: bool = False) -> bpy.types.Material:
    """Bake a small, varied vein-and-mottle atlas so glTF keeps the leaf detail."""
    mat = make_material(name, base_color, 0.88)
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    shader.inputs["Roughness"].default_value = 0.88
    shader.inputs["Specular IOR Level"].default_value = 0.2
    shader.inputs["Subsurface Weight"].default_value = 0.065
    shader.inputs["Emission Color"].default_value = tuple(channel * 0.7 for channel in base_color[:3]) + (1.0,)
    shader.inputs["Emission Strength"].default_value = 0.16
    image = bpy.data.images.new(name + " atlas", width=768, height=768, alpha=False)
    pixels = [0.0] * (768 * 768 * 4)
    tile_size = 192
    base_rgb = base_color[:3]

    for tile in range(16):
        tile_x = tile % 4
        tile_y = tile // 4
        rng = random.Random(4821 + tile * 113 + int(base_rgb[1] * 1000))
        for py in range(tile_size):
            v = py / (tile_size - 1)
            edge_factor = 1.0 - 0.16 * (abs(v - 0.5) * 2.0) ** 2.5
            for px in range(tile_size):
                u = px / (tile_size - 1)
                mottling = 0.98 + 0.045 * math.sin(u * math.pi) + rng.uniform(-0.035, 0.035)
                mottling += 0.022 * math.sin((u * 1.7 + tile * 0.11) * math.tau) * math.sin((v * 1.3 + tile * 0.07) * math.tau)
                longitudinal = 0.99 + 0.012 * math.sin((u * 2.2 + tile * 0.17) * math.tau)
                index = ((tile_y * tile_size + py) * 768 + tile_x * tile_size + px) * 4
                shade = mottling * longitudinal * edge_factor
                pixels[index] = min(1.0, base_rgb[0] * shade)
                pixels[index + 1] = min(1.0, base_rgb[1] * shade)
                pixels[index + 2] = min(1.0, base_rgb[2] * shade)
                pixels[index + 3] = 1.0

        # A muted midrib is baked into the blade; raised repeating stripes looked artificial.
        vein_color = tuple(min(1.0, channel * 1.018) for channel in base_rgb)
        vein_rows = (tile_y * tile_size + tile_size // 2,)
        for x in range(tile_size):
            gx = tile_x * tile_size + x
            for gy in vein_rows:
                index = (gy * 768 + gx) * 4
                pixels[index:index + 4] = (*vein_color, 1.0)

    image.pixels.foreach_set(pixels)
    image.pack()
    texture = nodes.new("ShaderNodeTexImage")
    texture.image = image
    texture.interpolation = "Linear"
    uv = nodes.new("ShaderNodeTexCoord")
    links.new(uv.outputs["UV"], texture.inputs["Vector"])
    links.new(texture.outputs["Color"], shader.inputs["Base Color"])
    links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    return mat


def tapered_segment(name: str, start: Vector, end: Vector, r0: float, r1: float, material: bpy.types.Material, vertices: int = 7) -> bpy.types.Object:
    delta = end - start
    bpy.ops.mesh.primitive_cone_add(
        vertices=vertices,
        radius1=r0,
        radius2=r1,
        depth=delta.length,
        location=(start + end) * 0.5,
    )
    obj = bpy.context.object
    obj.name = name
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = delta.to_track_quat("Z", "Y")
    obj.data.materials.append(material)
    return obj


def leaf_surface_point(base: Vector, axis: Vector, side: Vector, normal: Vector, length: float, width: float, u: float, v: float, layer: float = 1.0, seed: int = 0) -> Vector:
    taper = max(0.0, math.sin(math.pi * (0.16 + u * 0.84))) ** 0.62
    serration = 1.0 + 0.035 * math.sin((u * 13.0 + seed * 0.13) * math.tau) * abs(v) ** 2
    half_width = width * 0.5 * taper * serration
    center = base + axis * (length * u)
    ridge = 0.014 * math.sin(math.pi * u) * (1.0 - abs(v))
    curl = -0.009 * (v * v) * math.sin(math.pi * u)
    thickness = 0.002 * layer
    return center + side * (half_width * v) + normal * (ridge + curl + thickness)


def create_leaf_mesh(name: str, base: Vector, direction: Vector, length: float, width: float, material: bpy.types.Material, underside: bpy.types.Material, seed: int) -> tuple[bpy.types.Object, list[list[Vector]]]:
    """Create a finely tessellated, pointed and shallow-cupped Tulsi leaf."""
    axis = direction.normalized()
    side = Vector((-axis.y, axis.x, 0.0)).normalized()
    if side.length < 0.01:
        side = Vector((1.0, 0.0, 0.0))
    normal = axis.cross(side).normalized()
    if normal.z < 0:
        normal.negate()
    across = 12
    along = 24
    vertices: list[tuple[float, float, float]] = []
    uv_coordinates: list[tuple[float, float]] = []
    faces: list[tuple[int, ...]] = []

    for layer in (1.0, -1.0):
        offset = len(vertices)
        for i in range(along + 1):
            u = i / along
            for j in range(across + 1):
                v = (j / across) * 2.0 - 1.0
                point = leaf_surface_point(base, axis, side, normal, length, width, u, v, layer, seed)
                vertices.append(tuple(point))
                tile_x = seed % 4
                tile_y = (seed // 4) % 4
                uv_coordinates.append(((tile_x + u) / 4.0, (tile_y + (v + 1.0) * 0.5) / 4.0))

        for i in range(along):
            for j in range(across):
                a = offset + i * (across + 1) + j
                b = a + across + 1
                face = (a, b, b + 1, a + 1)
                faces.append(face if layer > 0 else tuple(reversed(face)))

    # Close the fine edge and make the blade look solid from below.
    layer_size = (along + 1) * (across + 1)
    for i in range(along):
        for j in (0, across):
            a = i * (across + 1) + j
            b = a + across + 1
            faces.append((a, a + layer_size, b + layer_size, b))

    mesh = bpy.data.meshes.new(name + "Mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.materials.append(material)
    mesh.materials.append(underside)
    uv_layer = mesh.uv_layers.new(name="Leaf UV")
    for polygon in mesh.polygons:
        for loop_index in polygon.loop_indices:
            vertex_index = mesh.loops[loop_index].vertex_index
            uv_layer.data[loop_index].uv = uv_coordinates[vertex_index]
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    for polygon in mesh.polygons:
        if across * along <= polygon.index < across * along * 2:
            polygon.material_index = 1
        polygon.use_smooth = True

    vein_paths: list[list[Vector]] = [[
        leaf_surface_point(base, axis, side, normal, length, width, u, 0.0, 1.0, seed) + normal * 0.002
        for u in (0.06, 0.48, 0.94)
    ]]
    return obj, vein_paths


def join_objects(objects: list[bpy.types.Object], name: str) -> bpy.types.Object:
    if len(objects) == 1:
        objects[0].name = name
        return objects[0]
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.join()
    joined = bpy.context.object
    joined.name = name
    return joined


def add_curve(name: str, points: list[Vector], radius: float, material: bpy.types.Material, parent: bpy.types.Object) -> bpy.types.Object:
    curve = bpy.data.curves.new(name, type="CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 2
    curve.bevel_depth = radius
    curve.bevel_resolution = 2
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for point, coordinate in zip(spline.bezier_points, points):
        point.co = coordinate
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    obj.parent = parent
    return obj


def add_vein_curves(paths: list[list[Vector]], material: bpy.types.Material, parent: bpy.types.Object) -> bpy.types.Object:
    curve = bpy.data.curves.new("Tulsi leaf venation", type="CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 1
    curve.bevel_depth = 0.00045
    curve.bevel_resolution = 1
    for path in paths:
        spline = curve.splines.new("BEZIER")
        spline.bezier_points.add(len(path) - 1)
        for point, coordinate in zip(spline.bezier_points, path):
            point.co = coordinate
            point.handle_left_type = "AUTO"
            point.handle_right_type = "AUTO"
    obj = bpy.data.objects.new("Tulsi_Leaf_Veins", curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    obj.parent = parent
    return obj


def create_scene(glb_path: str, blend_path: str, preview_path: str) -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)

    stems_green = make_material("Tulsi stems · olive green", (0.12, 0.23, 0.075, 1), 0.84)
    stems_purple = make_material("Tulsi stems · dusky purple", (0.16, 0.10, 0.095, 1), 0.86)
    root_material = make_material("Tulsi roots · earthy olive", (0.09, 0.075, 0.045, 1), 0.94)
    leaves = [
        make_leaf_material("Tulsi leaf · mature green", (0.075, 0.30, 0.085, 1)),
        make_leaf_material("Tulsi leaf · shaded green", (0.055, 0.245, 0.065, 1)),
        make_leaf_material("Tulsi leaf · young green", (0.15, 0.37, 0.095, 1), young=True),
    ]
    leaf_undersides = [
        make_leaf_material("Tulsi underside · mature", (0.13, 0.36, 0.12, 1)),
        make_leaf_material("Tulsi underside · shaded", (0.10, 0.30, 0.085, 1)),
        make_leaf_material("Tulsi underside · young", (0.19, 0.43, 0.12, 1), young=True),
    ]
    vein_material = make_material("Tulsi leaf veins · muted green", (0.09, 0.20, 0.055, 1), 0.91)
    flower_material = make_material("Tulsi flower · muted violet", (0.26, 0.16, 0.24, 1), 0.88)
    calyx_material = make_material("Tulsi flower · green calyx", (0.14, 0.23, 0.08, 1), 0.88)

    root = bpy.data.objects.new("Plant_Tulsi", None)
    bpy.context.collection.objects.link(root)
    root.empty_display_type = "SPHERE"
    root.empty_display_size = 0.07
    root["garden_role"] = "interactive-plant"
    root["asset_id"] = "tulsi"
    root["lod"] = 0
    root["source"] = "Project-owned Blender botanical model"

    # A restrained surface root flare grounds the shrub without making it tree-like.
    root_segments: list[bpy.types.Object] = []
    for root_index in range(5):
        theta = math.tau * (root_index / 5.0 + random.Random(root_index + 32).uniform(-0.08, 0.08)) + 0.2
        direction = Vector((math.cos(theta), math.sin(theta), 0.0))
        points = (
            direction * 0.02 + Vector((0, 0, 0.075)),
            direction * 0.065 + Vector((0, 0, 0.015)),
            direction * (0.105 + 0.012 * (root_index % 3)) + Vector((0, 0, 0.002)),
        )
        root_segments.append(tapered_segment(f"Tulsi_Surface_Root_{root_index}_0", points[0], points[1], 0.007, 0.0045, root_material, vertices=8))
        root_segments.append(tapered_segment(f"Tulsi_Surface_Root_{root_index}_1", points[1], points[2], 0.0045, 0.0018, root_material, vertices=8))

    # The rooted woody base fans into seven upright, gently spreading shoots.
    stem_segments: list[bpy.types.Object] = []
    shoot_count = 8
    shoots: list[dict[str, object]] = []
    for shoot in range(shoot_count):
        theta = math.tau * (shoot / shoot_count + random.Random(730 + shoot).uniform(-0.055, 0.055)) + 0.18
        if shoot == 0:
            base = Vector((0.0, 0.0, 0.0))
            spread = 0.06
            height = 1.42
        else:
            spread = 0.065 + 0.035 * (shoot % 3)
            base = Vector((math.cos(theta) * spread, math.sin(theta) * spread, 0.0))
            height = 1.08 + 0.24 * ((shoot * 3) % 4) / 3
        drift = 0.25 if shoot == 0 else 0.34 + 0.06 * (shoot % 2)
        end_radius = 0.43 if shoot == 0 else 0.44 + 0.045 * (shoot % 3)
        path: list[Vector] = []
        steps = 9
        for step in range(steps + 1):
            t = step / steps
            radial = spread + end_radius * (t ** 1.48)
            sway = 0.035 * math.sin(t * math.pi * 1.6 + shoot)
            point = Vector((
                math.cos(theta) * radial + sway,
                math.sin(theta) * radial - sway * 0.45,
                height * t,
            ))
            path.append(point)
        for step in range(steps):
            t = step / steps
            radius = (0.017 if shoot == 0 else 0.0135) * (1.0 - 0.78 * t)
            segment = tapered_segment(
                f"Tulsi_Shoot_{shoot}_{step}", path[step], path[step + 1],
                radius, radius * 0.88, stems_purple if shoot % 3 == 0 else stems_green,
            )
            stem_segments.append(segment)
        shoots.append({"theta": theta, "path": path, "height": height, "spread": end_radius})

    # Secondary branches fill the middle/lower canopy so it reads as a bush, not a handful of stalks.
    for shoot_index in (1, 2, 3, 4, 6, 7):
        shoot = shoots[shoot_index]
        theta = float(shoot["theta"])
        path = shoot["path"]
        for side_sign in (-1, 1):
            attach_index = 3 if side_sign < 0 else 5
            start = path[attach_index]
            branch_heading = theta + side_sign * 0.82
            length = 0.30 + 0.035 * ((shoot_index + side_sign) % 3)
            end = start + Vector((math.cos(branch_heading) * length, math.sin(branch_heading) * length, 0.19))
            middle = start.lerp(end, 0.52) + Vector((0, 0, 0.045))
            stem_segments.append(tapered_segment(f"Tulsi_Lateral_{shoot_index}_{side_sign}_0", start, middle, 0.008, 0.0055, stems_green))
            stem_segments.append(tapered_segment(f"Tulsi_Lateral_{shoot_index}_{side_sign}_1", middle, end, 0.0055, 0.0025, stems_green))

    # Paired opposite leaves at the nodes: 7 main shoots plus six lateral sprays.
    leaf_objects: list[bpy.types.Object] = []
    vein_paths: list[list[Vector]] = []
    leaf_index = 0
    for shoot_index, shoot in enumerate(shoots):
        theta = float(shoot["theta"])
        path = shoot["path"]
        node_indices = range(0, 9)
        for node in node_indices:
            attach_index = min(1 + node, 9)
            attach = path[attach_index]
            phase = (node % 2) * (math.pi * 0.5) + 0.30 * math.sin(shoot_index * 2.4 + node * 1.7)
            azimuth = theta + phase
            # Longer lower leaves make a round, leafy silhouette; small leaves gather near the tip.
            vertical_t = attach.z / max(float(shoot["height"]), 0.01)
            length = 0.255 - 0.060 * vertical_t + 0.023 * ((node + shoot_index) % 3)
            width = length * (0.88 + 0.08 * ((node + shoot_index) % 3))
            for pair_side in (0, 1):
                leaf_seed = leaf_index
                variation = math.sin(leaf_seed * 12.9898) * 0.34
                direction_theta = azimuth + pair_side * math.pi + variation
                upward_tilt = -0.18 + 0.90 * ((math.sin(leaf_seed * 78.233) + 1.0) * 0.5)
                direction = Vector((math.cos(direction_theta), math.sin(direction_theta), upward_tilt))
                leaf_length = length * (0.87 + 0.25 * ((math.sin(leaf_seed * 19.19) + 1.0) * 0.5))
                blade, blade_veins = create_leaf_mesh(
                    f"Tulsi_Leaf_{leaf_index:03d}", attach, direction,
                    leaf_length, width * (0.90 + 0.18 * ((math.sin(leaf_seed * 31.1) + 1.0) * 0.5)), leaves[(leaf_index + node) % len(leaves)], leaf_undersides[(leaf_index + node) % len(leaf_undersides)], leaf_index,
                )
                blade.parent = root
                leaf_objects.append(blade)
                vein_paths.extend(blade_veins)
                leaf_index += 1

    # Leafy side sprays add density at the shrub's shoulder and near the soil.
    for shoot_index in (1, 2, 3, 4, 6, 7):
        shoot = shoots[shoot_index]
        theta = float(shoot["theta"])
        path = shoot["path"]
        for side_sign in (-1, 1):
            attach = path[4]
            branch_theta = theta + side_sign * 0.82
            for node in range(4):
                t = 0.2 + node * 0.2
                leaf_base = attach + Vector((math.cos(branch_theta) * 0.32 * t, math.sin(branch_theta) * 0.32 * t, 0.18 * t))
                for pair_side in (0, 1):
                    a = branch_theta + (pair_side * math.pi) + side_sign * 0.42
                    length = 0.18 + 0.025 * ((node + shoot_index) % 2)
                    blade, blade_veins = create_leaf_mesh(
                        f"Tulsi_Leaf_{leaf_index:03d}", leaf_base,
                        Vector((math.cos(a), math.sin(a), 0.20)), length,
                        length * 0.72, leaves[(leaf_index + 1) % len(leaves)], leaf_undersides[(leaf_index + 1) % len(leaf_undersides)], leaf_index,
                    )
                    blade.parent = root
                    leaf_objects.append(blade)
                    vein_paths.extend(blade_veins)
                    leaf_index += 1

    # Several upright flower spikes with alternating small calyxes and violet flowers.
    flowers: list[bpy.types.Object] = []
    spike_specs = [(0, 0.12), (2, -0.08), (4, 0.10), (6, -0.06)]
    for spike_index, (shoot_index, lean) in enumerate(spike_specs):
        shoot = shoots[shoot_index]
        tip = shoot["path"][-1]
        spike_top = tip + Vector((lean, -lean * 0.35, 0.25 if spike_index == 0 else 0.19))
        flowers.append(tapered_segment(f"Tulsi_Flower_Spike_{spike_index}", tip, spike_top, 0.008, 0.003, stems_purple, vertices=6))
        for floret in range(7):
            t = 0.18 + floret * 0.105
            center = tip.lerp(spike_top, t)
            for side_sign in (-1, 1):
                side_angle = (spike_index * 1.1) + side_sign * (0.42 + 0.03 * (floret % 2))
                offset = Vector((math.cos(side_angle) * 0.025, math.sin(side_angle) * 0.025, 0.008 * (floret % 2)))
                bpy.ops.mesh.primitive_uv_sphere_add(segments=8, ring_count=5, radius=0.0075, location=center + offset)
                floret_obj = bpy.context.object
                floret_obj.name = f"Tulsi_Floret_{spike_index}_{floret}_{side_sign}"
                floret_obj.scale = (0.85, 0.85, 1.45)
                floret_obj.data.materials.append(calyx_material if floret % 2 == 0 else flower_material)
                flowers.append(floret_obj)

    stem_mesh = join_objects(stem_segments, "Tulsi_Stems")
    stem_mesh.parent = root
    root_mesh = join_objects(root_segments, "Tulsi_Surface_Roots")
    root_mesh.parent = root
    leaf_mesh = join_objects(leaf_objects, "Tulsi_Leaves")
    flower_mesh = join_objects(flowers, "Tulsi_Flower_Spikes")
    flower_mesh.parent = root
    vein_mesh = add_vein_curves(vein_paths, vein_material, root)

    # Camera, lights, and a neutral background are for the preview only.
    bpy.ops.object.camera_add(location=(3.4, -5.8, 2.25))
    camera = bpy.context.object
    camera.name = "Preview_Camera"
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 2.1
    camera.rotation_euler = (Vector((0.0, 0.0, 0.82)) - camera.location).to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = camera

    bpy.ops.object.light_add(type="AREA", location=(1.7, -3.5, 4.2))
    key = bpy.context.object
    key.name = "Preview_Key"
    key.data.energy = 700
    key.data.shape = "DISK"
    key.data.size = 3.2
    key.rotation_euler = (Vector((0, 0, 0.8)) - key.location).to_track_quat("-Z", "Y").to_euler()
    bpy.ops.object.light_add(type="AREA", location=(-3.0, 0.8, 2.6))
    fill = bpy.context.object
    fill.name = "Preview_Fill"
    fill.data.energy = 700
    fill.data.size = 3.4
    fill.rotation_euler = (Vector((0, 0, 0.8)) - fill.location).to_track_quat("-Z", "Y").to_euler()
    bpy.ops.object.light_add(type="AREA", location=(0.5, 2.8, 0.6))
    bounce = bpy.context.object
    bounce.name = "Preview_Bounce"
    bounce.data.energy = 900
    bounce.data.size = 4.0
    bounce.rotation_euler = (Vector((0, 0, 0.75)) - bounce.location).to_track_quat("-Z", "Y").to_euler()

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 760
    scene.render.resolution_y = 760
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = preview_path
    scene.world.color = (0.82, 0.82, 0.82)
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "Medium High Contrast"
    scene.camera.data.lens = 50

    # Save editable source including preview setup; export only the plant hierarchy.
    os.makedirs(os.path.dirname(glb_path), exist_ok=True)
    os.makedirs(os.path.dirname(blend_path), exist_ok=True)
    os.makedirs(os.path.dirname(preview_path), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)

    bpy.ops.object.select_all(action="DESELECT")
    root.select_set(True)
    for obj in (root_mesh, stem_mesh, leaf_mesh, flower_mesh, vein_mesh):
        obj.select_set(True)
    bpy.context.view_layer.objects.active = root
    bpy.ops.export_scene.gltf(
        filepath=glb_path,
        export_format="GLB",
        use_selection=True,
        export_yup=True,
        export_extras=True,
        export_apply=True,
        export_cameras=False,
        export_lights=False,
    )
    scene.render.filepath = preview_path
    bpy.ops.render.render(write_still=True)
    print(f"Tulsi custom model: {leaf_index} leaves, {glb_path}")


if __name__ == "__main__":
    create_scene(*parse_args())
