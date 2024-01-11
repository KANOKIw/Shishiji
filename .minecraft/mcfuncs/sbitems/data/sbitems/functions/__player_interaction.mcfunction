# Jerry-chine Gun
execute as @a at @s unless entity @e[tag=player_interaction, tag=!with_transmission, distance=..4] run summon interaction ~ ~-1 ~ {Tags: ["player_interaction"]}

execute as @a at @s run tp @e[tag=player_interaction, tag=!with_transmission, sort=nearest, limit=1] ~ ~-1 ~

execute as @a at @s if entity @s[nbt={SelectedItem:{tag:{Tags:["interaction_item"]}}}] run data modify entity @e[tag=player_interaction, tag=!with_transmission, sort=nearest, limit=1] height set value 6.0f
execute as @a at @s if entity @s[nbt={SelectedItem:{tag:{Tags:["interaction_item"]}}}] run data modify entity @e[tag=player_interaction, tag=!with_transmission, sort=nearest, limit=1] width set value 4.0f

execute as @a at @s unless entity @s[nbt={SelectedItem:{tag:{Tags:["interaction_item"]}}}] run data modify entity @e[tag=player_interaction, tag=!with_transmission, sort=nearest, limit=1] height set value 0.0f
execute as @a at @s unless entity @s[nbt={SelectedItem:{tag:{Tags:["interaction_item"]}}}] run data modify entity @e[tag=player_interaction, tag=!with_transmission, sort=nearest, limit=1] width set value 0.0f

execute as @e[tag=player_interaction, tag=!with_transmission] at @s unless entity @p[distance=..4] run kill @s

# Hyperion
execute as @a run scoreboard players remove @s hyperion_cooldown 1
execute as @a run scoreboard players remove @s wither_shield_cooldown 1

execute as @a[scores={wither_shield_cooldown=0}] at @s run playsound entity.player.levelup block @s ~ ~ ~ 1 2
execute as @a[scores={wither_shield_cooldown=0}] at @s run particle heart ~ ~1 ~ 0.5 1 0.5 2 7 force @a
execute as @a[scores={wither_shield_cooldown=0}] run effect give @s instant_health 1 3 true
execute as @a[scores={wither_shield_cooldown=0}] run effect give @s saturation 1 20 true


# terminator
execute as @a run scoreboard players remove @s terminator_cooldown 1
execute as @a run scoreboard players add @s interaction_bow_arrow_se 1
execute as @a[scores={interaction_bow_arrow_se=4..}] run scoreboard players set @s interaction_bow_arrow_se 0
    # salvation
    execute as @a[scores={salvation_cooldown=-10..}] run scoreboard players remove @s salvation_cooldown 1
    execute as @a[tag=!salvation_ready_sounded, scores={terminator_hit=3..}] at @s run playsound minecraft:entity.guardian.hurt master @p ~ ~ ~ 1 1.4
    execute as @a[tag=!salvation_ready_sounded, scores={terminator_hit=3..}] at @s run tag @s add salvation_ready_sounded



