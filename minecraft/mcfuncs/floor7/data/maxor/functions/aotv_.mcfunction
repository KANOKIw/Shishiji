execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^1 align xyz unless block ~ ~ ~ air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s anchored eyes run summon armor_stand ^ ^ ^0 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^2 align xyz unless block ~ ~ ~ air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s anchored eyes run summon armor_stand ^ ^ ^1 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^3 align xyz unless block ~ ~ ~ air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s anchored eyes run summon armor_stand ^ ^ ^2 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^4 align xyz unless block ~ ~ ~ air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s anchored eyes run summon armor_stand ^ ^ ^3 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^5 align xyz unless block ~ ~ ~ air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s anchored eyes run summon armor_stand ^ ^ ^4 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^6 align xyz unless block ~ ~ ~ air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s anchored eyes run summon armor_stand ^ ^ ^5 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^7 align xyz unless block ~ ~ ~ air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s anchored eyes run summon armor_stand ^ ^ ^6 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^8 align xyz unless block ~ ~ ~ air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s anchored eyes run summon armor_stand ^ ^ ^7 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^9 align xyz unless block ~ ~ ~ air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s anchored eyes run summon armor_stand ^ ^ ^8 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^10 align xyz unless block ~ ~ ~ air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s anchored eyes run summon armor_stand ^ ^ ^9 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^11 align xyz unless block ~ ~ ~ air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s anchored eyes run summon armor_stand ^ ^ ^10 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^12 align xyz unless block ~ ~ ~ air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s anchored eyes run summon armor_stand ^ ^ ^11 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^12 align xyz if block ~ ~ ~ air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^12 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=ready_for_aotv_] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^11 align xyz if block ~ ~ ~ air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^11 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=ready_for_aotv_] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^10 align xyz if block ~ ~ ~ air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^10 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=ready_for_aotv_] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^9 align xyz if block ~ ~ ~ air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^9 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=ready_for_aotv_] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^8 align xyz if block ~ ~ ~ air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^8 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=ready_for_aotv_] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^7 align xyz if block ~ ~ ~ air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^7 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=ready_for_aotv_] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^6 align xyz if block ~ ~ ~ air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^6 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=ready_for_aotv_] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^5 align xyz if block ~ ~ ~ air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^5 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=ready_for_aotv_] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^4 align xyz if block ~ ~ ~ air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^4 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=ready_for_aotv_] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^3 align xyz if block ~ ~ ~ air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^3 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=ready_for_aotv_] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^2 align xyz if block ~ ~ ~ air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^2 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=ready_for_aotv_] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^1 align xyz if block ~ ~ ~ air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^1 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=ready_for_aotv_] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s anchored eyes positioned ^ ^ ^0 align xyz if block ~ ~ ~ air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^0 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz if block ~ ~ ~ air run tp @s ~0.5 ~ ~0.5
execute as @e[tag=ready_for_aotv_] at @s align xyz unless block ~ ~ ~ air run tp @s ~0.5 ~1 ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

