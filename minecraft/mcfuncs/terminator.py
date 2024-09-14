c = f"execute as @s at @s run playsound minecraft:entity.guardian.death master @a ~ ~ ~ 1 2\n\n"
for i in range(2, 200):
    c = c + f"execute as @s at @s positioned ^ ^ ^{i/2} run particle dust 0.94 0 0 1 ~ ~1.1 ~ 0 0 0 0 4 force @a\n"
    c = c + f"execute as @s at @s positioned ^0.1 ^ ^{i/2} run particle minecraft:dripping_lava ~ ~1.1 ~ 0 0 0 0 1 force @a\n"
    c = c + f"execute as @s at @s positioned ^ ^ ^{i/2} run execute as @e[type=!interaction, type=!player, type=!item, type=!arrow, type=!enderman, type=!ender_dragon, distance=..1.5] run damage @s 45 arrow\n"
    c = c + f"execute as @s at @s positioned ^ ^ ^{i/2} run execute as @e[type=enderman, distance=..1.5] run damage @s 45 explosion by @p\n"
    c = c + f"execute as @s at @s positioned ^ ^ ^{i/2} run execute as @e[type=ender_dragon, distance=..3] run damage @s 15 explosion by @p\n\n"
    if i > 2:
        c = c + f"execute as @s at @s positioned ^ ^ ^{i/2} run execute as @e[type=player, distance=..1] run damage @s 2 arrow by @p\n\n"

c = c + f"execute as @e[tag=last_salvation_dummy] run tag @s remove last_salvation_dummy\n"
with open(r"world\datapacks\items\data\items\functions\salvation.mcfunction", "w") as f:
    f.write(c)


exit()
