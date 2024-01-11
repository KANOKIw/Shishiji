import inspect

data = ""
for n in range(10):
    n += 1
    data += inspect.cleandoc(f"""
        execute as @e[tag=hyperion_impacted] at @s anchored eyes positioned ^ ^ ^{n} align xyz unless block ~ ~ ~ air run tag @s add blocks_in_the_way_but_on_shadow_warp
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s anchored eyes run summon armor_stand ^ ^ ^{n-1} {{Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b, NoGravity: 1b}}
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tp @s 0 -60 0
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "raw_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..15}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "raw_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..15}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 0 0 run playsound block.note_block.harp music @a ~ ~ ~ 1 1.1
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "raw_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..15}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 1 1 run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "raw_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..15}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 2 2 run playsound block.note_block.harp music @a ~ ~ ~ 1 1.3
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "raw_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..15}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 3 3 run playsound block.note_block.harp music @a ~ ~ ~ 1 0.6
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "raw_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..15}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 4 4 run playsound block.note_block.harp music @a ~ ~ ~ 1 1
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "raw_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..15}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 5 5 run playsound block.note_block.harp music @a ~ ~ ~ 1 1.2
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "raw_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..15}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 6 6 run playsound block.note_block.harp music @a ~ ~ ~ 1 1.5
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "raw_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..15}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 7 7 run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "raw_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..15}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 8 8 run playsound block.note_block.harp music @a ~ ~ ~ 1 0.7
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "raw_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..15}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 9 9 run playsound block.note_block.harp music @a ~ ~ ~ 1 1.4
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "raw_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..15}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 10 10 run playsound block.note_block.harp music @a ~ ~ ~ 1 0.9
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "maxed_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..60}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "maxed_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..60}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 0 0 run playsound block.note_block.harp music @a ~ ~ ~ 1 1.1
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "maxed_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..60}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 1 1 run playsound block.note_block.harp music @a ~ ~ ~ 1 0.5
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "maxed_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..60}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 2 2 run playsound block.note_block.harp music @a ~ ~ ~ 1 1.3
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "maxed_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..60}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 3 3 run playsound block.note_block.harp music @a ~ ~ ~ 1 0.6
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "maxed_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..60}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 4 4 run playsound block.note_block.harp music @a ~ ~ ~ 1 1
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "maxed_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..60}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 5 5 run playsound block.note_block.harp music @a ~ ~ ~ 1 1.2
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "maxed_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..60}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 6 6 run playsound block.note_block.harp music @a ~ ~ ~ 1 1.5
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "maxed_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..60}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 7 7 run playsound block.note_block.harp music @a ~ ~ ~ 1 0.8
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "maxed_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..60}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 8 8 run playsound block.note_block.harp music @a ~ ~ ~ 1 0.7
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "maxed_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..60}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 9 9 run playsound block.note_block.harp music @a ~ ~ ~ 1 1.4
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "maxed_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..60}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s if score melody_random melody_random = 10 10 run playsound block.note_block.harp music @a ~ ~ ~ 1 0.9
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["raw_hyperion"]}}}}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy, type=!player, nbt=!{{Invisible: 1b}}] run damage @s 15 mob_attack by @p
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["maxed_hyperion"]}}}}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy, type=!player, nbt=!{{Invisible: 1b}}] run damage @s 60 mob_attack by @p
        execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
        execute as @e[tag=with_transmission] run tag @s remove with_transmission
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run scoreboard players operation @s mana_current -= @s hyperion_mana_cost
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove hyperion_impacted
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] run tag @s remove blocks_in_the_way_but_on_shadow_warp
    """)
    data += f"\n\n"

