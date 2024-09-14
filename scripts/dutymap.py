import subprocess

def convert_svg_to_png_with_inkscape(svg_file_path, output_png_path, width, height):
    subprocess.run([
        "inkscape",
        svg_file_path,
        "--export-png", output_png_path,
        "-w", str(width),
        "-h", str(height)
    ])


svg_file_path = "./resources/img/reel_map/dutymap3.svg"
output_png_path = "./resources/img/reel_map/dutymap3.png"
width, height = 2500, 2500

convert_svg_to_png_with_inkscape(svg_file_path, output_png_path, width, height)
