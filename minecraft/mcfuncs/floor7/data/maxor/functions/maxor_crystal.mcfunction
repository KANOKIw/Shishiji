execute as @e[tag=maxor_crystal_left] run data modify entity @s BeamTarget.X set from entity @e[type=wither, sort=nearest, limit=1] Pos[0]
execute as @e[tag=maxor_crystal_left] run data modify entity @s BeamTarget.Y set from entity @e[type=wither, sort=nearest, limit=1] Pos[1]
execute as @e[tag=maxor_crystal_left] run data modify entity @s BeamTarget.Z set from entity @e[type=wither, sort=nearest, limit=1] Pos[2]

execute as @e[tag=maxor_crystal_right] run data modify entity @s BeamTarget.X set from entity @e[type=wither, sort=nearest, limit=1] Pos[0]
execute as @e[tag=maxor_crystal_right] run data modify entity @s BeamTarget.Y set from entity @e[type=wither, sort=nearest, limit=1] Pos[1]
execute as @e[tag=maxor_crystal_right] run data modify entity @s BeamTarget.Z set from entity @e[type=wither, sort=nearest, limit=1] Pos[2]


