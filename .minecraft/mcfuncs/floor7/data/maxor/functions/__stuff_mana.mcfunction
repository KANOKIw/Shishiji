execute as @a run scoreboard players remove @s jerry_chine_gun_until_reset 1

execute as @a[nbt={SelectedItem: {id: "minecraft:iron_sword", tag: {CustomTag: 0}}}] run scoreboard players set @s hyperion_mana_cost 0
execute as @a[nbt={SelectedItem: {id: "minecraft:iron_sword", tag: {CustomTag: 50}}}] run scoreboard players set @s hyperion_mana_cost 150
execute as @a[nbt={SelectedItem: {id: "minecraft:iron_sword", tag: {CustomTag: 100}}}] run scoreboard players set @s hyperion_mana_cost 300

execute as @a[scores={jerry_chine_gun_until_reset=..0}, nbt={SelectedItem: {id: "minecraft:golden_horse_armor", tag: {CustomTag: 100}}}] run scoreboard players set @s jerry_chine_gun_next_mana_cost 30
execute as @a[scores={jerry_chine_gun_until_reset=..0}, nbt={SelectedItem: {id: "minecraft:golden_horse_armor", tag: {CustomTag: 50}}}] run scoreboard players set @s jerry_chine_gun_next_mana_cost 15
execute as @a[nbt={SelectedItem: {id: "minecraft:golden_horse_armor", tag: {CustomTag: 0}}}] run scoreboard players set @s jerry_chine_gun_next_mana_cost 0

execute as @a[nbt={SelectedItem: {id: "minecraft:diamond_shovel", tag: {CustomTag: 100}}}] run scoreboard players set @s aotv_mana_cost 45
execute as @a[nbt={SelectedItem: {id: "minecraft:diamond_shovel", tag: {CustomTag: 50}}}] run scoreboard players set @s aotv_mana_cost 23
execute as @a[nbt={SelectedItem: {id: "minecraft:diamond_shovel", tag: {CustomTag: 100}}}] run scoreboard players set @s ether_warp_mana_cost 180
execute as @a[nbt={SelectedItem: {id: "minecraft:diamond_shovel", tag: {CustomTag: 50}}}] run scoreboard players set @s ether_warp_mana_cost 90
