schedule function maxor:trap_work 15t

execute if entity @e[tag=maxor_can_be_caught] run execute as @a[x=924, y=141, z=1032, dx=0.5, dy=100, dz=0.5, limit=1] run damage @s 4 thrown
execute if entity @e[tag=maxor_can_be_caught] run playsound entity.ender_dragon.shoot block @a 924 144 1032 1 0.8
execute if entity @e[tag=maxor_can_be_caught] run particle flame 924 144 1032 0.5 1 0.5 0 30 force @a
