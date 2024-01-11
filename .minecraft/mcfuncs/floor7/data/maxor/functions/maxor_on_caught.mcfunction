# trap hitbox (maxor) 
execute as @e[tag=maxor_phase_1, tag=maxor_can_be_caught, x=923.8, y=141, z=1031.8, dx=0.4, dy=100, dz=0.4] run tag @s add maxor_caught_phase_1
execute as @e[tag=maxor_caught_phase_1] run tag @s remove maxor_phase_1
execute as @e[tag=maxor_phase_2, tag=maxor_can_be_caught, x=923.8, y=141, z=1031.8, dx=0.4, dy=100, dz=0.4] run tag @s add maxor_caught_phase_2
execute as @e[tag=maxor_caught_phase_2] run tag @s remove maxor_phase_2


execute as @e[tag=maxor_spawn_setup_done] unless entity @s[tag=maxor_caught_phase_1] unless entity @s[tag=maxor_caught_phase_2] run tag @s add cant_dealme
execute as @e[tag=maxor_spawn_setup_done] if entity @s[tag=maxor_caught_phase_1] run tag @s remove cant_dealme
execute as @e[tag=maxor_spawn_setup_done] if entity @s[tag=maxor_caught_phase_2] run tag @s remove cant_dealme

execute if entity @e[tag=maxor_caught_phase_1] run fill 924 139 1032 924 139 1032 red_stained_glass
execute if entity @e[tag=maxor_caught_phase_2] run fill 924 139 1032 924 139 1032 red_stained_glass
execute as @e[tag=maxor_can_be_caught] if entity @s[tag=!maxor_caught_phase_1, tag=!maxor_caught_phase_2] run fill 924 139 1032 924 139 1032 yellow_stained_glass
execute unless entity @e[tag=maxor_can_be_caught] run fill 924 139 1032 924 139 1032 black_stained_glass

execute as @e[tag=maxor_caught_phase_1, tag=!maxor_started_phase_1_fail_countdown] run schedule function maxor:maxor_phase_1_fail 200t
execute as @e[tag=maxor_caught_phase_1, tag=!maxor_started_phase_1_fail_countdown] run tag @s add maxor_started_phase_1_fail_countdown

execute as @e[tag=maxor_caught_phase_2, tag=!maxor_started_phase_2_fail_countdown] run schedule function maxor:maxor_phase_2_fail 200t
execute as @e[tag=maxor_caught_phase_2, tag=!maxor_started_phase_2_fail_countdown] run tag @s add maxor_started_phase_2_fail_countdown


execute as @e[tag=maxor_caught_phase_1, scores={Boss_Health=..399}] run tag @s add maxor_phase_2
execute as @e[tag=maxor_caught_phase_1, scores={Boss_Health=..399}] run tag @s remove maxor_energy_charged
execute as @e[tag=maxor_caught_phase_1, scores={Boss_Health=..399}] run tag @s remove maxor_crystal_spawned

# crystals
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] run summon armor_stand 903 138 1064 {Tags: ["maxor_crystal_left", "maxor_crystal"]}
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] run summon armor_stand 945 138 1064 {Tags: ["maxor_crystal_right", "maxor_crystal"]}

execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] run summon interaction 933 155 1054 {height: 2.01f, width: 2.01f, Tags: ["right_crystal_interaction", "crystal_interaction"]}
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] run summon interaction 915 155 1054 {height: 2.01f, width: 2.01f, Tags: ["left_crystal_interaction", "crystal_interaction"]}
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] run summon end_crystal 933 155 1054 {Tags: ["right_crystal_dummy", "crystal_dummy"], Invulnerable: 1b}
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] run summon end_crystal 915 155 1054 {Tags: ["left_crystal_dummy", "crystal_dummy"], Invulnerable: 1b}
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] run summon interaction 945 141 1064 {Tags: ["right_place_crystal_interaction", "place_crystal_interaction"], height: 2.0f}
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] run summon interaction 903 141 1064 {Tags: ["left_place_crystal_interaction", "place_crystal_interaction"], height: 2.0f}
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] run summon text_display 933 157 1054 {billboard: "center", Tags: ["right_crystal_guide_text_display"], line_width: 110, text: '[{"text": "Energy ", "color": "aqua"}, {"text": "Crystal"}, {"text": " "}, {"text": "CLICK ", "color": "yellow", "bold": true}, {"text": "HERE", "color": "yellow", "bold": true}]'}
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] run summon text_display 915 157 1054 {billboard: "center", Tags: ["left_crystal_guide_text_display"], line_width: 110, text: '[{"text": "Energy ", "color": "aqua"}, {"text": "Crystal"}, {"text": " "}, {"text": "CLICK ", "color": "yellow", "bold": true}, {"text": "HERE", "color": "yellow", "bold": true}]'}

execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] at @s run title @a[distance=..200] times 1t 2s 1t
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] at @s run title @a[distance=..200] title {"text": ""}
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] at @s run title @a[distance=..200] subtitle {"text": "⚠ Maxor is enraged! ⚠", "color": "red"}
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] run scoreboard players set @s maxor_broken_crystals_count 0
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] run tag @s add maxor_moveto_2ndtarget
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] run tag @s remove right_crystal_broken
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] run tag @s remove left_crystal_broken
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] run tag @s remove maxor_can_be_caught
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] run schedule function maxor:maxor_continue_phase_2 240t replace
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] run schedule function maxor:maxor_lightning_bolt 110t append
execute as @e[tag=maxor_phase_2, tag=!maxor_crystal_spawned] run schedule function maxor:maxor_lightning_bolt 220t append
execute as @e[tag=maxor_phase_2] if entity @e[tag=maxor_crystal] run tag @s add maxor_crystal_spawned
execute as @e[tag=maxor_phase_2] run tag @s remove maxor_caught_phase_1


