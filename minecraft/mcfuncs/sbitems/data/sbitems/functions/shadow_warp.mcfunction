execute as @e[tag=hyperion_impacted] at @s unless block ^ ^ ^1 air run tag @s add blocks_in_the_way_but_on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run summon armor_stand ^ ^ ^0 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove blocks_in_the_way_but_on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s unless block ^ ^ ^2 air run tag @s add blocks_in_the_way_but_on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run summon armor_stand ^ ^ ^1 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove blocks_in_the_way_but_on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s unless block ^ ^ ^3 air run tag @s add blocks_in_the_way_but_on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run summon armor_stand ^ ^ ^2 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove blocks_in_the_way_but_on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s unless block ^ ^ ^4 air run tag @s add blocks_in_the_way_but_on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run summon armor_stand ^ ^ ^3 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove blocks_in_the_way_but_on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s unless block ^ ^ ^5 air run tag @s add blocks_in_the_way_but_on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run summon armor_stand ^ ^ ^4 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove blocks_in_the_way_but_on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s unless block ^ ^ ^6 air run tag @s add blocks_in_the_way_but_on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run summon armor_stand ^ ^ ^5 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove blocks_in_the_way_but_on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s unless block ^ ^ ^7 air run tag @s add blocks_in_the_way_but_on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run summon armor_stand ^ ^ ^6 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove blocks_in_the_way_but_on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s unless block ^ ^ ^8 air run tag @s add blocks_in_the_way_but_on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run summon armor_stand ^ ^ ^7 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove blocks_in_the_way_but_on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s unless block ^ ^ ^9 air run tag @s add blocks_in_the_way_but_on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run summon armor_stand ^ ^ ^8 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove blocks_in_the_way_but_on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s unless block ^ ^ ^10 air run tag @s add blocks_in_the_way_but_on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run summon armor_stand ^ ^ ^9 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove blocks_in_the_way_but_on_shadow_warp





execute as @e[tag=hyperion_impacted] at @s if block ^ ^ ^10 air run tag @s add on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_shadow_warp] at @s align y run summon armor_stand ^ ^ ^10 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_shadow_warp] run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=on_shadow_warp] run scoreboard players operation @s mana_current -= @s hyperion_mana_cost
execute as @e[tag=on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=on_shadow_warp] run tag @s remove on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s if block ^ ^ ^9 air run tag @s add on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_shadow_warp] at @s align y run summon armor_stand ^ ^ ^9 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_shadow_warp] run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=on_shadow_warp] run scoreboard players operation @s mana_current -= @s hyperion_mana_cost
execute as @e[tag=on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=on_shadow_warp] run tag @s remove on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s if block ^ ^ ^8 air run tag @s add on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_shadow_warp] at @s align y run summon armor_stand ^ ^ ^8 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_shadow_warp] run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=on_shadow_warp] run scoreboard players operation @s mana_current -= @s hyperion_mana_cost
execute as @e[tag=on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=on_shadow_warp] run tag @s remove on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s if block ^ ^ ^7 air run tag @s add on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_shadow_warp] at @s align y run summon armor_stand ^ ^ ^7 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_shadow_warp] run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=on_shadow_warp] run scoreboard players operation @s mana_current -= @s hyperion_mana_cost
execute as @e[tag=on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=on_shadow_warp] run tag @s remove on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s if block ^ ^ ^6 air run tag @s add on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_shadow_warp] at @s align y run summon armor_stand ^ ^ ^6 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_shadow_warp] run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=on_shadow_warp] run scoreboard players operation @s mana_current -= @s hyperion_mana_cost
execute as @e[tag=on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=on_shadow_warp] run tag @s remove on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s if block ^ ^ ^5 air run tag @s add on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_shadow_warp] at @s align y run summon armor_stand ^ ^ ^5 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_shadow_warp] run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=on_shadow_warp] run scoreboard players operation @s mana_current -= @s hyperion_mana_cost
execute as @e[tag=on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=on_shadow_warp] run tag @s remove on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s if block ^ ^ ^4 air run tag @s add on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_shadow_warp] at @s align y run summon armor_stand ^ ^ ^4 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_shadow_warp] run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=on_shadow_warp] run scoreboard players operation @s mana_current -= @s hyperion_mana_cost
execute as @e[tag=on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=on_shadow_warp] run tag @s remove on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s if block ^ ^ ^3 air run tag @s add on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_shadow_warp] at @s align y run summon armor_stand ^ ^ ^3 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_shadow_warp] run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=on_shadow_warp] run scoreboard players operation @s mana_current -= @s hyperion_mana_cost
execute as @e[tag=on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=on_shadow_warp] run tag @s remove on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s if block ^ ^ ^2 air run tag @s add on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_shadow_warp] at @s align y run summon armor_stand ^ ^ ^2 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_shadow_warp] run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=on_shadow_warp] run scoreboard players operation @s mana_current -= @s hyperion_mana_cost
execute as @e[tag=on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=on_shadow_warp] run tag @s remove on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s if block ^ ^ ^1 air run tag @s add on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_shadow_warp] at @s align y run summon armor_stand ^ ^ ^1 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_shadow_warp] run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=on_shadow_warp] run scoreboard players operation @s mana_current -= @s hyperion_mana_cost
execute as @e[tag=on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=on_shadow_warp] run tag @s remove on_shadow_warp

execute as @e[tag=hyperion_impacted] at @s if block ^ ^ ^0 air run tag @s add on_shadow_warp
execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_shadow_warp] at @s align y run summon armor_stand ^ ^ ^0 {Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_shadow_warp] run tp @s 0 -60 0
execute as @e[tag=on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_shadow_warp] run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_shadow_warp] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "raw_hyperion"]}}}] at @s run execute as @e[scores={Health=..15}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, tag=!crystal_dummy] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["music_rune", "maxed_hyperion"]}}}] at @s run execute as @e[scores={Health=..60}, type=player, gamemode=!spectator, gamemode=!creative, distance=0.01..6] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["raw_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 15 mob_attack
execute as @e[tag=on_shadow_warp, nbt={SelectedItem:{tag:{Tags:["maxed_hyperion"]}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy] run damage @s 60 mob_attack
execute as @e[tag=on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
execute as @e[tag=on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
execute as @e[tag=on_shadow_warp] run scoreboard players operation @s mana_current -= @s hyperion_mana_cost
execute as @e[tag=on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
execute as @e[tag=on_shadow_warp] run tag @s remove hyperion_impacted
execute as @e[tag=on_shadow_warp] run tag @s remove on_shadow_warp