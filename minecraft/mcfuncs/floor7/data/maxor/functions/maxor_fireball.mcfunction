schedule function maxor:maxor_fireball 10t

execute as @e[tag=maxor_fireball] run tag @s remove maxor_nearest_fireball

execute as @e[tag=maxor_phase_2_fireball] at @s run summon item_display ~ ~1.3 ~ {Tags: ["maxor_fireball", "maxor_nearest_fireball"], item:{id:"fire_charge", Count: 1b}, billboard: "center", transformation:[3.0f, 0f, 0f, -0.375f, 0f, 3.0f, 0f, -0.375f, 0f, 0f, 3.0f, -0.375f, 0f, 0f, 0f, 1f]}
execute as @e[tag=maxor_phase_2_fireball] at @s run playsound minecraft:entity.wither.shoot hostile @a ~ ~ ~ 3 0.6

execute as @e[tag=maxor_nearest_fireball] at @s run tp @s ~ ~ ~ facing entity @p
