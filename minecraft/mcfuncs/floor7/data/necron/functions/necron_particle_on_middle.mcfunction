schedule function necron:necron_particle_on_middle 1s

execute as @e[tag=on_middle, tag=cant_dealme, tag=!necron_watching_ground] at @s run particle explosion_emitter ~ ~ ~ 0 0 0 1 3 force @a
execute as @e[tag=on_middle, tag=cant_dealme, tag=!necron_watching_ground] at @s run playsound entity.generic.explode block @a[x=860, y=-100, z=960, dx=160, dy=500, dz=140] ~ ~ ~ 10 0.5