# on_interaction
# Jerry-chine Gun
execute as @e[tag=player_interaction] on target run tag @s[nbt={SelectedItem:{tag:{Tags:["jerry_chine_gun"]}}}] add shot_jerry_chine_gun
execute as @e[tag=small_jerry] run tag @s remove nearest_jerry
execute as @e[tag=shot_jerry_chine_gun] at @s run summon minecraft:armor_stand ^ ^ ^0.6 {Tags: ["small_jerry", "nearest_jerry"], Invisible: true, ArmorItems:[{},{},{},{id:"minecraft:player_head", Count:1b,tag:{SkullOwner:{Id:[I;1175611920,-2121709614,-1896225743,248020796],Properties:{textures:[{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWVmYTAzZjliNzM0YTA3YTg0NzMzMmU2YjI5ODY2MTg3YWNkYzg3MmQ4ZGI0MWE3Zjk4NjU5ODVhNjY0MDIyNCJ9fX0="}]}}}}]}
execute as @e[tag=nearest_jerry] at @s run tp @s ~ ~ ~ facing entity @p
execute as @e[tag=shot_jerry_chine_gun] at @s run playsound entity.villager.celebrate neutral @a ~ ~ ~ 1 1.1
execute as @e[tag=shot_jerry_chine_gun] run tag @s remove shot_jerry_chine_gun


# Hyperion
execute as @e[tag=player_interaction] on target if score @s hyperion_cooldown < 0 0 run tag @s[nbt={SelectedItem:{tag:{Tags:["hyperion"]}}}] add hyperion_impacted


#execute as @e[tag=hyperion_impacted, tag=!hyperion_teleported] at @s if blocks ^ ^ ^1 ^ ^ ^10 ~ ~ ~ all run tag @s add hyperion_on_teleport
#execute as @e[tag=hyperion_impacted] at @s if block ^ ^ ^1 air unless block ^ ^ ^2 air unless block ^ ^ ^3 air unless block ^ ^ ^4 air unless block ^ ^ ^5 air unless block ^ ^ ^6 air run tag @s add hyperion_teleported
#execute as @e[tag=hyperion_impacted, tag=hyperion_on_teleport] at @s if block ^ ^ ^1 air unless block ^ ^ ^2 air unless block ^ ^ ^3 air unless block ^ ^ ^4 air unless block ^ ^ ^5 air unless block ^ ^ ^6 air run tp @s ^ ^ ^1
#execute as @e[tag=hyperion_on_teleport] run tag @s remove hyperion_on_teleport


#execute as @e[tag=hyperion_teleported] at @s run setblock ~ ~-1 ~ barrier keep
#execute as @e[tag=hyperion_teleported] at @s run fill ~ ~-1 ~ ~ ~-1 ~ air replace barrier


    # Optional
    #execute as @e[tag=hyperion_impacted] at @s align x align y align z run tp @s ~ ~ ~

execute as @e[tag=hyperion_impacted, tag=hyperion_teleported] store result score @s position_X run data get entity @s Pos[0]
execute as @e[tag=hyperion_impacted, tag=hyperion_teleported] store result score @s position_Y run data get entity @s Pos[1]
execute as @e[tag=hyperion_impacted, tag=hyperion_teleported] store result score @s position_Z run data get entity @s Pos[2]

execute as @e[tag=hyperion_impacted] run tag @s remove hyperion_teleported
execute as @e[tag=hyperion_impacted] if score @s wither_shield_cooldown < 0 0 run effect give @s absorption 5 5 true
execute as @e[tag=hyperion_impacted] if score @s wither_shield_cooldown < 0 0 at @s run playsound entity.zombie_villager.cure block @s ~ ~ ~ 1 0.8


execute as @e[tag=hyperion_impacted] unless score @s wither_shield_cooldown > 0 0 run tag @s add wither_shielding

    # wither shield circle particles
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

execute as @e[tag=hyperion_impacted] at @s run function sbitems:shadow_warp



# terminator
execute as @e[tag=player_interaction] on target run tag @s[nbt={SelectedItem:{tag:{Tags:["terminator"]}}}, scores={terminator_cooldown=..0}] add shot_terminator

    # salvation
    execute as @a[tag=salvation_tmp] run tag @s remove salvation_tmp
    execute as @e[tag=player_interaction] on target run tag @s[nbt={SelectedItem:{tag:{Tags:["terminator"]}}}, scores={salvation_cooldown=..0, terminator_hit=3..}] add will_salvation
    execute as @a[tag=will_salvation] at @s run playsound entity.guardian.death master @p ~ ~ ~ 1 2
    execute as @a[tag=will_salvation] run scoreboard players set @s salvation_cooldown 15
    execute as @a[tag=will_salvation] run scoreboard players set @s terminator_hit 0
    execute as @a[tag=will_salvation] run tag @s add salvation_tmp
    execute as @a[tag=will_salvation] run tag @s remove salvation_ready_sounded
    execute as @a[tag=will_salvation] run tag @s remove shot_terminator
    execute as @a[tag=will_salvation] run tag @s remove will_salvation
    execute as @a[tag=salvation_tmp] run function sbitems:salvation

execute as @e[tag=player_interaction] on attacker run tag @s[nbt={SelectedItem:{tag:{Tags:["terminator"]}}}, scores={terminator_cooldown=..0}] add shot_terminator
execute as @e[tag=shot_terminator, scores={interaction_bow_arrow_se=0}] at @s run playsound entity.arrow.shoot block @s ~ ~ ~ 1 1
execute as @e[tag=shot_terminator, scores={interaction_bow_arrow_se=1}] at @s run playsound entity.arrow.shoot block @s ~ ~ ~ 1 1.1
execute as @e[tag=shot_terminator, scores={interaction_bow_arrow_se=2}] at @s run playsound entity.arrow.shoot block @s ~ ~ ~ 1 1.2
execute as @e[tag=shot_terminator, scores={interaction_bow_arrow_se=3}] at @s run playsound entity.arrow.shoot block @s ~ ~ ~ 1 1.3
execute as @e[tag=shot_terminator] run scoreboard players set @s terminator_cooldown 5
execute as @a[tag=shot_terminator] run tag @s remove summoned_duplex_arrow


execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["duplex"]}}}] run tag @s add will_shoot_duplexed_arrow
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["duplex"]}}}] at @s run schedule function sbitems:duplex 4t



execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=75..}] at @s run summon arrow ^ ^ ^ {Tags: ["terminator_arrow", "terminator_last_arrow_left", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=75..}] at @s run summon arrow ^ ^ ^ {Tags: ["terminator_arrow", "terminator_last_arrow_middle", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=75..}] at @s run summon arrow ^ ^ ^ {Tags: ["terminator_arrow", "terminator_last_arrow_right", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=75..}] run tag @s add summoned_arrow

execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=60..75}] at @s run summon arrow ^ ^0.4 ^ {Tags: ["terminator_arrow", "terminator_last_arrow_left", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=60..75}] at @s run summon arrow ^ ^0.4 ^ {Tags: ["terminator_arrow", "terminator_last_arrow_middle", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=60..75}] at @s run summon arrow ^ ^0.4 ^ {Tags: ["terminator_arrow", "terminator_last_arrow_right", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=60..75}] run tag @s add summoned_arrow

execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=45..60}] at @s run summon arrow ^ ^0.8 ^ {Tags: ["terminator_arrow", "terminator_last_arrow_left", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=45..60}] at @s run summon arrow ^ ^0.8 ^ {Tags: ["terminator_arrow", "terminator_last_arrow_middle", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=45..60}] at @s run summon arrow ^ ^0.8 ^ {Tags: ["terminator_arrow", "terminator_last_arrow_right", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=45..60}] run tag @s add summoned_arrow

execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=-29..45}] at @s run summon arrow ^ ^1.2 ^ {Tags: ["terminator_arrow", "terminator_last_arrow_left", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=-29..45}] at @s run summon arrow ^ ^1.2 ^ {Tags: ["terminator_arrow", "terminator_last_arrow_middle", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=-29..45}] at @s run summon arrow ^ ^1.2 ^ {Tags: ["terminator_arrow", "terminator_last_arrow_right", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=-29..45}] run tag @s add summoned_arrow

execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=-55..-29}] at @s run summon arrow ^ ^1 ^1.2 {Tags: ["terminator_arrow", "terminator_last_arrow_left", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=-55..-29}] at @s run summon arrow ^ ^1 ^1.2 {Tags: ["terminator_arrow", "terminator_last_arrow_middle", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=-55..-29}] at @s run summon arrow ^ ^1 ^1.2 {Tags: ["terminator_arrow", "terminator_last_arrow_right", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=-55..-29}] run tag @s add summoned_arrow

execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=-70..-55}] at @s run summon arrow ^ ^0.8 ^1.5 {Tags: ["terminator_arrow", "terminator_last_arrow_left", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=-70..-55}] at @s run summon arrow ^ ^0.8 ^1.5 {Tags: ["terminator_arrow", "terminator_last_arrow_middle", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=-70..-55}] at @s run summon arrow ^ ^0.8 ^1.5 {Tags: ["terminator_arrow", "terminator_last_arrow_right", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=-70..-55}] run tag @s add summoned_arrow

execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=-85..-70}] at @s run summon arrow ^ ^0.4 ^2 {Tags: ["terminator_arrow", "terminator_last_arrow_left", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=-85..-70}] at @s run summon arrow ^ ^0.4 ^2 {Tags: ["terminator_arrow", "terminator_last_arrow_middle", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=-85..-70}] at @s run summon arrow ^ ^0.4 ^2 {Tags: ["terminator_arrow", "terminator_last_arrow_right", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=-85..-70}] run tag @s add summoned_arrow

execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=..-85}] at @s run summon arrow ^ ^ ^2 {Tags: ["terminator_arrow", "terminator_last_arrow_left", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=..-85}] at @s run summon arrow ^ ^ ^2 {Tags: ["terminator_arrow", "terminator_last_arrow_middle", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=..-85}] at @s run summon arrow ^ ^ ^2 {Tags: ["terminator_arrow", "terminator_last_arrow_right", "end_runed", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, nbt={SelectedItem:{tag:{Tags:["end_rune"]}}}, tag=!summoned_arrow, scores={Rotation_Y=..-85}] run tag @s add summoned_arrow


execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=75..}] at @s run summon arrow ^ ^ ^ {Tags: ["terminator_arrow", "terminator_last_arrow_left", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=75..}] at @s run summon arrow ^ ^ ^ {Tags: ["terminator_arrow", "terminator_last_arrow_middle", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=75..}] at @s run summon arrow ^ ^ ^ {Tags: ["terminator_arrow", "terminator_last_arrow_right", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=75..}] run tag @s add summoned_arrow

execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=60..75}] at @s run summon arrow ^ ^0.4 ^ {Tags: ["terminator_arrow", "terminator_last_arrow_left", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=60..75}] at @s run summon arrow ^ ^0.4 ^ {Tags: ["terminator_arrow", "terminator_last_arrow_middle", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=60..75}] at @s run summon arrow ^ ^0.4 ^ {Tags: ["terminator_arrow", "terminator_last_arrow_right", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=60..75}] run tag @s add summoned_arrow

execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=45..60}] at @s run summon arrow ^ ^0.8 ^ {Tags: ["terminator_arrow", "terminator_last_arrow_left", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=45..60}] at @s run summon arrow ^ ^0.8 ^ {Tags: ["terminator_arrow", "terminator_last_arrow_middle", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=45..60}] at @s run summon arrow ^ ^0.8 ^ {Tags: ["terminator_arrow", "terminator_last_arrow_right", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=45..60}] run tag @s add summoned_arrow

execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=-29..45}] at @s run summon arrow ^ ^1.2 ^ {Tags: ["terminator_arrow", "terminator_last_arrow_left", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=-29..45}] at @s run summon arrow ^ ^1.2 ^ {Tags: ["terminator_arrow", "terminator_last_arrow_middle", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=-29..45}] at @s run summon arrow ^ ^1.2 ^ {Tags: ["terminator_arrow", "terminator_last_arrow_right", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=-29..45}] run tag @s add summoned_arrow

execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=-55..-29}] at @s run summon arrow ^ ^1 ^1.2 {Tags: ["terminator_arrow", "terminator_last_arrow_left", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=-55..-29}] at @s run summon arrow ^ ^1 ^1.2 {Tags: ["terminator_arrow", "terminator_last_arrow_middle", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=-55..-29}] at @s run summon arrow ^ ^1 ^1.2 {Tags: ["terminator_arrow", "terminator_last_arrow_right", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=-55..-29}] run tag @s add summoned_arrow

execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=-70..-55}] at @s run summon arrow ^ ^0.8 ^1.5 {Tags: ["terminator_arrow", "terminator_last_arrow_left", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=-70..-55}] at @s run summon arrow ^ ^0.8 ^1.5 {Tags: ["terminator_arrow", "terminator_last_arrow_middle", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=-70..-55}] at @s run summon arrow ^ ^0.8 ^1.5 {Tags: ["terminator_arrow", "terminator_last_arrow_right", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=-70..-55}] run tag @s add summoned_arrow

execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=-85..-70}] at @s run summon arrow ^ ^0.4 ^2 {Tags: ["terminator_arrow", "terminator_last_arrow_left", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=-85..-70}] at @s run summon arrow ^ ^0.4 ^2 {Tags: ["terminator_arrow", "terminator_last_arrow_middle", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=-85..-70}] at @s run summon arrow ^ ^0.4 ^2 {Tags: ["terminator_arrow", "terminator_last_arrow_right", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=-85..-70}] run tag @s add summoned_arrow

execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=..-85}] at @s run summon arrow ^ ^ ^2 {Tags: ["terminator_arrow", "terminator_last_arrow_left", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=..-85}] at @s run summon arrow ^ ^ ^2 {Tags: ["terminator_arrow", "terminator_last_arrow_middle", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=..-85}] at @s run summon arrow ^ ^ ^2 {Tags: ["terminator_arrow", "terminator_last_arrow_right", "interaction_item_arrow"], life: 1180s, damage: 15.0d, pickup: 0b}
execute as @e[tag=shot_terminator, tag=!summoned_arrow, scores={Rotation_Y=..-85}] run tag @s add summoned_arrow



execute rotated as @e[tag=shot_terminator] positioned 0.0 0.0 0.0 run summon armor_stand ^0.3 ^ ^2.9 {Tags:["terminator_dummy_left", "terminator_dummy"], Invisible: 1b}
execute rotated as @e[tag=shot_terminator] positioned 0.0 0.0 0.0 run summon armor_stand ^ ^ ^3.1 {Tags:["terminator_dummy_middle", "terminator_dummy"], Invisible: 1b}
execute rotated as @e[tag=shot_terminator] positioned 0.0 0.0 0.0 run summon armor_stand ^-0.3 ^ ^2.9 {Tags:["terminator_dummy_right", "terminator_dummy"], Invisible: 1b}

execute as @e[tag=terminator_last_arrow_left] run data modify entity @s Motion set from entity @e[tag=terminator_dummy_left, limit=1] Pos
execute as @e[tag=terminator_last_arrow_middle] run data modify entity @s Motion set from entity @e[tag=terminator_dummy_middle, limit=1] Pos
execute as @e[tag=terminator_last_arrow_right] run data modify entity @s Motion set from entity @e[tag=terminator_dummy_right, limit=1] Pos

execute as @e[tag=terminator_last_arrow_left] run data modify entity @s Owner set from entity @e[tag=shot_terminator, limit=1] UUID
execute as @e[tag=terminator_last_arrow_middle] run data modify entity @s Owner set from entity @e[tag=shot_terminator, limit=1] UUID
execute as @e[tag=terminator_last_arrow_right] run data modify entity @s Owner set from entity @e[tag=shot_terminator, limit=1] UUID

execute as @e[tag=shot_terminator] run kill @e[tag=terminator_dummy]
execute as @e[tag=terminator_last_arrow_left] run tag @s remove terminator_last_arrow_left
execute as @e[tag=terminator_last_arrow_middle] run tag @s remove terminator_last_arrow_middle
execute as @e[tag=terminator_last_arrow_right] run tag @s remove terminator_last_arrow_right
execute as @e[tag=shot_terminator] run tag @s remove shot_terminator
execute as @e[tag=summoned_arrow] run tag @s remove summoned_arrow


# aspect of the void
execute as @e[tag=player_interaction] on target run tag @s[nbt={SelectedItem:{tag:{Tags:["aotv"]}}}, scores={terminator_cooldown=..0}] add aotv_

    # ether warp
    execute as @e[tag=aotv_, scores={issneaking=1..}] run tag @s add will_ether_warp
    execute as @e[tag=will_ether_warp] run tag @s remove aotv_

    execute as @e[tag=will_ether_warp] at @s run function sbitems:ether_warp

    execute as @a run scoreboard players set @s issneaking 0
    # exit

execute as @e[tag=aotv_] at @s run function sbitems:aotv_
# exit



execute as @e[tag=player_interaction] run data remove entity @s interaction
execute as @e[tag=player_interaction] run data remove entity @s attack

