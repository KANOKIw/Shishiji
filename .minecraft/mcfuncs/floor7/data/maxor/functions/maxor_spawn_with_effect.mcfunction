kill @e[tag=maxor_crystal]
kill @e[tag=maxor_spawn_setup_done]
kill @e[tag=maxor_front_dummy]
kill @e[tag=confused_mark]
kill @e[tag=maxor_crystal]
kill @e[tag=crystal_dummy]
kill @e[tag=crystal_interaction]
kill @e[tag=place_crystal_interaction]
kill @e[tag=right_crystal_guide_text_display]
kill @e[tag=left_crystal_guide_text_display]
bossbar remove maxor_health
summon wither 924 156 1063 {NoAI: true, Tags: ["maxor_phase_0", "maxor_crystal_spawned", "maxor_spawn_setup_done", "maxor_on_spawn_effect", "floor7_boss", "cant_dealme"], CustomNameVisible:1b, CustomName:'[{"text":"﴾ ","color":"yellow","bold": true},{"text":"Maxor","color":"red","bold": true},{"text":" ﴿","color":"yellow","bold": true}]', Health: 149}
execute as @e[tag=maxor_phase_0] at @s run scoreboard players add @s maxor_health 0
execute as @e[tag=maxor_phase_0] at @s run summon armor_stand ~ ~ ~ {Invisible: true, NoGravity: true, Tags: ["maxor_front_dummy", "typeof_maxor_dummy"]}
summon armor_stand 926 150 1034 {Invisible: true, NoGravity: true, Tags: ["confused_mark"], ArmorItems:[{},{},{},{id:"minecraft:player_head",Count:1b,tag:{SkullOwner:{Id:[I;1467095237,664423467,-1694618179,1100904759],Properties:{textures:[{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWNjNThjYjU1YjFhMTFlNmQ4OGMyZDRkMWE2MzY2YzIzODg3ZGVlMjYzMDRiZGE0MTJjNGE1MTgyNWYxOTkifX19"}]}}}}]}
execute as @e[tag=maxor_phase_0] run scoreboard players set @s maxor_broken_crystals_count 0
execute unless entity @e[tag=maxor_above_maxor_target] run summon armor_stand ~ ~ ~ {Tags: ["maxor_above_maxor_target"], Invisible: true}
execute unless entity @e[tag=maxor_phase_2_target] run summon armor_stand ~ ~ ~ {Tags: ["maxor_phase_2_target"], Invisible: true}
bossbar add maxor_health [{"text":"Maxor","color":"red"}]
bossbar set maxor_health max 800
bossbar set maxor_health color red
execute store result bossbar maxor_health value run scoreboard players get @e[tag=maxor_spawn_setup_done, limit=1] maxor_health
execute as @e[tag=maxor_phase_0] run bossbar set maxor_health players @a[distance=..150]
execute as @e[tag=maxor_phase_0] run effect give @s resistance infinite 255 true
execute as @e[tag=maxor_phase_0] run scoreboard players set @s Boss_Health 800
execute as @e[tag=maxor_phase_0] store result bossbar maxor_health value run scoreboard players get @s Boss_Health

summon armor_stand 903 138 1064 {Tags: ["maxor_crystal_left", "maxor_crystal"]}
summon armor_stand 945 138 1064 {Tags: ["maxor_crystal_right", "maxor_crystal"]}

summon interaction 933 155 1054 {height: 2.01f, width: 2.01f, Tags: ["right_crystal_interaction", "crystal_interaction"]}
summon interaction 915 155 1054 {height: 2.01f, width: 2.01f, Tags: ["left_crystal_interaction", "crystal_interaction"]}
summon end_crystal 933 155 1054 {Tags: ["right_crystal_dummy", "crystal_dummy"], Invulnerable: 1b}
summon end_crystal 915 155 1054 {Tags: ["left_crystal_dummy", "crystal_dummy"], Invulnerable: 1b}
summon interaction 945 141 1064 {Tags: ["right_place_crystal_interaction", "place_crystal_interaction"], height: 2.0f}
summon interaction 903 141 1064 {Tags: ["left_place_crystal_interaction", "place_crystal_interaction"], height: 2.0f}
summon text_display 933 157 1054 {billboard: "center", Tags: ["right_crystal_guide_text_display"], line_width: 110, text: '[{"text": "Energy ", "color": "aqua"}, {"text": "Crystal"}, {"text": " "}, {"text": "CLICK ", "color": "yellow", "bold": true}, {"text": "HERE", "color": "yellow", "bold": true}]'}
summon text_display 915 157 1054 {billboard: "center", Tags: ["left_crystal_guide_text_display"], line_width: 110, text: '[{"text": "Energy ", "color": "aqua"}, {"text": "Crystal"}, {"text": " "}, {"text": "CLICK ", "color": "yellow", "bold": true}, {"text": "HERE", "color": "yellow", "bold": true}]'}

kill @e[tag=left_energy_dummy]
kill @e[tag=right_energy_dummy]

summon armor_stand 903 138 1062 {Tags: ["left_energy_dummy_waiting", "left_energy_dummy"], Invisible: true}
summon armor_stand 943 138 1064 {Tags: ["right_energy_dummy_waiting", "right_energy_dummy"], Invisible: true}

schedule function maxor:maxor_phase_0_to_1 8s
