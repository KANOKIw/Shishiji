schedule function maxor:__per_sec 1s

execute as @a[nbt=!{SelectedItem: {id: "minecraft:iron_sword", tag: {CustomTag: 0, Tags: ["maxed_hyperion"]}}}, tag=added_maxed_hyperion_mana] run scoreboard players operation @s mana_max = @s previous_mana_max
execute as @a[nbt=!{SelectedItem: {id: "minecraft:iron_sword", tag: {CustomTag: 0, Tags: ["maxed_hyperion"]}}}, tag=added_maxed_hyperion_mana] run tag @s remove added_maxed_hyperion_mana
execute as @a[nbt=!{SelectedItem: {id: "minecraft:iron_sword", tag: {CustomTag: 100, Tags: ["raw_hyperion"]}}}, tag=added_raw_hyperion_mana] run scoreboard players operation @s mana_max = @s previous_mana_max
execute as @a[nbt=!{SelectedItem: {id: "minecraft:iron_sword", tag: {CustomTag: 100, Tags: ["raw_hyperion"]}}}, tag=added_raw_hyperion_mana] run tag @s remove added_raw_hyperion_mana
execute as @a[nbt=!{SelectedItem: {id: "minecraft:golden_horse_armor", tag: {Tags: ["raw_jerry_chine_gun"]}}}, tag=added_raw_jerry_chine_gun_mana] run scoreboard players operation @s mana_max = @s previous_mana_max
execute as @a[nbt=!{SelectedItem: {id: "minecraft:golden_horse_armor", tag: {Tags: ["raw_jerry_chine_gun"]}}}, tag=added_raw_jerry_chine_gun_mana] run tag @s remove added_raw_jerry_chine_gun_mana
execute as @a[nbt=!{SelectedItem: {id: "minecraft:golden_horse_armor", tag: {Tags: ["maxed_jerry_chine_gun"]}}}, tag=added_maxed_jerry_chine_gun_mana] run scoreboard players operation @s mana_max = @s previous_mana_max
execute as @a[nbt=!{SelectedItem: {id: "minecraft:golden_horse_armor", tag: {Tags: ["maxed_jerry_chine_gun"]}}}, tag=added_maxed_jerry_chine_gun_mana] run tag @s remove added_maxed_jerry_chine_gun_mana
execute as @a[nbt=!{SelectedItem: {id: "minecraft:diamond_shovel", tag: {Tags: ["aotv"]}}}, tag=added_aotv_mana] run scoreboard players operation @s mana_max = @s previous_mana_max
execute as @a[nbt=!{SelectedItem: {id: "minecraft:diamond_shovel", tag: {Tags: ["aotv"]}}}, tag=added_aotv_mana] run tag @s remove added_aotv_mana



execute as @a[nbt={SelectedItem: {id: "minecraft:iron_sword", tag: {CustomTag: 0, Tags: ["maxed_hyperion"]}}}, tag=!added_maxed_hyperion_mana] run scoreboard players operation @s previous_mana_max = @s mana_max
execute as @a[nbt={SelectedItem: {id: "minecraft:iron_sword", tag: {CustomTag: 0, Tags: ["maxed_hyperion"]}}}, tag=!added_maxed_hyperion_mana] run scoreboard players operation @s mana_max += 632 632
execute as @a[nbt={SelectedItem: {id: "minecraft:iron_sword", tag: {CustomTag: 0, Tags: ["maxed_hyperion"]}}}, tag=!added_maxed_hyperion_mana] run tag @s add added_maxed_hyperion_mana
execute as @a[nbt={SelectedItem: {id: "minecraft:iron_sword", tag: {CustomTag: 100, Tags: ["raw_hyperion"]}}}, tag=!added_raw_hyperion_mana] run scoreboard players operation @s previous_mana_max = @s mana_max
execute as @a[nbt={SelectedItem: {id: "minecraft:iron_sword", tag: {CustomTag: 100, Tags: ["raw_hyperion"]}}}, tag=!added_raw_hyperion_mana] run scoreboard players operation @s mana_max += 350 350
execute as @a[nbt={SelectedItem: {id: "minecraft:iron_sword", tag: {CustomTag: 100, Tags: ["raw_hyperion"]}}}, tag=!added_raw_hyperion_mana] run tag @s add added_raw_hyperion_mana



execute as @a[nbt={SelectedItem: {id: "minecraft:golden_horse_armor", tag: {Tags: ["raw_jerry_chine_gun"]}}}, tag=!added_raw_jerry_chine_gun_mana] run scoreboard players operation @s previous_mana_max = @s mana_max
execute as @a[nbt={SelectedItem: {id: "minecraft:golden_horse_armor", tag: {Tags: ["raw_jerry_chine_gun"]}}}, tag=!added_raw_jerry_chine_gun_mana] run scoreboard players operation @s mana_max += 200 200
execute as @a[nbt={SelectedItem: {id: "minecraft:golden_horse_armor", tag: {Tags: ["raw_jerry_chine_gun"]}}}, tag=!added_raw_jerry_chine_gun_mana] run tag @s add added_raw_jerry_chine_gun_mana
execute as @a[nbt={SelectedItem: {id: "minecraft:golden_horse_armor", tag: {Tags: ["maxed_jerry_chine_gun"]}}}, tag=!added_maxed_jerry_chine_gun_mana] run scoreboard players operation @s previous_mana_max = @s mana_max
execute as @a[nbt={SelectedItem: {id: "minecraft:golden_horse_armor", tag: {Tags: ["maxed_jerry_chine_gun"]}}}, tag=!added_maxed_jerry_chine_gun_mana] run scoreboard players operation @s mana_max += 300 300
execute as @a[nbt={SelectedItem: {id: "minecraft:golden_horse_armor", tag: {Tags: ["maxed_jerry_chine_gun"]}}}, tag=!added_maxed_jerry_chine_gun_mana] run tag @s add added_maxed_jerry_chine_gun_mana



execute as @a[nbt={SelectedItem: {id: "minecraft:diamond_shovel", tag: {Tags: ["aotv"]}}}, tag=!added_aotv_mana] run scoreboard players operation @s previous_mana_max = @s mana_max
execute as @a[nbt={SelectedItem: {id: "minecraft:diamond_shovel", tag: {Tags: ["aotv"]}}}, tag=!added_aotv_mana] run scoreboard players operation @s mana_max += 89 89
execute as @a[nbt={SelectedItem: {id: "minecraft:diamond_shovel", tag: {Tags: ["aotv"]}}}, tag=!added_aotv_mana] run tag @s add added_aotv_mana
