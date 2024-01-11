kill @e[tag=necron]
schedule clear necron:give_darkness
schedule clear necron:on_middle
schedule clear necron:remove_on_middle

bossbar remove necron_health
summon wither 943 -14 1029 {Tags: ["necron", "_waiting", "cant_dealme", "floor7_boss"], NoAI: 1b, CustomNameVisible:1b, CustomName:'[{"text":"﴾ ","color":"yellow","bold": true},{"text":"Necron","color":"red","bold": true},{"text":" ﴿","color":"yellow","bold": true}]', Health: 149}
kill @e[tag=necorn_front_dummy]

execute as @e[tag=necron] run effect give @s resistance 8 255 true
summon armor_stand ~ ~ ~ {Tags: ["necorn_front_dummy"], NoGravity: 1b, Invisible: 1b, Invulnerable: 1b}
execute as @e[tag=necron] run scoreboard players set @s Boss_Health 1000

schedule function necron:remove_waiting 8s replace

function necron:remove_on_middle

bossbar add necron_health  [{"text":"Necron","color":"red"}]
bossbar set necron_health max 1000
bossbar set necron_health color red
execute as @e[tag=necron] at @s run bossbar set necron_health players @a[x=860, y=-100, z=960, dx=160, dy=500, dz=140]
