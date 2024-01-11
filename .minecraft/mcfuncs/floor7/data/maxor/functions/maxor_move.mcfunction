execute as @e[tag=maxor_phase_1, tag=!maxor_moveto_2ndtarget, tag=!maxor_moveto_skull_spam] at @s run tp @s ~ ~ ~ facing entity @p feet
execute as @e[tag=maxor_phase_1, tag=!maxor_moveto_2ndtarget, tag=!maxor_moveto_skull_spam] at @s if entity @p[distance=3..20] unless entity @p[distance=..3] run tp @s ^ ^ ^0.2
execute as @e[tag=maxor_phase_1, tag=!maxor_moveto_2ndtarget, tag=!maxor_moveto_skull_spam] at @s unless entity @p[distance=3..20] unless entity @p[distance=..3] if entity @p[distance=..40] run tp @s ^ ^ ^0.5
execute as @e[tag=maxor_phase_1, tag=!maxor_moveto_2ndtarget, tag=!maxor_moveto_skull_spam, tag=!maxor_caught_phase_1] at @s if entity @p[distance=..3] run tag @s add maxor_slow_shoot
execute as @e[tag=maxor_phase_1, tag=!maxor_moveto_2ndtarget, tag=!maxor_moveto_skull_spam, tag=!maxor_caught_phase_1, x=917, y=147, z=1026, dx=13, dy=100, dz=12] at @s run tp @s ~ ~-0.4 ~
execute as @e[tag=maxor_phase_1, tag=!maxor_moveto_2ndtarget, tag=!maxor_moveto_skull_spam, tag=!maxor_caught_phase_1, x=917, y=150, z=1038, dx=13, dy=100, dz=6] at @s run tp @s ~ ~-0.2 ~
execute as @e[tag=maxor_spawn_setup_done] at @s unless entity @p[distance=..3] run tag @s remove maxor_slow_shoot


execute as @e[tag=maxor_phase_2, tag=!maxor_moveto_2ndtarget, tag=!maxor_moveto_skull_spam] at @s run tp @s ~ ~ ~ facing entity @p feet
execute as @e[tag=maxor_phase_2, tag=!maxor_moveto_2ndtarget, tag=!maxor_moveto_skull_spam] at @s if entity @p[distance=3..20] unless entity @p[distance=..3] run tp @s ^ ^ ^0.1
execute as @e[tag=maxor_phase_2, tag=!maxor_moveto_2ndtarget, tag=!maxor_moveto_skull_spam] at @s unless entity @p[distance=3..20] unless entity @p[distance=..3] if entity @p[distance=..40] run tp @s ^ ^ ^0.5
execute as @e[tag=maxor_phase_2, tag=!maxor_moveto_2ndtarget, tag=!maxor_moveto_skull_spam, tag=!maxor_caught_phase_2] at @s if entity @p[distance=..3] run tag @s add maxor_slow_shoot
execute as @e[tag=maxor_phase_2, tag=!maxor_moveto_2ndtarget, tag=!maxor_moveto_skull_spam, tag=!maxor_caught_phase_2, x=917, y=147, z=1026, dx=13, dy=100, dz=12] at @s run tp @s ~ ~-0.4 ~
execute as @e[tag=maxor_phase_2, tag=!maxor_moveto_2ndtarget, tag=!maxor_moveto_skull_spam, tag=!maxor_caught_phase_2, x=917, y=150, z=1038, dx=13, dy=100, dz=6] at @s run tp @s ~ ~-0.2 ~
execute as @e[tag=maxor_spawn_setup_done] at @s unless entity @p[distance=..3] run tag @s remove maxor_slow_shoot


execute as @e[tag=maxor_moveto_2ndtarget] at @s run tp @s ^ ^ ^0.5 facing entity @e[tag=maxor_phase_2_target, sort=nearest, limit=1]
execute as @e[tag=maxor_moveto_2ndtarget] at @s if entity @e[tag=maxor_phase_2_target, distance=..3] run tag @s add maxor_phase_2_fireball

execute as @e[tag=maxor_moveto_skull_spam] at @s unless entity @e[tag=maxor_above_maxor_target, distance=..1] run tp @s ^ ^ ^1 facing entity @e[tag=maxor_above_maxor_target, sort=nearest, limit=1]
execute as @e[tag=maxor_moveto_skull_spam] at @s if entity @e[tag=maxor_above_maxor_target, distance=..1] run tp @s ~ ~ ~ facing entity @p[distance=..100]

execute as @e[tag=maxor_caught_phase_1] at @s run tp @s ~ ~ ~ facing entity @e[tag=maxor_front_dummy, sort=nearest, limit=1]
execute as @e[tag=maxor_caught_phase_2] at @s run tp @s ~ ~ ~ facing entity @e[tag=maxor_front_dummy, sort=nearest, limit=1]