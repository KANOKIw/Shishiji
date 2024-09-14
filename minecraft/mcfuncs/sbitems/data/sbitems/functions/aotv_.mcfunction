execute as @e[tag=aotv_] at @s unless block ^ ^ ^1 air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s run summon armor_stand ^ ^ ^0 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s unless block ^ ^ ^2 air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s run summon armor_stand ^ ^ ^1 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s unless block ^ ^ ^3 air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s run summon armor_stand ^ ^ ^2 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s unless block ^ ^ ^4 air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s run summon armor_stand ^ ^ ^3 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s unless block ^ ^ ^5 air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s run summon armor_stand ^ ^ ^4 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s unless block ^ ^ ^6 air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s run summon armor_stand ^ ^ ^5 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s unless block ^ ^ ^7 air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s run summon armor_stand ^ ^ ^6 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s unless block ^ ^ ^8 air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s run summon armor_stand ^ ^ ^7 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s unless block ^ ^ ^9 air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s run summon armor_stand ^ ^ ^8 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s unless block ^ ^ ^10 air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s run summon armor_stand ^ ^ ^9 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s unless block ^ ^ ^11 air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s run summon armor_stand ^ ^ ^10 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way

execute as @e[tag=aotv_] at @s unless block ^ ^ ^12 air run tag @s add blocks_in_the_way
execute as @e[tag=blocks_in_the_way] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=blocks_in_the_way] at @s run summon armor_stand ^ ^ ^11 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=blocks_in_the_way] run tp @s 0 -60 0
execute as @e[tag=blocks_in_the_way] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=blocks_in_the_way] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=blocks_in_the_way] run tellraw @s {"text": "There are blocks in the way!", "color": "red"}
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=blocks_in_the_way, sort=nearest, limit=1]
execute as @e[tag=blocks_in_the_way] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=blocks_in_the_way, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=blocks_in_the_way] run tag @s remove aotv_
execute as @e[tag=blocks_in_the_way] run tag @s remove blocks_in_the_way



execute as @e[tag=aotv_] at @s if block ^ ^ ^12 air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^12 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s if block ^ ^ ^11 air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^11 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s if block ^ ^ ^10 air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^10 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s if block ^ ^ ^9 air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^9 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s if block ^ ^ ^8 air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^8 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s if block ^ ^ ^7 air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^7 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s if block ^ ^ ^6 air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^6 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s if block ^ ^ ^5 air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^5 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s if block ^ ^ ^4 air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^4 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s if block ^ ^ ^3 air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^3 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s if block ^ ^ ^2 air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^2 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s if block ^ ^ ^1 air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^1 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

execute as @e[tag=aotv_] at @s if block ^ ^ ^0 air run tag @s add ready_for_aotv_
execute as @e[tag=ready_for_aotv_] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=ready_for_aotv_] at @s run summon armor_stand ^ ^ ^0 {Tags: ["transmission_dummy_tmp"], Invisible: 1b}
execute as @e[tag=ready_for_aotv_] run tp @s 0 -60 0
execute as @e[tag=ready_for_aotv_] at @e[tag=transmission_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=ready_for_aotv_] at @s run kill @e[tag=transmission_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s align xyz run tp @s ~0.5 ~ ~0.5
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=ready_for_aotv_, sort=nearest, limit=1]
execute as @e[tag=ready_for_aotv_] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 1
execute as @e[tag=ready_for_aotv_] run scoreboard players operation @s mana_current -= @s aotv_mana_cost
execute as @e[tag=ready_for_aotv_, nbt={SelectedItem:{tag:{Tags:["sapphire_power_scrolled"]}}}] at @s run scoreboard players add @s mana_current 5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=ready_for_aotv_] run tag @s remove aotv_
execute as @e[tag=ready_for_aotv_] run tag @s remove ready_for_aotv_

