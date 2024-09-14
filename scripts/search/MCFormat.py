import re
from html import escape
from bs4 import BeautifulSoup as BS


STYLES = {
    "§0": "color:#000000",
    "§1": "color:#0000AA",
    "§2": "color:#00AA00",
    "§3": "color:#00AAAA",
    "§4": "color:#AA0000",
    "§5": "color:#AA00AA",
    "§6": "color:#FFAA00",
    "§7": "color:#AAAAAA",
    "§8": "color:#555555",
    "§9": "color:#5555FF",
    "§a": "color:#55FF55",
    "§b": "color:#55FFFF",
    "§c": "color:#FF5555",
    "§d": "color:#FF55FF",
    "§e": "color:#FFFF55",
    "§f": "color:#FFFFFF",
    
    "§l": "font-weight:bold",
    "§n": "text-decoration:underline", 
    "§o": "font-style:italic",
    "§m": "text-decoration:line-through",

    "§x": "font-size:48px;line-height:1.5",
    "§y": "font-size:36px;line-height:1.333",
    "§z": "font-size:24px;line-height:1",

    "§q": "font-family:var(--font-view)",
    "§w": "font-family:'Horror'",
    "§t": "font-family:'Handwritten'",
    "§u": "font-family:'Calligraphed'",

    "§k": "",
}


def _apply_mc_code(string, codes):
    obfuscated = False
    styles = [STYLES[code] for code in codes if code in STYLES]

    if "§k" in codes:
        obfuscated = True
        return f'<span style="{";".join(styles)}" class="MCOBF crucial">{string}</span>'
    else:
        return f'<span style="{";".join(styles)}">{string}</span>'


def _parse_mc_format(string):
    codes = re.findall(r"§.", string)
    indexes = [m.start() for m in re.finditer(r"§.", string)]
    string = re.sub(r"\n|\\n", "<br>", string)
    string = string.replace("§h", "<hr class='article-dv'>")

    final = []
    prev_index = 0

    for i, index in enumerate(indexes):
        if index != prev_index:
            final.append(_apply_mc_code(string[prev_index:index], codes[:i]))
        prev_index = index + 2

    if prev_index < len(string):
        final.append(_apply_mc_code(string[prev_index:], codes))

    return "".join(final)


def mc_formatTEXT(string):
    string = escape(string)
    string = string.replace("\n", "").replace("§v", "\n")

    parsed = _parse_mc_format(string)

    img_reg = re.compile(r"∫:IMG-S=([^-]+)-W=(\d+);∫")
    vid_reg = re.compile(r"∫:VIDEO-S=([^-]+)-W=(\d+);∫")
    link_reg = re.compile(r"#:LINK-H=(https?://(?:(?!-T=).)+)-T=((?:(?!;#).)*);#")

    parsed = img_reg.sub("", parsed)
    parsed = vid_reg.sub("", parsed)
    parsed = link_reg.sub("", parsed)

    return BS(parsed, "html.parser").text
