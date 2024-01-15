# called only once when failed phase 1
execute as @e[tag=!maxor_phase_2, tag=maxor_caught_phase_1] run tag @s add maxor_phase_1

execute as @e[tag=maxor_phase_1] run summon armor_stand 903 138 1064 {Tags: ["maxor_crystal_left", "maxor_crystal"]}
execute as @e[tag=maxor_phase_1] run summon armor_stand 945 138 1064 {Tags: ["maxor_crystal_right", "maxor_crystal"]}

execute as @e[tag=maxor_phase_1] run summon interaction 933 155 1054 {height: 2.01f, width: 2.01f, Tags: ["right_crystal_interaction", "crystal_interaction"]}
execute as @e[tag=maxor_phase_1] run summon interaction 915 155 1054 {height: 2.01f, width: 2.01f, Tags: ["left_crystal_interaction", "crystal_interaction"]}
execute as @e[tag=maxor_phase_1] run summon end_crystal 933 155 1054 {Tags: ["right_crystal_dummy", "crystal_dummy"], Invulnerable: 1b}
execute as @e[tag=maxor_phase_1] run summon end_crystal 915 155 1054 {Tags: ["left_crystal_dummy", "crystal_dummy"], Invulnerable: 1b}
execute as @e[tag=maxor_phase_1] run summon interaction 945 141 1064 {Tags: ["right_place_crystal_interaction", "place_crystal_interaction"], height: 2.0f}
execute as @e[tag=maxor_phase_1] run summon interaction 903 141 1064 {Tags: ["left_place_crystal_interaction", "place_crystal_interaction"], height: 2.0f}
summon text_display 933 157 1054 {billboard: "center", Tags: ["right_crystal_guide_text_display"], line_width: 110, text: '[{"text": "Energy ", "color": "aqua"}, {"text": "Crystal"}, {"text": " "}, {"text": "CLICK ", "color": "yellow", "bold": true}, {"text": "HERE", "color": "yellow", "bold": true}]'}
summon text_display 915 157 1054 {billboard: "center", Tags: ["left_crystal_guide_text_display"], line_width: 110, text: '[{"text": "Energy ", "color": "aqua"}, {"text": "Crystal"}, {"text": " "}, {"text": "CLICK ", "color": "yellow", "bold": true}, {"text": "HERE", "color": "yellow", "bold": true}]'}

execute as @e[tag=maxor_phase_1] at @s run title @a[distance=..200] times 1t 2s 1t
execute as @e[tag=maxor_phase_1] at @s run title @a[distance=..200] title {"text": ""}
execute as @e[tag=maxor_phase_1] at @s run title @a[distance=..200] subtitle {"text": "⚠ Maxor is enraged! ⚠", "color": "red"}
execute as @e[tag=maxor_phase_1] run scoreboard players set @s maxor_broken_crystals_count 0
execute as @e[tag=maxor_phase_1] run tag @s remove maxor_started_phase_1_fail_countdown
execute as @e[tag=maxor_phase_1] run tag @s remove maxor_caught_phase_1
execute as @e[tag=maxor_phase_1] run tag @s remove maxor_can_be_caught
execute as @e[tag=maxor_phase_1] run tag @s remove left_crystal_broken
execute as @e[tag=maxor_phase_1] run tag @s remove right_crystal_broken
execute as @e[tag=maxor_phase_1] run tag @s remove maxor_energy_charged
schedule function maxor:maxor_lightning_bolt 60t
