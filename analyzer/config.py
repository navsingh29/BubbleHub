"""
Configuration for BubbleHub analyzer
"""
import json
import os

JSON_CONFIG = "config.json"

project_root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ui_dir = os.path.join(project_root_dir, "ui")
json_config_file = os.path.join(ui_dir, JSON_CONFIG)

with open(json_config_file) as f:
    json_contents = f.readlines()

config = json.loads("".join(json_contents))

def rewrite_config_json(json_dict):
    with open(json_config_file, 'w') as f:
        f.write(json.dumps(json_dict, indent=4))
