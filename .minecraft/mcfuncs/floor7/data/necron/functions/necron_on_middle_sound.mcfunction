schedule function necron:necron_on_middle_sound 3s

execute as @e[tag=on_middle, tag=!dealme] at @s run playsound entity.wither.ambient hostile @a[x=860, y=-100, z=960, dx=160, dy=500, dz=140] ~ ~ ~ 10 0.8

execute as @e[tag=_waiting] at @s run playsound entity.wither.ambient hostile @a[x=860, y=-100, z=960, dx=160, dy=500, dz=140] ~ ~ ~ 10 0.8
