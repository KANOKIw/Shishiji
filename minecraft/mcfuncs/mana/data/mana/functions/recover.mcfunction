execute as @a run scoreboard players operation @s mana_recover = @s mana_max
execute as @a run scoreboard players operation @s mana_recover /= mana_k mana_recover
execute as @a run scoreboard players operation @s mana_current += @s mana_recover
execute as @a if score @s mana_current > @s mana_max run scoreboard players operation @s mana_current = @s mana_max

schedule function mana:recover 1s