execute unless entity @e[tag=maxor_crystal_right] if entity @e[tag=!right_crystal_broken, tag=maxor_spawn_setup_done] run tag @e[tag=right_energy_dummy] add right_energy_dummy_moving_to_left
execute unless entity @e[tag=maxor_crystal_right] if entity @e[tag=!right_crystal_broken, tag=maxor_spawn_setup_done] run tag @e[tag=right_energy_dummy] remove right_energy_dummy_waiting
execute unless entity @e[tag=maxor_crystal_left] if entity @e[tag=!left_crystal_broken, tag=maxor_spawn_setup_done] run tag @e[tag=left_energy_dummy] add left_energy_dummy_moving_to_front
execute unless entity @e[tag=maxor_crystal_left] if entity @e[tag=!left_crystal_broken, tag=maxor_spawn_setup_done] run tag @e[tag=left_energy_dummy] remove left_energy_dummy_waiting

execute unless entity @e[tag=maxor_crystal_right] if entity @e[tag=!right_crystal_broken, tag=maxor_spawn_setup_done] run scoreboard players add @e[tag=maxor_spawn_setup_done] maxor_broken_crystals_count 1
execute unless entity @e[tag=maxor_crystal_left] if entity @e[tag=!left_crystal_broken, tag=maxor_spawn_setup_done] run scoreboard players add @e[tag=maxor_spawn_setup_done] maxor_broken_crystals_count 1

execute unless entity @e[tag=maxor_crystal_right] if entity @e[tag=!right_crystal_broken, tag=maxor_spawn_setup_done, scores={maxor_broken_crystals_count=1}] as @e[tag=maxor_spawn_setup_done] at @s run title @a[distance=..200] times 1t 2s 1t
execute unless entity @e[tag=maxor_crystal_right] if entity @e[tag=!right_crystal_broken, tag=maxor_spawn_setup_done, scores={maxor_broken_crystals_count=1}] as @e[tag=maxor_spawn_setup_done] at @s run title @a[distance=..200] subtitle [{"text":"1","color":"red"},{"text":"/2 Energy Crystals are now active!","color":"green"}]
execute unless entity @e[tag=maxor_crystal_right] if entity @e[tag=!right_crystal_broken, tag=maxor_spawn_setup_done, scores={maxor_broken_crystals_count=1}] as @e[tag=maxor_spawn_setup_done] at @s run title @a[distance=..200] title {"text": ""}
execute unless entity @e[tag=maxor_crystal_right] if entity @e[tag=!right_crystal_broken, tag=maxor_spawn_setup_done, scores={maxor_broken_crystals_count=2}] as @e[tag=maxor_spawn_setup_done] at @s run title @a[distance=..200] subtitle {"text":"2/2 Energy Crystals are now active!","color":"green"}
execute unless entity @e[tag=maxor_crystal_right] if entity @e[tag=!right_crystal_broken, tag=maxor_spawn_setup_done, scores={maxor_broken_crystals_count=2}] as @e[tag=maxor_spawn_setup_done] at @s run title @a[distance=..200] title {"text": ""}

execute unless entity @e[tag=maxor_crystal_left] if entity @e[tag=!left_crystal_broken, tag=maxor_spawn_setup_done, scores={maxor_broken_crystals_count=1}] as @e[tag=maxor_spawn_setup_done] at @s run title @a[distance=..200] times 1t 2s 1t
execute unless entity @e[tag=maxor_crystal_left] if entity @e[tag=!left_crystal_broken, tag=maxor_spawn_setup_done, scores={maxor_broken_crystals_count=1}] as @e[tag=maxor_spawn_setup_done] at @s run title @a[distance=..200] subtitle [{"text":"1","color":"red"},{"text":"/2 Energy Crystals are now active!","color":"green"}]
execute unless entity @e[tag=maxor_crystal_left] if entity @e[tag=!left_crystal_broken, tag=maxor_spawn_setup_done, scores={maxor_broken_crystals_count=1}] as @e[tag=maxor_spawn_setup_done] at @s run title @a[distance=..200] title {"text": ""}
execute unless entity @e[tag=maxor_crystal_left] if entity @e[tag=!left_crystal_broken, tag=maxor_spawn_setup_done, scores={maxor_broken_crystals_count=2}] as @e[tag=maxor_spawn_setup_done] at @s run title @a[distance=..200] subtitle {"text":"2/2 Energy Crystals are now active!","color":"green"}
execute unless entity @e[tag=maxor_crystal_left] if entity @e[tag=!left_crystal_broken, tag=maxor_spawn_setup_done, scores={maxor_broken_crystals_count=2}] as @e[tag=maxor_spawn_setup_done] at @s run title @a[distance=..200] title {"text": ""}

execute unless entity @e[tag=maxor_crystal_right] run tag @e[tag=maxor_spawn_setup_done] add right_crystal_broken
execute unless entity @e[tag=maxor_crystal_left] run tag @e[tag=maxor_spawn_setup_done] add left_crystal_broken


execute as @e[tag=maxor_can_be_caught] unless entity @e[tag=maxor_crystal] run tag @s add maxor_energy_charged


execute as @e[tag=maxor_caught_phase_2, scores={Boss_Health=..20}] run tag @s add maxor_watching_ground

execute as @e[tag=maxor_watching_ground] at @s run tp @s ~ ~ ~ ~ 90
execute as @e[tag=maxor_watching_ground] run data merge entity @s {Health: 10.0f, Invulnerable: 1b}
execute if entity @e[tag=maxor_watching_ground, tag=!maxor_being_killed] run schedule function maxor:maxor_kill 6s append
execute as @e[tag=maxor_watching_ground, tag=!maxor_being_killed] run tag @s add maxor_being_killed
