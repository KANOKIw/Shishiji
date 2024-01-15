schedule function goldor:summon_golden_sword 25t

execute as @e[tag=goldor, tag=cant_dealme] at @s unless score @s swords_summoned > 3 3 run summon minecraft:item_display ~ ~ ~ {Tags: ["goldor_sword", "nnea_swd"], item:{id:"minecraft:golden_sword",Count:1b},item_display:firstperson_righthand, transformation: [5.0f, 0f, 0f, -0.375f, 0f, 5.0f, 0f, -0.375f, 0f, 0f, 5.0f, -0.375f, 0f, 0f, 0f, 1f]}
execute as @e[tag=goldor, tag=cant_dealme] unless score @s swords_summoned > 3 3 run scoreboard players add @s swords_summoned 1

execute as @e[tag=nnea_swd] at @e[tag=goldor, sort=nearest, limit=1] run tp @s ^ ^ ^1

execute as @e[tag=goldor_sword] run tag @s remove nnea_swd

execute as @e[tag=goldor_sword] at @s unless entity @e[tag=goldor, tag=cant_dealme, distance=..3] run tag @s add _will_be_killed__
execute as @e[tag=_will_be_killed__] run scoreboard players set @e[tag=goldor, tag=cant_dealme] swords_summoned 2
execute as @e[tag=_will_be_killed__] run kill @s
