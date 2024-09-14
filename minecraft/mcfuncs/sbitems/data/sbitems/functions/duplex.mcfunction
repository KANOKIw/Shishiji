execute as @e[tag=will_shoot_duplexed_arrow] at @s run playsound entity.arrow.shoot block @s ~ ~ ~ 1 0.7

execute as @e[tag=will_shoot_duplexed_arrow, tag=!summoned_duplex_arrow, scores={Rotation_Y=75..}] at @s run summon arrow ^ ^ ^ {Tags: ["duplexed_arrow", "duplexed_arrow_latest", "terminator_arrow", "interaction_item_arrow"], life: 1180s, damage: 10.0d, pickup: 0b}
execute as @e[tag=will_shoot_duplexed_arrow, tag=!summoned_duplex_arrow, scores={Rotation_Y=75..}] run tag @s add summoned_duplex_arrow

execute as @e[tag=will_shoot_duplexed_arrow, tag=!summoned_duplex_arrow, scores={Rotation_Y=60..75}] at @s run summon arrow ^ ^0.2 ^ {Tags: ["duplexed_arrow", "duplexed_arrow_latest", "terminator_arrow", "interaction_item_arrow"], life: 1180s, damage: 10.0d, pickup: 0b}
execute as @e[tag=will_shoot_duplexed_arrow, tag=!summoned_duplex_arrow, scores={Rotation_Y=60..75}] run tag @s add summoned_duplex_arrow

execute as @e[tag=will_shoot_duplexed_arrow, tag=!summoned_duplex_arrow, scores={Rotation_Y=45..60}] at @s run summon arrow ^ ^0.4 ^ {Tags: ["duplexed_arrow", "duplexed_arrow_latest", "terminator_arrow", "interaction_item_arrow"], life: 1180s, damage: 10.0d, pickup: 0b}
execute as @e[tag=will_shoot_duplexed_arrow, tag=!summoned_duplex_arrow, scores={Rotation_Y=45..60}] run tag @s add summoned_duplex_arrow

execute as @e[tag=will_shoot_duplexed_arrow, tag=!summoned_duplex_arrow, scores={Rotation_Y=-29..45}] at @s run summon arrow ^ ^0.6 ^ {Tags: ["duplexed_arrow", "duplexed_arrow_latest", "terminator_arrow", "interaction_item_arrow"], life: 1180s, damage: 10.0d, pickup: 0b}
execute as @e[tag=will_shoot_duplexed_arrow, tag=!summoned_duplex_arrow, scores={Rotation_Y=-29..45}] run tag @s add summoned_duplex_arrow

execute as @e[tag=will_shoot_duplexed_arrow, tag=!summoned_duplex_arrow, scores={Rotation_Y=-29..}] at @s run summon arrow ^ ^0.7 ^ {Tags: ["duplexed_arrow", "duplexed_arrow_latest", "terminator_arrow", "interaction_item_arrow"], life: 1180s, damage: 10.0d, pickup: 0b}
execute as @e[tag=will_shoot_duplexed_arrow, tag=!summoned_duplex_arrow, scores={Rotation_Y=-29..}] run tag @s add summoned_duplex_arrow

execute as @e[tag=will_shoot_duplexed_arrow, tag=!summoned_duplex_arrow, scores={Rotation_Y=-55..-29}] at @s run summon arrow ^ ^0.8 ^1.2 {Tags: ["duplexed_arrow", "duplexed_arrow_latest", "terminator_arrow", "interaction_item_arrow"], life: 1180s, damage: 10.0d, pickup: 0b}
execute as @e[tag=will_shoot_duplexed_arrow, tag=!summoned_duplex_arrow, scores={Rotation_Y=-55..-29}] run tag @s add summoned_duplex_arrow

execute as @e[tag=will_shoot_duplexed_arrow, tag=!summoned_duplex_arrow, scores={Rotation_Y=-70..-55}] at @s run summon arrow ^ ^0.6 ^1.5 {Tags: ["duplexed_arrow", "duplexed_arrow_latest", "terminator_arrow", "interaction_item_arrow"], life: 1180s, damage: 10.0d, pickup: 0b}
execute as @e[tag=will_shoot_duplexed_arrow, tag=!summoned_duplex_arrow, scores={Rotation_Y=-70..-55}] run tag @s add summoned_duplex_arrow

execute as @e[tag=will_shoot_duplexed_arrow, tag=!summoned_duplex_arrow, scores={Rotation_Y=-85..-70}] at @s run summon arrow ^ ^0.2 ^2 {Tags: ["duplexed_arrow", "duplexed_arrow_latest", "terminator_arrow", "interaction_item_arrow"], life: 1180s, damage: 10.0d, pickup: 0b}
execute as @e[tag=will_shoot_duplexed_arrow, tag=!summoned_duplex_arrow, scores={Rotation_Y=-85..-70}] run tag @s add summoned_duplex_arrow

execute as @e[tag=will_shoot_duplexed_arrow, tag=!summoned_duplex_arrow, scores={Rotation_Y=..-85}] at @s run summon arrow ^ ^ ^2 {Tags: ["duplexed_arrow", "duplexed_arrow_latest", "terminator_arrow", "interaction_item_arrow"], life: 1180s, damage: 10.0d, pickup: 0b}
execute as @e[tag=will_shoot_duplexed_arrow, tag=!summoned_duplex_arrow, scores={Rotation_Y=..-85}] run tag @s add summoned_duplex_arrow

execute as @e[tag=duplexed_arrow_latest] run data modify entity @s Owner set from entity @e[tag=will_shoot_duplexed_arrow, limit=1] UUID
execute as @e[tag=will_shoot_duplexed_arrow] at @s run execute rotated as @s positioned 0.0 0.0 0.0 run summon armor_stand ^ ^ ^2 {Tags:["duplex_dummy"], Invisible: 1b}
execute as @e[tag=will_shoot_duplexed_arrow] at @s run execute as @e[tag=duplexed_arrow_latest] run data modify entity @s Motion set from entity @e[tag=duplex_dummy, limit=1] Pos
execute as @e[tag=will_shoot_duplexed_arrow] run kill @e[tag=duplex_dummy]
execute as @e[tag=duplexed_arrow_latest] run tag @s remove duplexed_arrow_latest
execute as @e[tag=will_shoot_duplexed_arrow] run tag @s remove will_shoot_duplexed_arrow
