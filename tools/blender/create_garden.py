"""Build the Phase 4 modular garden without requiring interactive Blender use.

Run directly:
  blender --background --python tools/blender/create_garden.py -- --workspace <project-root>

Or use the project command:
  pnpm build:garden-assets
"""

from __future__ import annotations

import argparse
import os
import sys

SCRIPT_DIRECTORY = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIRECTORY not in sys.path:
    sys.path.insert(0, SCRIPT_DIRECTORY)

import bpy

from build_terrain import build_environment, build_pathways, build_terrain
from create_colliders import create_colliders
from export_glb import export_garden
from garden_common import reset_scene
from prepare_plants import prepare_plants


def arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workspace", required=True)
    blender_arguments = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    return parser.parse_args(blender_arguments)


def configure_scene() -> None:
    bpy.context.scene.unit_settings.system = "METRIC"
    bpy.context.scene.unit_settings.scale_length = 1.0
    bpy.context.scene.render.engine = "BLENDER_EEVEE"


def main() -> None:
    options = arguments()
    workspace = os.path.abspath(options.workspace)
    reset_scene()
    configure_scene()
    texture_directory = os.path.join(workspace, "assets-3d", "source", "textures", "polyhaven")
    build_terrain(texture_directory)
    build_pathways()
    build_environment()
    prepare_plants()
    create_colliders()
    records = export_garden(workspace)
    print(f"Created modular garden source and {len(records)} GLB exports.")
    for record in records:
        print(f"- {record['path']} ({record['bytes']} bytes)")


if __name__ == "__main__":
    main()
