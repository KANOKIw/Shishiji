tag @s add showing_not_enough_mana
title @a[tag=showing_not_enough_mana, tag=!not_enought_mana_functioned] actionbar {"text": "NOT ENOUGH MANA", "color": "red", "bold": true}
execute as @a[tag=showing_not_enough_mana, tag=!not_enought_mana_functioned] at @s run playsound entity.enderman.teleport master @s ~ ~ ~ 1 0.5
tag @a[tag=showing_not_enough_mana, tag=!not_enought_mana_functioned] add not_enought_mana_functioned
execute as @s run schedule function mana:remove_not_enough_mana_tag 2s replace