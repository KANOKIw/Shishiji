def hex_to_rgb(hex: str) -> list[int]:
    hex = hex.lstrip("#")
    return [int(hex[i:i+2], 16) for i in (0, 2, 4)]


def rgb_to_hex(rgb: list[int]) -> str:
    return "#{:02x}{:02x}{:02x}".format(*rgb)


def get_colorDifference(color1: str, color2: str) -> int:
    return sum([abs(c1 - c2) for c1, c2 in zip(hex_to_rgb(color1), hex_to_rgb(color2))])


def add_color(color1: list[int], color2: list[int]) -> list[int]:
    return [c1 + c2 for c1, c2 in zip(color1, color2)]


def subtract_color(color: list[int], pull_color: list[int]) -> list[int]:
    return [c1 - c2 for c1, c2 in zip(color, pull_color)]
