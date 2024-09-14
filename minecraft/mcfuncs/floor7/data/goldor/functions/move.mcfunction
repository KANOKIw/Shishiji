## Goldor's Base Motion
execute as @e[tag=goldor, tag=phase_0, tag=!_go_fight] at @s run tp @s ~-0.3 ~ ~ 90 0
execute as @e[tag=goldor, tag=phase_0, tag=_go_fight] at @s run tp @s ~-0.8 ~ ~ 90 0
execute as @e[tag=goldor, tag=phase_0] at @s if entity @s[x=895, dx=1] run tag @s add phase_1
execute as @e[tag=goldor, tag=phase_1] run tag @s remove phase_0

execute as @e[tag=goldor, tag=phase_1, tag=!_go_fight, tag=!got_damaged] at @s run tp @s ~ ~ ~-0.075 180 0
execute as @e[tag=goldor, tag=phase_1, tag=!_go_fight, tag=got_damaged] at @s run tp @s ~ ~ ~0.025 180 0
execute as @e[tag=goldor, tag=phase_1, tag=_go_fight] at @s run tp @s ~ ~ ~-0.8 180 0
execute as @e[tag=goldor, tag=phase_1] at @s if entity @s[z=971, dz=1] run tag @s add phase_2
execute as @e[tag=goldor, tag=phase_2] run tag @s remove phase_1

execute as @e[tag=goldor, tag=phase_2, tag=!_go_fight, tag=!got_damaged] at @s run tp @s ~0.075 ~ ~ -90 0
execute as @e[tag=goldor, tag=phase_2, tag=!_go_fight, tag=got_damaged] at @s run tp @s ~-0.025 ~ ~ -90 0
execute as @e[tag=goldor, tag=phase_2, tag=_go_fight] at @s run tp @s ~0.8 ~ ~ -90 0
execute as @e[tag=goldor, tag=phase_2] at @s if entity @s[x=990, dx=1] run tag @s add phase_3
execute as @e[tag=goldor, tag=phase_3] run tag @s remove phase_2

execute as @e[tag=goldor, tag=phase_3, tag=!_go_fight, tag=!got_damaged] at @s run tp @s ~ ~ ~0.075 0 0
execute as @e[tag=goldor, tag=phase_3, tag=!_go_fight, tag=got_damaged] at @s run tp @s ~ ~ ~-0.025 0 0
execute as @e[tag=goldor, tag=phase_3, tag=_go_fight] at @s run tp @s ~ ~ ~0.8 0 0
execute as @e[tag=goldor, tag=phase_3] at @s if entity @s[z=1066, dz=1] run tag @s add phase_4
execute as @e[tag=goldor, tag=phase_4] run tag @s remove phase_3


    execute as @e[tag=goldor, tag=phase_4] at @s if entity @s[x=895, dx=1] run tag @s add phase_0
    execute as @e[tag=goldor, tag=phase_0] run tag @s remove phase_4

execute as @e[tag=goldor, tag=phase_4, tag=!_go_fight, tag=!got_damaged] at @s run tp @s ~-0.075 ~ ~ 90 0
execute as @e[tag=goldor, tag=phase_4, tag=!_go_fight, tag=got_damaged] at @s run tp @s ~0.025 ~ ~ 90 0
execute as @e[tag=goldor, tag=phase_4, tag=_go_fight] at @s if entity @s[x=941, dx=60] run tag @s add _go_right
execute as @e[tag=goldor, tag=phase_4, tag=_go_fight] at @s if entity @s[x=941, dx=-60] run tag @s add _go_left
    execute as @e[tag=_go_left] run tag @s remove _go_right
execute as @e[tag=goldor, tag=phase_4, tag=_go_fight, tag=_go_right] at @s run tp @s ~-0.5 ~ ~ 90 0
execute as @e[tag=goldor, tag=phase_4, tag=_go_fight, tag=_go_left] at @s run tp @s ~0.5 ~ ~ 90 0
execute as @e[tag=goldor, tag=phase_4, tag=_go_fight, tag=_go_right] at @s if entity @s[x=937, dx=1] run tag @s add phase_5
execute as @e[tag=goldor, tag=phase_4, tag=_go_fight, tag=_go_left] at @s if entity @s[x=943, dx=1] run tag @s add phase_5
execute as @e[tag=goldor, tag=phase_5] run tag @s remove phase_4

## FF
execute as @e[tag=goldor, tag=phase_5] at @s run tp @s ~ 35 ~-0.5 180 0
execute as @e[tag=goldor, tag=phase_5] at @s if entity @s[z=1050, dz=1] run tag @s add phase_6
execute as @e[tag=goldor, tag=phase_6] run tag @s remove phase_5

execute as @e[tag=goldor, tag=phase_6, tag=!_dead, tag=!_reached_limit_] at @s run tp @s ~ 34 ~-0.075 facing entity @p
execute as @e[tag=goldor, tag=!_dead] at @s run tp @e[tag=goldor_front_dummy] ^ ^ ^75

execute as @e[tag=goldor, scores={Boss_Health=..20}] run tag @s add _dead

execute as @e[tag=goldor, tag=_dead] at @s run tp @s ~ ~ ~ facing entity @e[tag=goldor_front_dummy, sort=nearest, limit=1]
execute as @e[tag=goldor, tag=_dead, tag=!_lovas_m] run schedule function goldor:_kill 7s
execute as @e[tag=goldor, tag=_dead, tag=!_lovas_m] run bossbar set goldor_health max 1500
execute as @e[tag=goldor, tag=_dead, tag=!_lovas_m] run tag @s add _lovas_m

## Only phase 5/6 can be damaged
execute as @e[tag=goldor, tag=!phase_5, tag=!phase_6] run tag @s add cant_dealme
execute as @e[tag=goldor, tag=phase_5] run tag @s remove cant_dealme
execute as @e[tag=goldor, tag=phase_6] run tag @s remove cant_dealme

## stores health on bossbar
execute as @e[tag=goldor] store result bossbar goldor_health value run scoreboard players get @s Boss_Health

## 
execute as @e[tag=goldor] if entity @a[x=920, y=20, z=985, dx=40, dy=55, dz=64] run tag @s add _go_fight
execute as @e[tag=goldor, tag=phase_6, x=935, y=25, z=990, dx=15, dy=15, dz=1] run tag @s add _reached_limit_
execute as @e[tag=_reached_limit_, tag=!_dead] at @s run tp @s ~ ~ ~ facing entity @p

## Motion of Goldor's swordst
execute as @e[tag=goldor_sword] at @s run tp @s ^0.2 ^ ^ facing entity @e[tag=goldor, sort=nearest, limit=1]
