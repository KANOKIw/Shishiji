import numpy, os

__path = r"servers\super-flat\world\datapacks\floor7\data\necron\functions\circle_fire.mcfunction"
_l = f"schedule function necron:{os.path.basename(__path).replace('.mcfunction', '')} 1s"
sc_mp = [-2, -1]
for r in range(6, -1, -1):
    sc_mp[0] += 2; sc_mp[1] += 2
    _l += f"\n\n"
    for x in range(-10*r-1, 10*r+2, 4):
        x = x/10
        y = numpy.sqrt(abs(r**2 - x**2))
        _l += f"execute as @e[tag=on_middle, scores={{fire_circle_cycle={sc_mp[0]}..{sc_mp[1]}}}] at @s run particle flame ~{x} ~0.5 ~{y} 0 0 0 0 5 force @a\n"
        _l += f"execute as @e[tag=on_middle, scores={{fire_circle_cycle={sc_mp[0]}..{sc_mp[1]}}}] at @s run particle flame ~{x} ~0.5 ~{-y} 0 0 0 0 5 force @a\n"
        _l += f"execute as @e[tag=on_middle, scores={{fire_circle_cycle={sc_mp[0]}..{sc_mp[1]}}}] at @s run execute as @a[distance=..{r}] run damage @s 2.5 wither\n"

_l += f"\n\nexecute as @e[tag=on_middle] run scoreboard players add @s fire_circle_cycle 1\n"
with open(__path, "w") as f:
    f.write(_l)

__path = r"servers\super-flat\world\datapacks\floor7\data\maxor\functions\mage_beam.mcfunction"
_l = ""
for i in range(0, 128):
    _l += f"execute as @s at @s anchored eyes run particle firework ^-0.4 ^-0.5 ^{i/4} 0 0 0 0 1 force @a\n"
    _l += f"execute as @s at @s positioned ^-0.4 ^-0.5 ^{i/4} run execute as @e[type=!interaction, type=!wither, type=!player, type=!item, type=!arrow, type=!enderman, type=!ender_dragon, distance=..1.5] run damage @s 25 arrow\n"
    _l += f"execute as @s at @s positioned ^-0.4 ^-0.5 ^{i/4} run execute as @e[type=enderman, distance=..1.5] run damage @s 30 magic\n"
    _l += f"execute as @s at @s positioned ^-0.4 ^-0.5 ^{i/4} run execute as @e[type=wither, distance=..2] run damage @s 10 magic\n"
    _l += f"execute as @s at @s positioned ^-0.4 ^-0.5 ^{i/4} run execute as @e[type=ender_dragon, distance=..3] run damage @s 10 magic\n"
    _l += f"execute as @s at @s positioned ^-0.4 ^-0.5 ^{i/4} run execute as @e[tag=floor7_boss, distance=..2, tag=!got_mage_beam_dmged] unless entity @s[tag=cant_dealme] run scoreboard players remove @s Boss_Health 2\n"
    _l += f"execute as @s at @s positioned ^-0.4 ^-0.5 ^{i/4} run execute as @e[tag=floor7_boss, distance=..2, tag=!got_mage_beam_dmged] unless entity @s[tag=cant_dealme] run tag @s add got_mage_beam_dmged\n"
_l += f"tag @s remove will_mage_beam\n"
_l += f"execute as @e[tag=floor7_boss] run tag @s remove got_mage_beam_dmged\n"
with open(__path, "w") as f:
    f.write(_l)

__path = r"servers\super-flat\world\datapacks\floor7\data\fx\functions\x2_2.mcfunction"
_l = ""
for x in range(-100, 100):
    x = x/15
    y = x**2 + 3*x
    _l += f"execute as @s at @s run particle dripping_lava ~{x} ~ ~{y} 0 0 0 0 1 force\n"
    _l += f"execute as @s at @s run particle dripping_lava ~{-x} ~ ~{-y} 0 0 0 0 1 force\n"
with open(__path, "w") as f:
    f.write(_l)

__path = r"servers\super-flat\world\datapacks\floor7\data\fx\functions\circle.mcfunction"
_l = ""
for r in range(0, 10):
    for x in range(-10*r-1, 10*r+2):
        x = x/10
        z = numpy.sqrt(abs(r**2 - x**2))
        for y in range(-1, 4):
            _l += f"execute as @s at @s run particle witch ~{x} ~{y} ~{z}\n"
            _l += f"execute as @s at @s run particle witch ~{-x} ~{y} ~{-z}\n"
        
with open(__path, "w") as f:
    f.write(_l)
