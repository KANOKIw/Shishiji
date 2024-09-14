schedule function maxor:maxor_skull_spam 4t

execute as @e[tag=maxor_skull_spamed] run tag @s remove maxor_nearest_skull_spamed

execute as @e[type=wither,tag=maxor_phase_1, tag=!maxor_phase_2_fireball, tag=maxor_moveto_skull_spam] at @s run summon armor_stand ~ ~1.3 ~ {Tags: ["maxor_skull_spamed", "maxor_nearest_skull_spamed"], Invisible:true,ArmorItems:[{},{},{},{id:"player_head",Count:1b, tag: {SkullOwner: {Id:[I;1995220249,1805142281,-1428751176,1321653649],Properties:{textures:[{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjk1ZDg3NTE0MGI5OTIzNWVjNWU0NDg2MjQyYTcwZGE4ODFhN2MxODNiNjUwY2VhZmFlMDA4NGJjZWI2NjE4MiJ9fX0="}]}}}}]}
execute as @e[tag=maxor_phase_1, tag=!maxor_phase_2_fireball, tag=maxor_moveto_skull_spam] at @s run playsound entity.wither.shoot hostile @a ~ ~ ~ 2 1

execute as @e[type=wither,tag=maxor_phase_2, tag=!maxor_phase_2_fireball, tag=maxor_moveto_skull_spam] at @s run summon armor_stand ~ ~1.3 ~ {Tags: ["maxor_skull_spamed", "maxor_nearest_skull_spamed"], Invisible:true,ArmorItems:[{},{},{},{id:"player_head",Count:1b, tag: {SkullOwner: {Id:[I;1995220249,1805142281,-1428751176,1321653649],Properties:{textures:[{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjk1ZDg3NTE0MGI5OTIzNWVjNWU0NDg2MjQyYTcwZGE4ODFhN2MxODNiNjUwY2VhZmFlMDA4NGJjZWI2NjE4MiJ9fX0="}]}}}}]}
execute as @e[tag=maxor_phase_2, tag=!maxor_phase_2_fireball, tag=maxor_moveto_skull_spam] at @s run playsound entity.wither.shoot hostile @a ~ ~ ~ 2 1

execute as @e[tag=maxor_nearest_skull_spamed] at @s run tp @s ~ ~ ~ facing entity @p
