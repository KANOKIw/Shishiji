schedule function necron:remove_on_middle 20s

execute as @e[tag=necron] run tag @s add on_middle
execute as @e[tag=on_middle] run tp @s 943 -17 1029 facing entity @e[tag=necorn_front_dummy, sort=nearest, limit=1]
execute as @e[tag=on_middle] run scoreboard players set @s fire_circle_cycle 0
execute as @e[tag=necron] at @s run schedule function necron:remove_darkness 30t
