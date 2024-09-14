schedule function necron:necron_tnt 7s

execute as @e[tag=necron, tag=!necron_watching_ground, tag=!on_middle, tag=!_waiting] at @s run summon tnt ~ ~ ~ {Fuse: 25s}
