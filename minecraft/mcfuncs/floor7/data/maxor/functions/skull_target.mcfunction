schedule function maxor:skull_target 8t

execute as @e[tag=maxor_skull] run tag @s remove maxor_nearest_skull
execute as @e[tag=maxor_phase_1, tag=!maxor_moveto_2ndtarget, tag=!maxor_moveto_skull_spam, tag=!maxor_slow_shoot] at @s run summon armor_stand ~ ~1.3 ~ {Tags: ["maxor_skull", "maxor_nearest_skull"], Invisible:true,ArmorItems:[{},{},{},{id:"player_head",Count:1b, tag: {SkullOwner: {Id:[I;1995220249,1805142281,-1428751176,1321653649],Properties:{textures:[{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjk1ZDg3NTE0MGI5OTIzNWVjNWU0NDg2MjQyYTcwZGE4ODFhN2MxODNiNjUwY2VhZmFlMDA4NGJjZWI2NjE4MiJ9fX0="}]}}}}]}
execute as @e[tag=maxor_phase_1, tag=!maxor_moveto_2ndtarget, tag=!maxor_moveto_skull_spam, tag=!maxor_slow_shoot] at @s run playsound entity.wither.shoot hostile @a ~ ~ ~ 0.5 1

execute as @e[tag=maxor_phase_2, tag=!maxor_moveto_2ndtarget, tag=!maxor_moveto_skull_spam, tag=!maxor_slow_shoot] at @s run summon armor_stand ~ ~1.3 ~ {Tags: ["maxor_skull", "maxor_nearest_skull"], Invisible:true,ArmorItems:[{},{},{},{id:"player_head",Count:1b, tag: {SkullOwner: {Id:[I;1995220249,1805142281,-1428751176,1321653649],Properties:{textures:[{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjk1ZDg3NTE0MGI5OTIzNWVjNWU0NDg2MjQyYTcwZGE4ODFhN2MxODNiNjUwY2VhZmFlMDA4NGJjZWI2NjE4MiJ9fX0="}]}}}}]}
execute as @e[tag=maxor_phase_2, tag=!maxor_moveto_2ndtarget, tag=!maxor_moveto_skull_spam, tag=!maxor_slow_shoot] at @s run playsound entity.wither.shoot hostile @a ~ ~ ~ 0.5 1

execute as @e[tag=maxor_nearest_skull] at @s run tp @s ~ ~ ~ facing entity @p
