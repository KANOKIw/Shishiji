execute as @e[tag=maxor_caught_phase_1] at @s run tp @s ~ ~ ~ ~ 0
execute as @e[tag=maxor_caught_phase_2] at @s run tp @s ~ ~ ~ ~ 0

execute unless entity @e[tag=maxor_spawn_setup_done] run kill @e[tag=maxor_crystal]
execute as @e[tag=maxor_phase_0] run effect give @s resistance infinite 255 true
execute as @e[tag=maxor_phase_1] run effect give @s resistance infinite 255 true
execute as @e[tag=maxor_phase_2] run effect give @s resistance infinite 255 true
execute as @e[tag=maxor_watching_ground] run effect give @s resistance infinite 255 true
execute as @e[tag=maxor_caught_phase_1] run effect clear @s resistance
execute as @e[tag=maxor_caught_phase_1] run effect give @s resistance infinite 3 true
execute as @e[tag=maxor_caught_phase_2] run effect clear @s resistance
execute as @e[tag=maxor_caught_phase_2] run effect give @s resistance infinite 3 true
execute as @e[tag=left_energy_dummy_waiting] at @s run tp @s 903 138 1062
execute as @e[tag=right_energy_dummy_waiting] at @s run tp @s 943 138 1064

execute as @e[tag=maxor_phase_2_target] store result bossbar maxor_health value run scoreboard players get @e[tag=maxor_spawn_setup_done, sort=nearest, limit=1] Boss_Health

execute unless entity @e[tag=left_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 903 138 1060 903 138 1057 coal_block
execute unless entity @e[tag=left_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 903 138 1057 915 138 1057 coal_block
execute unless entity @e[tag=left_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 915 138 1057 915 138 1055 coal_block

execute unless entity @e[tag=right_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 941 138 1064 933 138 1064 coal_block
execute unless entity @e[tag=right_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 933 138 1064 933 138 1055 coal_block
execute unless entity @e[tag=right_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 945 138 1056 945 150 1056 coal_block
execute unless entity @e[tag=right_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 945 150 1056 945 150 1053 coal_block
execute unless entity @e[tag=right_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 953 150 1051 948 150 1051 coal_block
execute unless entity @e[tag=right_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 945 138 1047 945 138 1041 coal_block
execute unless entity @e[tag=right_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 945 138 1041 955 138 1041 coal_block
execute unless entity @e[tag=right_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 955 138 1041 955 149 1041 coal_block
execute unless entity @e[tag=right_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 955 149 1041 959 149 1041 coal_block
execute unless entity @e[tag=right_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 962 152 1032 962 151 1032 coal_block
execute unless entity @e[tag=right_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 962 151 1032 928 151 1032 coal_block
execute unless entity @e[tag=right_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 934 138 1084 934 141 1084 coal_block
execute unless entity @e[tag=right_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 934 141 1084 937 141 1084 coal_block

execute unless entity @e[tag=left_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 901 138 1071 901 154 1071 coal_block
execute unless entity @e[tag=left_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 901 154 1071 893 154 1071 coal_block
execute unless entity @e[tag=left_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 899 152 1051 899 152 1055 coal_block
execute unless entity @e[tag=left_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 899 152 1055 903 152 1055 coal_block
execute unless entity @e[tag=left_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 903 152 1055 903 152 1053 coal_block
execute unless entity @e[tag=left_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 892 153 1048 892 153 1041 coal_block
execute unless entity @e[tag=left_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 892 153 1041 889 153 1041 coal_block
execute unless entity @e[tag=left_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 903 149 1048 903 149 1046 coal_block
execute unless entity @e[tag=left_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 903 149 1046 902 149 1046 coal_block
execute unless entity @e[tag=left_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 902 149 1046 902 149 1045 coal_block
execute unless entity @e[tag=left_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 902 149 1045 902 138 1045 coal_block
execute unless entity @e[tag=left_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 920 151 1032 886 151 1032 coal_block
execute unless entity @e[tag=left_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 886 151 1032 886 153 1032 coal_block

execute unless entity @e[tag=left_crystal_broken, tag=right_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 924 153 1041 924 153 1036 coal_block
execute unless entity @e[tag=left_crystal_broken, tag=right_crystal_broken] unless entity @e[tag=maxor_watching_ground] run fill 918 153 1041 930 153 1041 coal_block


execute unless entity @e[tag=maxor_spawn_setup_done] run bossbar remove maxor_health

execute as @e[tag=left_energy_dummy] at @s run setblock ~ ~ ~ sea_lantern
execute as @e[tag=right_energy_dummy] at @s run setblock ~ ~ ~ sea_lantern
execute as @e[tag=left_middle_front_energy_dummy] at @s run setblock ~ ~ ~ sea_lantern

execute as @e[tag=maxor_front_dummy] at @e[tag=maxor_spawn_setup_done, tag=!maxor_caught_phase_1, tag=!maxor_caught_phase_2] run tp @s ^ ^ ^20
execute as @e[tag=maxor_front_dummy] run data merge entity @s {Fire: -1s}

# confused_mark motion
execute as @e[tag=maxor_caught_phase_1] at @s run tp @e[tag=confused_mark] ~ ~2.8 ~
execute as @e[tag=maxor_caught_phase_1] at @e[tag=confused_mark] run tp @e[tag=confused_mark] ~ ~ ~ ~20 ~
execute as @e[tag=maxor_caught_phase_2, tag=!maxor_watching_ground] at @s run tp @e[tag=confused_mark] ~ ~2.8 ~
execute as @e[tag=maxor_caught_phase_2, tag=!maxor_watching_ground] at @e[tag=confused_mark] run tp @e[tag=confused_mark] ~ ~ ~ ~20 ~


execute as @e[tag=confused_mark] unless entity @e[tag=maxor_can_be_caught] run tp @s 926 150 1034
execute as @e[tag=confused_mark] if entity @e[tag=maxor_watching_ground] run tp @s 926 150 1034

execute unless entity @e[tag=maxor_spawn_setup_done] run kill @e[tag=left_energy_dummy]
execute unless entity @e[tag=maxor_spawn_setup_done] run kill @e[tag=right_energy_dummy]

fill 895 138 1094 966 138 1012 air replace fire



execute as @e run execute store result score @s Health run data get entity @s Health
execute as @e run execute store result score @s Rotation_Y run data get entity @s Rotation[1]

execute as @e run execute store result score @s Position_X run data get entity @s Pos[0]
execute as @e run execute store result score @s Position_Y run data get entity @s Pos[1]
execute as @e run execute store result score @s Position_Z run data get entity @s Pos[2]
