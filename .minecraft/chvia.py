import os
import sys


def update_plugins(server_foldor: str, prev_plugin_fname: str, new: str):
    servers = [f for f in os.listdir(server_foldor)]
    for server in servers:
        _del = f"./servers/{server}/plugins/{prev_plugin_fname}"
        _new = f"./servers/{server}/plugins/{os.path.basename(new)}"
        if os.path.exists(_del):
            os.remove(_del)
        with open(new, "rb") as f:
            _plugin = f.read()
        with open(_new, "wb") as f:
            f.write(_plugin)


if __name__ == "__main__":
    update_plugins("./servers/", "ViaVersion-4.7.0.jar", "./ViaVersion-4.8.0.jar")
