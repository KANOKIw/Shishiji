execute as @a[x=860, y=-100, z=960, dx=160, dy=500, dz=140] run scoreboard players add @s jump_scale 1
execute as @a[x=860, y=-100, z=960, dx=160, dy=500, dz=140] if score @s jump_scale > 4 4 run scoreboard players set @s jump_scale 0

execute as @a[x=860, y=-100, z=960, dx=160, dy=500, dz=140] at @s if block ~ ~ ~ lava run tag @s add __jla
execute as @a[tag=__jla] at @s run damage @s 3.5 lava
execute as @a[tag=__jla] at @s run tp @s ~ ~1 ~
execute as @a[tag=__jla, scores={jump_scale=0}] run effect give @s levitation 1 15 true
execute as @a[tag=__jla, scores={jump_scale=1}] run effect give @s levitation 1 25 true
execute as @a[tag=__jla, scores={jump_scale=2}] run effect give @s levitation 1 30 true
execute as @a[tag=__jla, scores={jump_scale=3}] run effect give @s levitation 1 35 true
execute as @a[tag=__jla] run tag @s remove __jla
