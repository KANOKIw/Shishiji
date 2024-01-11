execute as @a[nbt=!{Inventory: [{id: "minecraft:nether_star", tag: {CustomTag: 12}}]}, x=933, y=155, z=1054, dx=0.5, dy=0.5, dz=0.5] if entity @e[tag=right_crystal_dummy] if entity @e[tag=right_crystal_interaction] run tag @s add right_crystal_interacted
execute as @a[nbt=!{Inventory: [{id: "minecraft:nether_star", tag: {CustomTag: 12}}]}, x=915, y=155, z=1054, dx=0.5, dy=0.5, dz=0.5] if entity @e[tag=left_crystal_dummy] if entity @e[tag=left_crystal_interaction] run tag @s add left_crystal_interacted

execute as @e[tag=right_crystal_interaction] on target unless entity @s[nbt={Inventory: [{id: "minecraft:nether_star", tag: {CustomTag: 12}}]}] run tag @s add right_crystal_interacted
execute as @e[tag=right_crystal_interaction] on attacker unless entity @s[nbt={Inventory: [{id: "minecraft:nether_star", tag: {CustomTag: 12}}]}] run tag @s add right_crystal_interacted
execute as @e[tag=right_crystal_interacted] run item replace entity @s hotbar.8 with nether_star{CustomTag: 12, display: {Name: '{"text": "Energy Crystal", "color": "red", "italic": false}'}}
execute as @e[tag=right_crystal_interacted] run kill @e[tag=right_crystal_dummy]
execute as @e[tag=right_crystal_interacted] run kill @e[tag=right_crystal_interaction]
execute as @e[tag=right_crystal_interacted] run kill @e[tag=right_crystal_guide_text_display]
execute as @e[tag=right_crystal_interacted] run tag @s remove right_crystal_interacted

execute as @e[tag=left_crystal_interaction] on target unless entity @s[nbt={Inventory: [{id: "minecraft:nether_star", tag: {CustomTag: 12}}]}] run tag @s add left_crystal_interacted
execute as @e[tag=left_crystal_interaction] on attacker unless entity @s[nbt={Inventory: [{id: "minecraft:nether_star", tag: {CustomTag: 12}}]}] run tag @s add left_crystal_interacted
execute as @e[tag=left_crystal_interacted] run item replace entity @s hotbar.8 with nether_star{CustomTag: 12, display: {Name: '{"text": "Energy Crystal", "color": "red", "italic": false}'}}
execute as @e[tag=left_crystal_interacted] run kill @e[tag=left_crystal_dummy]
execute as @e[tag=left_crystal_interacted] run kill @e[tag=left_crystal_interaction]
execute as @e[tag=left_crystal_interacted] run kill @e[tag=left_crystal_guide_text_display]
execute as @e[tag=left_crystal_interacted] run tag @s remove left_crystal_interacted

execute if entity @a[nbt={Inventory: [{id: "minecraft:nether_star", tag: {CustomTag: 12}}]}, x=903, y=141, z=1064, dx=0.8, dy=0.8, dz=0.8] run kill @e[tag=maxor_crystal_left]
execute if entity @a[nbt={Inventory: [{id: "minecraft:nether_star", tag: {CustomTag: 12}}]}, x=903, y=141, z=1064, dx=0.8, dy=0.8, dz=0.8] run kill @e[tag=left_place_crystal_interaction]
execute if entity @a[nbt={Inventory: [{id: "minecraft:nether_star", tag: {CustomTag: 12}}]}, x=903, y=141, z=1064, dx=0.8, dy=0.8, dz=0.8] as @a[nbt={Inventory: [{id: "minecraft:nether_star", tag: {CustomTag: 12}}]}, x=903, y=141, z=1064, dx=0.5, dy=0.5, dz=0.5] run item replace entity @s hotbar.8 with air
execute if entity @a[nbt={Inventory: [{id: "minecraft:nether_star", tag: {CustomTag: 12}}]}, x=945, y=141, z=1064, dx=0.8, dy=0.8, dz=0.8] run kill @e[tag=maxor_crystal_right]
execute if entity @a[nbt={Inventory: [{id: "minecraft:nether_star", tag: {CustomTag: 12}}]}, x=945, y=141, z=1064, dx=0.8, dy=0.8, dz=0.8] run kill @e[tag=right_place_crystal_interaction]
execute if entity @a[nbt={Inventory: [{id: "minecraft:nether_star", tag: {CustomTag: 12}}]}, x=945, y=141, z=1064, dx=0.8, dy=0.8, dz=0.8] as @a[nbt={Inventory: [{id: "minecraft:nether_star", tag: {CustomTag: 12}}]}, x=945, y=141, z=1064, dx=0.5, dy=0.5, dz=0.5] run item replace entity @s hotbar.8 with air


execute as @e[tag=right_place_crystal_interaction] on target if entity @s[nbt={Inventory: [{id: "minecraft:nether_star", tag: {CustomTag: 12}}]}] run tag @s add right_crystal_place_interacted
execute as @e[tag=right_place_crystal_interaction] on attacker if entity @s[nbt={Inventory: [{id: "minecraft:nether_star", tag: {CustomTag: 12}}]}] run tag @s add right_crystal_place_interacted
execute as @e[tag=right_crystal_place_interacted] run kill @e[tag=maxor_crystal_right]
execute as @e[tag=right_crystal_place_interacted] run kill @e[tag=right_place_crystal_interaction]
execute as @e[tag=right_crystal_place_interacted] run item replace entity @s hotbar.8 with air
execute as @e[tag=right_crystal_place_interacted] run tag @s remove right_crystal_place_interacted

execute as @e[tag=left_place_crystal_interaction] on target if entity @s[nbt={SelectedItem: {id: "minecraft:nether_star", tag: {CustomTag: 12}}}] run tag @s add left_crystal_place_interacted
execute as @e[tag=left_place_crystal_interaction] on attacker if entity @s[nbt={SelectedItem: {id: "minecraft:nether_star", tag: {CustomTag: 12}}}] run tag @s add left_crystal_place_interacted
execute as @e[tag=left_crystal_place_interacted] run kill @e[tag=maxor_crystal_left]
execute as @e[tag=left_crystal_place_interacted] run kill @e[tag=left_place_crystal_interaction]
execute as @e[tag=left_crystal_place_interacted] run item replace entity @s hotbar.8 with air
execute as @e[tag=left_crystal_place_interacted] run tag @s remove left_crystal_place_interacted