for n in range(10, -1, -1):
    data += inspect.cleandoc(f"""
        execute as @e[tag=hyperion_impacted] at @s anchored eyes positioned ^ ^ ^{n} align xyz if block ~ ~ ~ air run tag @s add on_shadow_warp
        execute as @e[tag=blocks_in_the_way_but_on_shadow_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
        execute as @e[tag=on_shadow_warp] at @s anchored eyes run summon armor_stand ^ ^ ^{n} {{Tags: ["shadow_warp_dummy_tmp"], Invisible: 1b, NoGravity: 1b}}
        execute as @e[tag=on_shadow_warp] run tp @s 0 -60 0
        execute as @e[tag=on_shadow_warp] at @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
        execute as @e[tag=on_shadow_warp] run kill @e[tag=shadow_warp_dummy_tmp, sort=nearest, limit=1]
        execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way_but_on_shadow_warp, sort=nearest, limit=1]
        execute as @e[tag=with_transmission] run tag @s remove with_transmission
        execute as @e[tag=on_shadow_warp] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
        execute as @e[tag=on_shadow_warp] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
        execute as @e[tag=on_shadow_warp] at @s run particle explosion ~ ~ ~ 0 0 0 3.5 30 force @a[distance=0.01..]
        execute as @e[tag=on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "raw_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..15}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
        execute as @e[tag=on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "raw_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..15}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 1.2
        execute as @e[tag=on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "maxed_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..60}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s run particle note ~ ~1 ~ 0 0 0 1 1 force @a
        execute as @e[tag=on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["music_rune", "maxed_hyperion"]}}}}}}] at @s run execute as @e[scores={{Health=..60}}, type=!player, distance=0.01..6, type=!item, type=!interaction, type=!arrow, type=!armor_stand, type=!text_display, type=!tnt, type=!block_display, type=!enderman, tag=!crystal_dummy, nbt=!{{Invisible: 1b}}] at @s run playsound block.note_block.harp music @a ~ ~ ~ 1 1.2
        execute as @e[tag=on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["raw_hyperion"]}}}}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy, type=!player, nbt=!{{Invisible: 1b}}] run damage @s 15 mob_attack by @p
        execute as @e[tag=on_shadow_warp, nbt={{SelectedItem:{{tag:{{Tags:["maxed_hyperion"]}}}}}}] at @s run execute as @e[distance=0.01..6, type=!item, type=!interaction, type=!arrow, tag=!crystal_dummy, type=!player, nbt=!{{Invisible: 1b}}] run damage @s 60 mob_attack by @p
        execute as @e[tag=on_shadow_warp] at @s run playsound entity.generic.explode block @s ~ ~ ~
        execute as @e[tag=on_shadow_warp] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 0.5 1
        execute as @e[tag=on_shadow_warp] run scoreboard players operation @s mana_current -= @s hyperion_mana_cost
        execute as @e[tag=on_shadow_warp] run scoreboard players set @s hyperion_cooldown 2
        execute as @e[tag=on_shadow_warp] run tag @s remove hyperion_impacted
        execute as @e[tag=on_shadow_warp] run tag @s remove on_shadow_warp
    """)
    data += f"\n\n"

