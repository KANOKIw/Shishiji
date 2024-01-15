execute as @e[tag=maxor_watching_ground] at @s run playsound entity.wither.death hostile @a[distance=..300] ~ ~ ~ 2 1
execute as @e[tag=maxor_watching_ground] at @s run summon armor_stand ~ ~ ~ {Tags: ["maxor_dead_body_dummy"]}
kill @e[tag=maxor_watching_ground]
kill @e[tag=right_crystal_guide_text_display]
kill @e[tag=left_crystal_guide_text_display]
execute as @e[tag=maxor_dead_body_dummy] at @s run kill @e[distance=..2, type=item, nbt={Item: {id: "minecraft:nether_star"}}]
execute as @e[tag=maxor_dead_body_dummy] run kill @s
bossbar remove maxor_health
