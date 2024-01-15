execute as @e[tag=maxor_fireball] at @s run tp @s ^ ^ ^1.8

execute as @e[tag=maxor_fireball] at @s unless block ~ ~ ~ air unless block ~ ~ ~ lava run particle minecraft:explosion_emitter ~ ~ ~ 0 0 0 1 3 force @a
execute as @e[tag=maxor_fireball] at @s unless block ~ ~ ~ air unless block ~ ~ ~ lava run playsound entity.generic.explode block @a ~ ~ ~ 2 0.6
execute as @e[tag=maxor_fireball] at @s unless block ~ ~ ~ air unless block ~ ~ ~ lava run damage @e[type=minecraft:player, distance=..2, sort=nearest, limit=1] 3 arrow by @s
execute as @e[tag=maxor_fireball] at @s unless block ~ ~ ~ air unless block ~ ~ ~ lava run kill @s

execute as @e[tag=maxor_fireball] at @s if entity @e[type=minecraft:player, distance=..2] run particle minecraft:explosion_emitter ~ ~ ~ 0 0 0 1 3 force
execute as @e[tag=maxor_fireball] at @s if entity @e[type=minecraft:player, distance=..2] run playsound entity.generic.explode block @a ~ ~ ~ 2 0.6
execute as @e[tag=maxor_fireball] at @s if entity @e[type=minecraft:player, distance=..2] run damage @e[type=minecraft:player, distance=..1, sort=nearest, limit=1] 3 arrow by @s
execute as @e[tag=maxor_fireball] at @s if entity @e[type=minecraft:player, distance=..2] run kill @s

