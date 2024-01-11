execute as @e[tag=necron, tag=!on_middle, tag=!_waiting] at @s run tp @s ~ ~ ~ facing entity @p feet
execute as @e[tag=necron, tag=!on_middle, tag=!_waiting] at @s if entity @p[distance=3..20] unless entity @p[distance=..3] run tp @s ^ ^ ^0.2
execute as @e[tag=necron, tag=!on_middle, tag=!_waiting] at @s unless entity @p[distance=3..20] unless entity @p[distance=..3] if entity @p[distance=..40] run tp @s ^ ^ ^0.5
execute as @e[tag=necron, tag=!on_middle, tag=!_waiting] at @s if entity @p[distance=..3] run tag @s add necron_slow_shoot
execute as @e[tag=necron] at @s unless entity @p[distance=..3] run tag @s remove necron_slow_shoot

execute as @e[tag=necron, tag=_waiting] at @s run tp @s ~ ~ ~ facing entity @p

execute as @e[tag=necron, tag=!on_middle, tag=!necron_watching_ground] at @s run tp @e[tag=necorn_front_dummy, sort=nearest, limit=1] ^ ^ ^75

execute as @e[tag=necron] store result bossbar necron_health value run scoreboard players get @s Boss_Health


execute as @e[tag=necron, scores={Boss_Health=..800}, tag=!__knva, tag=!on_middle] run schedule clear necron:give_darkness
execute as @e[tag=necron, scores={Boss_Health=..800}, tag=!__knva, tag=!on_middle] run schedule clear necron:remove_darkness
execute as @e[tag=necron, scores={Boss_Health=..800}, tag=!__knva, tag=!on_middle] run schedule clear necron:remove_on_middle
execute as @e[tag=necron, scores={Boss_Health=..800}, tag=!__knva, tag=!on_middle] run schedule clear necron:on_middle
execute as @e[tag=necron, scores={Boss_Health=..800}, tag=!__knva, tag=!on_middle] run function necron:give_darkness

execute as @e[tag=necron, scores={Boss_Health=..800}, tag=!on_middle] run tag @s add __knva


execute as @e[tag=necron, scores={Boss_Health=..80}, tag=!_po_n, tag=!on_middle] run schedule clear necron:give_darkness
execute as @e[tag=necron, scores={Boss_Health=..80}, tag=!_po_n, tag=!on_middle] run schedule clear necron:remove_darkness
execute as @e[tag=necron, scores={Boss_Health=..80}, tag=!_po_n, tag=!on_middle] run schedule clear necron:remove_on_middle
execute as @e[tag=necron, scores={Boss_Health=..80}, tag=!_po_n, tag=!on_middle] run schedule clear necron:on_middle
execute as @e[tag=necron, scores={Boss_Health=..80}, tag=!_po_n, tag=!on_middle] run function necron:give_darkness

execute as @e[tag=necron, scores={Boss_Health=..80}, tag=!on_middle] run tag @s add _po_n


execute as @e[tag=necron, scores={Boss_Health=..20}] run tag @s add necron_watching_ground
execute as @e[tag=necron_watching_ground, tag=!__n_d] run schedule function necron:necron_kill 6s replace
execute as @e[tag=necron_watching_ground, tag=!__n_d] at @s run tp @s ~ ~ ~ ~ 89
execute as @e[tag=necron_watching_ground, tag=!__n_d] at @s run tp @e[tag=necorn_front_dummy, sort=nearest, limit=1] ^ ^ ^10
execute as @e[tag=necron_watching_ground] at @s run tp @s ~ ~ ~ facing entity @e[tag=necorn_front_dummy, sort=nearest, limit=1]
execute as @e[tag=necron_watching_ground] run schedule clear necron:remove_on_middle
execute as @e[tag=necron_watching_ground] run tag @s add __n_d
execute as @e[tag=necron_watching_ground] run tag @s add _dead
execute as @e[tag=necron_watching_ground] run bossbar set necron_health max 2000
execute as @e[tag=necron_watching_ground] run tag @s add cant_dealme


execute as @e[tag=necron] run effect give @s resistance infinite 255 true
