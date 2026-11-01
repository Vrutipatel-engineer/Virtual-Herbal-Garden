"""Shared, project-owned Blender helpers for the modular garden pipeline."""

from __future__ import annotations

import math
import os

import bpy
from mathutils import Vector


def reset_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)

    for collection in list(bpy.data.collections):
        bpy.data.collections.remove(collection)

    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)


def collection(name: str):
    existing = bpy.data.collections.get(name)
    if existing:
        return existing
    created = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(created)
    return created


def move_to_collection(obj, target_collection) -> None:
    for current_collection in list(obj.users_collection):
        current_collection.objects.unlink(obj)
    target_collection.objects.link(obj)


def material(
    name: str,
    color: tuple[float, float, float, float],
    roughness: float = 0.78,
    metallic: float = 0.0,
):
    existing = bpy.data.materials.get(name)
    if existing:
        return existing

    created = bpy.data.materials.new(name)
    created.diffuse_color = color
    created.use_nodes = True
    principled = created.node_tree.nodes.get("Principled BSDF")
    principled.inputs["Base Color"].default_value = color
    principled.inputs["Roughness"].default_value = roughness
    principled.inputs["Metallic"].default_value = metallic
    return created


def pbr_texture_material(
    name: str,
    diffuse_path: str,
    normal_path: str,
    roughness_path: str,
    texture_scale: float = 3.0,
):
    """Create an embedded, web-exportable PBR material from vetted local source maps."""
    if not all(os.path.isfile(path) for path in (diffuse_path, normal_path, roughness_path)):
        raise RuntimeError(f"Missing required texture map for {name}")

    created = bpy.data.materials.new(name)
    created.use_nodes = True
    nodes = created.node_tree.nodes
    links = created.node_tree.links
    nodes.clear()

    output = nodes.new("ShaderNodeOutputMaterial")
    principled = nodes.new("ShaderNodeBsdfPrincipled")
    coordinates = nodes.new("ShaderNodeUVMap")
    mapping = nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (texture_scale, texture_scale, texture_scale)
    links.new(coordinates.outputs["UV"], mapping.inputs["Vector"])

    def image_node(label: str, path: str, color_space: str):
        image = bpy.data.images.load(path, check_existing=True)
        image.colorspace_settings.name = color_space
        node = nodes.new("ShaderNodeTexImage")
        node.label = label
        node.image = image
        links.new(mapping.outputs["Vector"], node.inputs["Vector"])
        return node

    diffuse = image_node("Base color", diffuse_path, "sRGB")
    normal = image_node("Normal", normal_path, "Non-Color")
    roughness = image_node("Roughness + AO", roughness_path, "Non-Color")
    normal_map = nodes.new("ShaderNodeNormalMap")
    links.new(diffuse.outputs["Color"], principled.inputs["Base Color"])
    links.new(normal.outputs["Color"], normal_map.inputs["Color"])
    links.new(normal_map.outputs["Normal"], principled.inputs["Normal"])
    links.new(roughness.outputs["Color"], principled.inputs["Roughness"])
    links.new(principled.outputs["BSDF"], output.inputs["Surface"])
    return created


def assign(obj, assigned_material) -> None:
    if obj.data and hasattr(obj.data, "materials"):
        obj.data.materials.append(assigned_material)


def set_parent_keep_world(obj, parent) -> None:
    if parent is None:
        return
    world_matrix = obj.matrix_world.copy()
    obj.parent = parent
    obj.matrix_world = world_matrix


def apply_scale(obj) -> None:
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.select_set(False)


def bevel(obj, width: float, segments: int = 2) -> None:
    modifier = obj.modifiers.new(name="Soft edges", type="BEVEL")
    modifier.width = width
    modifier.segments = segments
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    obj.select_set(False)


def empty(name: str, target_collection, location=(0.0, 0.0, 0.0)):
    obj = bpy.data.objects.new(name, None)
    obj.empty_display_type = "PLAIN_AXES"
    obj.location = location
    target_collection.objects.link(obj)
    return obj


def cube(
    name: str,
    location,
    scale,
    assigned_material,
    target_collection,
    rotation=(0.0, 0.0, 0.0),
    bevel_width=0.0,
    parent=None,
):
    bpy.ops.mesh.primitive_cube_add(location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    apply_scale(obj)
    if bevel_width:
        bevel(obj, bevel_width)
    assign(obj, assigned_material)
    move_to_collection(obj, target_collection)
    set_parent_keep_world(obj, parent)
    return obj


def cylinder(
    name: str,
    location,
    radius: float,
    depth: float,
    assigned_material,
    target_collection,
    vertices=12,
    rotation=(0.0, 0.0, 0.0),
    parent=None,
):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    assign(obj, assigned_material)
    move_to_collection(obj, target_collection)
    set_parent_keep_world(obj, parent)
    return obj


def sphere(
    name: str,
    location,
    scale,
    assigned_material,
    target_collection,
    segments=16,
    rings=10,
    parent=None,
):
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=segments,
        ring_count=rings,
        location=location,
    )
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    apply_scale(obj)
    assign(obj, assigned_material)
    move_to_collection(obj, target_collection)
    set_parent_keep_world(obj, parent)
    return obj


def branch_between(
    name: str,
    start,
    end,
    radius: float,
    assigned_material,
    target_collection,
    parent=None,
    vertices=10,
):
    start_vector = Vector(start)
    end_vector = Vector(end)
    delta = end_vector - start_vector
    midpoint = (start_vector + end_vector) / 2
    obj = cylinder(
        name,
        midpoint,
        radius,
        delta.length,
        assigned_material,
        target_collection,
        vertices=vertices,
        parent=parent,
    )
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = delta.to_track_quat("Z", "Y")
    return obj


def leaf(
    name: str,
    location,
    scale,
    assigned_material,
    target_collection,
    rotation=(0.0, 0.0, 0.0),
    parent=None,
    segments=10,
    rings=6,
):
    obj = sphere(
        name,
        location,
        scale,
        assigned_material,
        target_collection,
        segments=segments,
        rings=rings,
        parent=parent,
    )
    obj.rotation_euler = rotation
    return obj


def mark_asset(obj, role: str, asset_id: str, lod: int | None = None) -> None:
    obj["garden_role"] = role
    obj["asset_id"] = asset_id
    if lod is not None:
        obj["lod"] = lod


def angle(index: int, count: int) -> float:
    return (math.tau / count) * index
