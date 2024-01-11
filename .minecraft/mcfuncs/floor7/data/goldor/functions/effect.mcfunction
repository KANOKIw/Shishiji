schedule function goldor:effect 1s

execute as @e[tag=goldor, tag=!_dead] at @s run particle explosion ~ ~1 ~ 0 0 0 7 25 force @a[distance=0.01..]
execute as @e[tag=goldor, tag=!_dead] at @s run playsound entity.generic.explode block @a ~ ~ ~ 3 0.5
execute as @e[tag=goldor, tag=!_dead] at @s run execute as @a[distance=..10] run damage @s 8 magic by @e[tag=goldor, sort=nearest, limit=1]
