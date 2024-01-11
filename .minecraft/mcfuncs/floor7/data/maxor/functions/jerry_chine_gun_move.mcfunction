execute as @e[tag=small_jerry] at @s run tp @s ^ ^ ^-0.8
execute as @e[tag=small_jerry] at @s unless block ~ ~1.2 ~ air unless block ~ ~1.2 ~ lava run tag @s add small_jerry_will_be_killed
execute as @e[tag=small_jerry] at @s if entity @e[distance=..1, type=!player, type=!interaction, type=!armor_stand, nbt=!{Invisible: 1b}] run tag @s add small_jerry_will_be_killed
execute as @e[tag=small_jerry] at @s if entity @e[distance=..2, type=wither] run tag @s add small_jerry_will_be_killed
execute as @e[tag=small_jerry] at @s unless entity @a[distance=..100] run tag @s add small_jerry_will_be_killed
execute as @e[tag=small_jerry_will_be_killed] at @s run particle cloud ~ ~2 ~ 0 0 0 0.05 5 force @a
execute as @e[tag=small_jerry_will_be_killed] at @s run tag @p add jerry_chine_gun_knockback

execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled, x=860, y=-100, z=960, dx=160, dy=500, dz=140] at @s run summon tnt ^ ^ ^2

execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] at @s run execute as @e[distance=0.01..2, type=!player] run damage @s 2

#execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] at @s run execute as @p[tag=jerry_chine_gun_knockback, distance=..3] at @s run summon armor_stand ^ ^ ^-1 {Invisible: true, Tags: ["jerry_chine_gun_knockback_dummy"]}
#execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] run scoreboard players set @s small_jerry_will_be_killed_X 0
#execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] run scoreboard players set @s small_jerry_will_be_killed_Y 0
#execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] run scoreboard players set @s small_jerry_will_be_killed_Z 0
#execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] at @s run execute as @e[tag=jerry_chine_gun_knockback_dummy, distance=..2] run scoreboard players set @s jerry_chine_gun_knockback_dummy_X 0
#execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] at @s run execute as @e[tag=jerry_chine_gun_knockback_dummy, distance=..2] run scoreboard players set @s jerry_chine_gun_knockback_dummy_Y 0
#execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] at @s run execute as @e[tag=jerry_chine_gun_knockback_dummy, distance=..2] run scoreboard players set @s jerry_chine_gun_knockback_dummy_Z 0
#execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] at @s store result score @s small_jerry_will_be_killed_X run data get entity @s Pos[0] 1000
#execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] at @s store result score @s small_jerry_will_be_killed_Y run data get entity @s Pos[1] 1000
#execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] at @s store result score @s small_jerry_will_be_killed_Z run data get entity @s Pos[2] 1000
#execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] at @s run execute as @e[tag=jerry_chine_gun_knockback_dummy, distance=..2] at @s store result score @s jerry_chine_gun_knockback_dummy_X run data get entity @s Pos[0] 1000
#execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] at @s run execute as @e[tag=jerry_chine_gun_knockback_dummy, distance=..2] at @s store result score @s jerry_chine_gun_knockback_dummy_Y run data get entity @s Pos[1] 1000
#execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] at @s run execute as @e[tag=jerry_chine_gun_knockback_dummy, distance=..2] at @s store result score @s jerry_chine_gun_knockback_dummy_Z run data get entity @s Pos[2] 1000

#execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] at @s run execute as @e[tag=jerry_chine_gun_knockback_dummy, distance=..2] at @s store result entity @s Motion[0] double -0.001 run scoreboard players operation @s jerry_chine_gun_knockback_dummy_X -= @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] small_jerry_will_be_killed_X
#execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] at @s run execute as @e[tag=jerry_chine_gun_knockback_dummy, distance=..2] at @s store result entity @s Motion[1] double -0.001 run scoreboard players operation @s jerry_chine_gun_knockback_dummy_Y -= @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] small_jerry_will_be_killed_Y
#execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] at @s run execute as @e[tag=jerry_chine_gun_knockback_dummy, distance=..2] at @s store result entity @s Motion[2] double -0.001 run scoreboard players operation @s jerry_chine_gun_knockback_dummy_Z -= @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] small_jerry_will_be_killed_Z

#execute as @e[tag=small_jerry_will_be_killed] at @s run execute as @e[tag=jerry_chine_gun_knockback_dummy, distance=..2] at @s run tp @p[tag=jerry_chine_gun_knockback, distance=..3] ~ ~ ~

execute as @e[tag=jerry_chine_gun_knockback_dummy, tag=!jerry_chine_gun_knockback_dummy_scheduled] run schedule function maxor:jerry_chine_gun_dummy_kill 15t append
execute as @e[tag=jerry_chine_gun_knockback_dummy, tag=!jerry_chine_gun_knockback_dummy_scheduled] run tag @s add jerry_chine_gun_knockback_dummy_scheduled

execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] run schedule function maxor:jerry_chine_gun_kill 2t append
execute as @e[tag=small_jerry_will_be_killed, tag=!small_jerry_will_be_killed_scheduled] run tag @s add small_jerry_will_be_killed_scheduled

execute as @e[tag=jerry_chine_gun_knockback] at @s run tag @p remove jerry_chine_gun_knockback
