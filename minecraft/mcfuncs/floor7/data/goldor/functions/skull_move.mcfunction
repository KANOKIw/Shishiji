execute as @e[tag=goldor_skull] at @s run tp @s ^ ^ ^0.8
execute as @e[tag=goldor_skull] at @s unless block ~ ~ ~ air unless block ~ ~ ~ lava run particle minecraft:explosion_emitter ~ ~ ~ 0 0 0 1 1 force
execute as @e[tag=goldor_skull] at @s unless block ~ ~ ~ air unless block ~ ~ ~ lava run playsound entity.generic.explode block @a ~ ~ ~ 2 1
execute as @e[tag=goldor_skull] at @s unless block ~ ~ ~ air unless block ~ ~ ~ lava run execute as @a[distance=..3] run damage @s 2 arrow by @e[tag=goldor_skull, sort=nearest, limit=1]
execute as @e[tag=goldor_skull] at @s unless block ~ ~ ~ air unless block ~ ~ ~ lava run execute as @a[distance=..3, gamemode=!spectator, gamemode=!creative] at @s run playsound entity.player.hurt player @s ~ ~ ~
execute as @e[tag=goldor_skull] at @s unless block ~ ~ ~ air unless block ~ ~ ~ lava run kill @s

execute as @e[tag=goldor_skull] at @s if entity @e[type=minecraft:player, distance=..3] run particle minecraft:explosion_emitter ~ ~ ~ 0 0 0 1 1 force
execute as @e[tag=goldor_skull] at @s if entity @e[type=minecraft:player, distance=..3] run playsound entity.generic.explode block @a ~ ~ ~ 2 1
execute as @e[tag=goldor_skull] at @s run execute as @a[distance=..3] run damage @s 2 arrow by @e[tag=goldor_skull, sort=nearest, limit=1]
execute as @e[tag=goldor_skull] at @s run execute as @a[distance=..3, gamemode=!spectator, gamemode=!creative] at @s run playsound entity.player.hurt player @s ~ ~ ~
execute as @e[tag=goldor_skull] at @s if entity @e[type=minecraft:player, distance=..3] run kill @s


execute as @e[tag=goldor_skull_spamed] at @s run tp @s ^ ^ ^1.4
execute as @e[tag=goldor_skull_spamed] at @s unless block ~ ~ ~ air unless block ~ ~ ~ lava run particle minecraft:explosion_emitter ~ ~ ~ 0 0 0 1 1 force
execute as @e[tag=goldor_skull_spamed] at @s unless block ~ ~ ~ air unless block ~ ~ ~ lava run playsound entity.generic.explode block @a ~ ~ ~ 2 1
execute as @e[tag=goldor_skull_spamed] at @s unless block ~ ~ ~ air unless block ~ ~ ~ lava run execute as @a[distance=..3] run damage @s 2 arrow by @e[tag=goldor_skull_spamed, sort=nearest, limit=1]
execute as @e[tag=goldor_skull_spamed] at @s unless block ~ ~ ~ air unless block ~ ~ ~ lava run execute as @a[distance=..3, gamemode=!spectator, gamemode=!creative] at @s run playsound entity.player.hurt player @s ~ ~ ~
execute as @e[tag=goldor_skull_spamed] at @s unless block ~ ~ ~ air unless block ~ ~ ~ lava run kill @s

execute as @e[tag=goldor_skull_spamed] at @s if entity @e[type=minecraft:player, distance=..3] run particle minecraft:explosion_emitter ~ ~ ~ 0 0 0 1 1 force
execute as @e[tag=goldor_skull_spamed] at @s if entity @e[type=minecraft:player, distance=..3] run playsound entity.generic.explode block @a ~ ~ ~ 2 1
execute as @e[tag=goldor_skull_spamed] at @s run execute as @a[distance=..3] run damage @s 2 arrow by @e[tag=goldor_skull_spamed, sort=nearest, limit=1]
execute as @e[tag=goldor_skull_spamed] at @s run execute as @a[distance=..3, gamemode=!spectator, gamemode=!creative] at @s run playsound entity.player.hurt player @s ~ ~ ~
execute as @e[tag=goldor_skull_spamed] at @s if entity @e[type=minecraft:player, distance=..3] run kill @s


execute as @e[tag=goldor] at @e[tag=goldor_skull, distance=80..] run kill @e[tag=goldor_skull, distance=80..]
execute as @e[tag=goldor] at @e[tag=goldor_skull_spamed, distance=80..] run kill @e[tag=goldor_skull_spamed, distance=80..]

execute as @e[tag=goldor_skull] at @s run particle smoke ~ ~1.7 ~
execute as @e[tag=goldor_skull_spamed] at @s run particle smoke ~ ~1.7 ~