execute as @a[x=883, y=131, z=1002, dx=90, dy=42, dz=100] run effect give @s resistance 1 4 true
execute as @e[tag=interaction_item_arrow] at @s if entity @e[type=ender_dragon, distance=..6] run tag @s add undamageable_entity_near_me
execute as @e[tag=undamageable_entity_near_me] at @s run execute as @e[type=ender_dragon, distance=..6] run damage @s 5 arrow by @p
execute as @e[tag=undamageable_entity_near_me] on origin at @s run playsound entity.experience_orb.pickup master @p ~ ~ ~ 0.3 0.8
execute as @e[tag=undamageable_entity_near_me, tag=terminator_arrow] on origin run scoreboard players add @s terminator_hit 1
execute as @e[tag=undamageable_entity_near_me] on origin at @s if entity @s[nbt={SelectedItem:{tag:{Tags:["fatal_tempo"]}}}] run function sbitems:fatal_tempo
kill @e[tag=undamageable_entity_near_me]
    # dragon tracer
    #execute as @e[tag=interaction_item_arrow] at @s if entity @e[type=ender_dragon, distance=..10] run tag @s add dragon_tracing
    #execute as @e[tag=dragon_tracing] run data merge entity @s {Motion: [0.0, 0.0, 0.0]}
    #execute as @e[tag=dragon_tracing] at @s if entity @e[type=ender_dragon, distance=..10] run tp @s ^ ^ ^1 facing entity @e[type=ender_dragon, distance=..10, sort=nearest, limit=1]
    #execute as @e[tag=dragon_tracing] at @s unless entity @e[type=ender_dragon, distance=..10] run data merge entity @s {Motion: [0.0, -1.0, 0.0]}

execute as @e[tag=interaction_item_arrow] at @s if entity @e[type=wither, distance=..4] run tag @s add undamageable_entity_near_me
execute as @e[tag=undamageable_entity_near_me] at @s run execute as @e[type=wither, distance=..4] run damage @s 15 arrow by @p
execute as @e[tag=undamageable_entity_near_me] on origin at @s run playsound entity.experience_orb.pickup master @p ~ ~ ~ 0.4 0.8
execute as @e[tag=undamageable_entity_near_me, tag=terminator_arrow] on origin run scoreboard players add @s terminator_hit 1
execute as @e[tag=undamageable_entity_near_me] on origin at @s if entity @s[nbt={SelectedItem:{tag:{Tags:["fatal_tempo"]}}}] run function sbitems:fatal_tempo
kill @e[tag=undamageable_entity_near_me]

execute as @e[tag=interaction_item_arrow] at @s if entity @e[type=enderman, distance=..3] run tag @s add undamageable_entity_near_me
execute as @e[tag=undamageable_entity_near_me] at @s run execute as @e[type=enderman, distance=..3] run damage @s 15 player_attack by @p
execute as @e[tag=undamageable_entity_near_me] on origin at @s run playsound entity.experience_orb.pickup master @p ~ ~ ~ 0.4 0.8
execute as @e[tag=undamageable_entity_near_me, tag=terminator_arrow] on origin run scoreboard players add @s terminator_hit 1
execute as @e[tag=undamageable_entity_near_me] on origin at @s if entity @s[nbt={SelectedItem:{tag:{Tags:["fatal_tempo"]}}}] run function sbitems:fatal_tempo
kill @e[tag=undamageable_entity_near_me]

execute as @e[tag=interaction_item_arrow] at @s if entity @e[type=!interaction, type=!player, type=!arrow, type=!armor_stand, type=!item, distance=..2] run tag @s add damageable_entity_near_me
execute as @e[tag=damageable_entity_near_me] at @s run execute as @e[type=!interaction, type=!player, type=!arrow, type=!armor_stand, type=!item, distance=..2] run damage @s 15 arrow by @p
execute as @e[tag=damageable_entity_near_me] on origin at @s run playsound entity.experience_orb.pickup master @p ~ ~ ~ 0.4 0.8
execute as @e[tag=damageable_entity_near_me, tag=terminator_arrow] on origin run scoreboard players add @s terminator_hit 1
execute as @e[tag=damageable_entity_near_me] on origin at @s if entity @s[nbt={SelectedItem:{tag:{Tags:["fatal_tempo"]}}}] run function sbitems:fatal_tempo
kill @e[tag=damageable_entity_near_me]
