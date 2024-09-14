execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^1 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^1 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^1 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^2 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^2 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^2 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^3 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^3 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^3 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^4 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^4 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^4 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^5 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^5 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^5 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^6 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^6 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^6 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^7 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^7 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^7 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^8 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^8 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^8 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^9 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^9 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^9 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^10 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^10 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^10 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^11 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^11 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^11 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^12 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^12 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^12 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^13 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^13 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^13 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^14 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^14 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^14 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^15 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^15 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^15 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^16 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^16 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^16 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^17 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^17 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^17 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^18 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^18 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^18 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^19 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^19 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^19 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^20 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^20 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^20 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^21 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^21 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^21 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^22 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^22 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^22 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^23 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^23 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^23 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^24 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^24 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^24 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^25 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^25 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^25 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^26 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^26 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^26 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^27 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^27 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^27 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^28 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^28 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^28 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^29 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^29 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^29 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^30 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^30 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^30 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^31 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^31 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^31 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^32 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^32 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^32 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^33 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^33 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^33 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^34 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^34 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^34 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^35 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^35 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^35 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^36 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^36 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^36 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^37 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^37 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^37 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^38 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^38 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^38 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^39 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^39 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^39 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^40 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^40 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^40 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^41 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^41 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^41 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^42 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^42 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^42 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^43 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^43 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^43 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^44 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^44 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^44 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^45 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^45 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^45 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^46 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^46 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^46 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^47 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^47 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^47 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^48 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^48 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^48 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^49 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^49 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^49 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^50 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^50 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^50 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^51 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^51 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^51 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^52 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^52 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^52 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^53 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^53 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^53 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^54 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^54 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^54 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^55 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^55 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^55 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^56 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^56 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^56 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^57 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^57 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^57 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^58 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^58 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^58 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^59 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^59 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^59 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^60 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^60 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^60 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp

execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^61 unless block ~ ~1 ~ air unless block ~ ~2 ~ air unless block ~ ~3 ~ air run tag @s remove will_ether_warp
execute as @e[tag=will_ether_warp] at @s positioned ^ ^ ^61 unless block ~ ~1 ~ air if block ~ ~2 ~ air if block ~ ~3 ~ air run tag @s add on_ether_warp
execute as @e[tag=on_ether_warp] at @s run particle witch ~ ~ ~ 0.2 0.5 0.2 3 100 force @a
execute as @e[tag=on_ether_warp] at @s run execute as @e[tag=player_interaction, sort=nearest, limit=1] run tag @s add with_transmission
execute as @e[tag=on_ether_warp] at @s positioned ^ ^ ^61 align xyz run summon armor_stand ~0.5 ~2 ~0.5 {Tags: ["ether_warp_dummy_tmp"], Invisible: 1b}
execute as @e[tag=on_ether_warp] run effect give @s slow_falling 1 1 true
execute as @e[tag=on_ether_warp] run tp @s 0 -60 0
execute as @e[tag=on_ether_warp] at @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1] run tp @s ~ ~ ~
execute as @e[tag=on_ether_warp] run kill @e[tag=ether_warp_dummy_tmp, sort=nearest, limit=1]
execute as @e[tag=with_transmission] at @s run tp @s @e[tag=on_ether_warp, sort=nearest, limit=1]
execute as @e[tag=on_ether_warp] at @s run playsound entity.ender_dragon.hurt master @s ~ ~ ~ 1 0.5
execute as @e[tag=with_transmission] run tag @s remove with_transmission
execute as @e[tag=on_ether_warp] run tag @s remove will_ether_warp
execute as @e[tag=on_ether_warp] run tag @s remove on_ether_warp


# this means there are no blocks in the way or there is a block above the targeted block
execute as @e[tag=will_ether_warp] run tag @s remove will_ether_warp