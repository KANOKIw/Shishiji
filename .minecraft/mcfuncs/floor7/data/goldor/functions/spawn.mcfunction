kill @e[tag=goldor]
kill @e[tag=goldor_front_dummy]
summon wither 943 36 1065 {Tags: ["goldor", "phase_0", "cant_dealme", "floor7_boss"], NoAI: 1b, CustomNameVisible:1b, CustomName:'[{"text":"﴾ ","color":"yellow","bold": true},{"text":"Goldor","color":"red","bold": true},{"text":" ﴿","color":"yellow","bold": true}]', Health: 149}

summon armor_stand 943 36 1065 {Tags: ["goldor_front_dummy"], Invisible: 1b, Invulnerable: 1b, NoGravity: 1b}
execute as @e[tag=goldor] run effect give @s resistance infinite 255 true
scoreboard players set @e[tag=goldor] Boss_Health 750
execute as @e[tag=goldor] run scoreboard players set @s swords_summoned 0
schedule clear goldor:summon_golden_sword
function goldor:summon_golden_sword

bossbar add goldor_health [{"text": "Goldor", "color": "red"}]
bossbar set goldor_health color red
bossbar set goldor_health max 750
bossbar set goldor_health players @a[x=860, y=-100, z=960, dx=160, dy=500, dz=140]
execute as @e[tag=goldor] store result bossbar goldor_health value run scoreboard players get @s Boss_Health

