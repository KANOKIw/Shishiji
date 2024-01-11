execute as @e[tag=necron] at @s run effect give @a[x=860, y=-100, z=960, dx=160, dy=500, dz=140] darkness infinite 1 true
execute as @e[tag=necron] run tag @s add cant_dealme
schedule function necron:add_dealme 15s
schedule function necron:on_middle 2s