data += """

execute as @e[tag=wither_shielding] at @s run playsound entity.zombie_villager.cure block @s ~ ~ ~ 1 0.8

execute as @e[tag=wither_shielding] at @s run particle witch ^ ^0.5 ^0.4 0 0 0 1 2 force @a

execute as @e[tag=wither_shielding] at @s run particle witch ^-0.15 ^0.7 ^0.4 0 0 0 1 2 force @a
execute as @e[tag=wither_shielding] at @s run particle witch ^0.15 ^0.7 ^0.4 0 0 0 1 2 force @a

execute as @e[tag=wither_shielding] at @s run particle witch ^-0.225 ^0.8 ^0.4 0 0 0 1 2 force @a
execute as @e[tag=wither_shielding] at @s run particle witch ^0.225 ^0.8 ^0.4 0 0 0 1 2 force @a

execute as @e[tag=wither_shielding] at @s run particle witch ^-0.3 ^0.85 ^0.4 0 0 0 1 2 force @a
execute as @e[tag=wither_shielding] at @s run particle witch ^0.3 ^0.85 ^0.4 0 0 0 1 2 force @a

execute as @e[tag=wither_shielding] at @s run particle witch ^-0.525 ^0.9 ^0.4 0 0 0 1 2 force @a
execute as @e[tag=wither_shielding] at @s run particle witch ^0.525 ^0.9 ^0.4 0 0 0 1 2 force @a

execute as @e[tag=wither_shielding] at @s run particle witch ^-0.575 ^1 ^0.4 0 0 0 1 2 force @a
execute as @e[tag=wither_shielding] at @s run particle witch ^0.575 ^1 ^0.4 0 0 0 1 2 force @a

execute as @e[tag=wither_shielding] at @s run particle witch ^-0.575 ^1.1 ^0.4 0 0 0 1 2 force @a
execute as @e[tag=wither_shielding] at @s run particle witch ^0.575 ^1.1 ^0.4 0 0 0 1 2 force @a

execute as @e[tag=wither_shielding] at @s run particle witch ^-0.575 ^1.2 ^0.3 0 0 0 1 2 force @a
execute as @e[tag=wither_shielding] at @s run particle witch ^0.575 ^1.2 ^0.5 0 0 0 1 2 force @a

execute as @e[tag=wither_shielding] at @s run particle witch ^-0.525 ^1.3 ^0.3 0 0 0 1 2 force @a
execute as @e[tag=wither_shielding] at @s run particle witch ^0.525 ^1.3 ^0.3 0 0 0 1 2 force @a

execute as @e[tag=wither_shielding] at @s run particle witch ^-0.3 ^1.35 ^0.3 0 0 0 1 2 force @a
execute as @e[tag=wither_shielding] at @s run particle witch ^0.3 ^1.35 ^0.3 0 0 0 1 2 force @a

execute as @e[tag=wither_shielding] at @s run particle witch ^-0.225 ^1.4 ^0.3 0 0 0 1 2 force @a
execute as @e[tag=wither_shielding] at @s run particle witch ^0.225 ^1.4 ^0.3 0 0 0 1 2 force @a

execute as @e[tag=wither_shielding] at @s run particle witch ^-0.15 ^1.5 ^0.3 0 0 0 1 2 force @a
execute as @e[tag=wither_shielding] at @s run particle witch ^0.15 ^1.5 ^0.3 0 0 0 1 2 force @a

execute as @e[tag=wither_shielding] at @s run particle witch ^ ^1.7 ^0.3 0 0 0 1 2 force @a


execute as @e[tag=wither_shielding] run scoreboard players set @s wither_shield_cooldown 100
execute as @e[tag=wither_shielding] run tag @s remove wither_shielding
"""

with open(r"servers\lobby\world\datapacks\lobby\data\sbitems\functions\shadow_warp.mcfunction", "w") as f:
    f.write(data)



scripts = ""
for n in range(12):
    n += 1
    scripts += inspect.cleandoc(f"""
        execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^{n} align xyz unless block ~ ~ ~ air run tag @s add blocks_in_the_way
        execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
        execute as @e[tag=blocks_in_the_way] at @s anchored eyes run summon armor_stand ^ ^ ^{n-1} {{Tags: ["transmission_dummy_tmp"], Invisible: 1b}}
        execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
        execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
        execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
        execute as @e[tag=blocks_in_the_way] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
        execute as @e[tag=blocks_in_the_way] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
        execute as @e[tag=blocks_in_the_way] run tellraw @s {{"text": "There are blocks in the way!", "color": "red"}}
        execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
        execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
        execute as @e[tag=blocks_in_the_way, nbt={{SelectedItem:{{tag:{{Tags:["sapphire_power_scrolled"]}}}}}}] at @s run scoreboard players add @s mana_current 5
        execute as @e[tag=with_transmission] run tag @s remove with_transmission
        execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
        execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way
    """)
    scripts += f"\n\n"
    
for n in range(12, -1, -1):
    scripts += inspect.cleandoc(f"""
        execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^{n} align xyz if block ~ ~ ~ air run tag @s add ready_for_aotv_
        execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
        execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^{n} {{Tags: ["transmission_dummy_tmp"], Invisible: 1b}}
        execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
        execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
        execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
        execute as @e[tag=ready_for_aotv_] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
        execute as @e[tag=ready_for_aotv_] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
        execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
        execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
        execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
        execute as @e[tag=ready_for_aotv_, nbt={{SelectedItem:{{tag:{{Tags:["sapphire_power_scrolled"]}}}}}}] at @s run scoreboard players add @s mana_current 5
        execute as @e[tag=with_transmission] run tag @s remove with_transmission
        execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
        execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_
    """)
    scripts += f"\n\n"

with open(r"servers\lobby\world\datapacks\lobby\data\sbitems\functions\aotv_.mcfunction", "w") as f:
    f.write(scripts)
