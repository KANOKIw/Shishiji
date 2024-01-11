schedule function necron:necron_slow_shoot 16t

execute as @e[tag=necron_skull] run tag @s remove necron_nearest_skull
execute as @e[tag=necron_slow_shoot, tag=!on_middle, tag=!necron_watching_ground, tag=!_waiting] at @s run summon armor_stand ~ ~1.3 ~ {Tags: ["necron_skull", "necron_nearest_skull"], Invisible:true,ArmorItems:[{},{},{},{id:"player_head",Count:1b, tag: {SkullOwner: {Id:[I;1995220249,1805142281,-1428751176,1321653649],Properties:{textures:[{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjk1ZDg3NTE0MGI5OTIzNWVjNWU0NDg2MjQyYTcwZGE4ODFhN2MxODNiNjUwY2VhZmFlMDA4NGJjZWI2NjE4MiJ9fX0="}]}}}}]}
execute as @e[tag=necron_slow_shoot, tag=!on_middle, tag=!necron_watching_ground, tag=!_waiting] at @s run playsound entity.wither.shoot hostile @a ~ ~ ~ 0.5 1

execute as @e[tag=necron_slow_shoot, tag=!on_middle, tag=!necron_watching_ground, tag=!_waiting] at @s run summon armor_stand ~ ~1.3 ~ {Tags: ["necron_skull", "necron_nearest_skull"], Invisible:true,ArmorItems:[{},{},{},{id:"player_head",Count:1b, tag: {SkullOwner: {Id:[I;1995220249,1805142281,-1428751176,1321653649],Properties:{textures:[{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYjk1ZDg3NTE0MGI5OTIzNWVjNWU0NDg2MjQyYTcwZGE4ODFhN2MxODNiNjUwY2VhZmFlMDA4NGJjZWI2NjE4MiJ9fX0="}]}}}}]}
execute as @e[tag=necron_slow_shoot, tag=!on_middle, tag=!necron_watching_ground, tag=!_waiting] at @s run playsound entity.wither.shoot hostile @a ~ ~ ~ 0.5 1

execute as @e[tag=necron_nearest_skull] at @s run tp @s ~ ~ ~ facing entity @p
