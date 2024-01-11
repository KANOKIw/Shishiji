schedule function maxor:maxor_tag_remove_skull_spam 120t

execute as @e[tag=maxor_spawn_setup_done, tag=!maxor_moveto_2ndtarget, tag=!maxor_moveto_skull_spam, tag=!maxor_caught_phase_1, tag=! maxor_caught_phase_2, tag=!maxor_watching_ground] run tag @s add maxor_moveto_skull_spam
