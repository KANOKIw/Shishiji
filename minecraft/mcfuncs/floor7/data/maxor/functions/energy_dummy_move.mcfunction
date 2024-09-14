execute as @e[tag=left_energy_dummy_moving_to_front] at @s run tp @s ~ ~ ~-0.8
execute as @e[tag=left_energy_dummy_moving_to_right] at @s run tp @s ~0.8 ~ ~
execute as @e[tag=right_energy_dummy_moving_to_front] at @s run tp @s ~ ~ ~-0.8
execute as @e[tag=right_energy_dummy_moving_to_left] at @s run tp @s ~-0.8 ~ ~



execute as @e[tag=right_energy_dummy_moving_to_left] at @s if block ~ ~-1 ~ redstone_block run tag @s add right_energy_dummy_moving_to_front
execute as @e[tag=right_energy_dummy_moving_to_left] at @s if block ~ ~-1 ~ redstone_block run tag @s remove right_energy_dummy_moving_to_left
execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run execute as @e[tag=maxor_spawn_setup_done, tag=right_crystal_broken, tag=left_crystal_broken, tag=!maxor_can_be_caught] at @s run fill 918 153 1041 930 153 1041 sea_lantern
execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run execute as @e[tag=maxor_spawn_setup_done, tag=right_crystal_broken, tag=left_crystal_broken, tag=!maxor_can_be_caught] at @s run fill 924 153 1041 924 153 1036 sea_lantern
execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run execute as @e[tag=maxor_spawn_setup_done, tag=right_crystal_broken, tag=left_crystal_broken, tag=!maxor_can_be_caught] at @s run title @a[distance=..200] times 1t 2s 1t
execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run execute as @e[tag=maxor_spawn_setup_done, tag=right_crystal_broken, tag=left_crystal_broken, tag=!maxor_can_be_caught] at @s run title @a[distance=..200] subtitle {"text": "The Energy Laser is charging up!", "color": "green"}
execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run execute as @e[tag=maxor_spawn_setup_done, tag=right_crystal_broken, tag=left_crystal_broken, tag=!maxor_can_be_caught] at @s run title @a[distance=..200] title {"text": ""}

execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run fill 945 138 1056 945 150 1056 sea_lantern
execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run fill 945 150 1056 945 150 1053 sea_lantern
execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run fill 953 150 1051 948 150 1051 sea_lantern
execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run fill 945 138 1047 945 138 1041 sea_lantern
execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run fill 945 138 1041 955 138 1041 sea_lantern
execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run fill 955 138 1041 955 149 1041 sea_lantern
execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run fill 955 149 1041 959 149 1041 sea_lantern
execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run fill 962 152 1032 962 151 1032 sea_lantern
execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run fill 962 151 1032 928 151 1032 sea_lantern
#
execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run fill 934 138 1084 934 141 1084 sea_lantern
execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run fill 934 141 1084 937 141 1084 sea_lantern

execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run execute as @e[tag=maxor_spawn_setup_done, tag=right_crystal_broken, tag=left_crystal_broken, tag=!maxor_can_be_caught] run tag @s add maxor_can_be_caught
execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run tag @s add right_energy_dummy_waiting
execute as @e[tag=right_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ pink_wool run tag @s remove right_energy_dummy_moving_to_front



execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ slime_block run tag @s add left_energy_dummy_moving_to_right
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ slime_block run tag @s remove left_energy_dummy_moving_to_front

execute as @e[tag=left_energy_dummy_moving_to_right] at @s if block ~ ~-1 ~ blue_wool run tag @s add left_energy_dummy_moving_to_front
execute as @e[tag=left_energy_dummy_moving_to_right] at @s if block ~ ~-1 ~ blue_wool run tag @s remove left_energy_dummy_moving_to_right

execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run execute as @e[tag=maxor_spawn_setup_done, tag=right_crystal_broken, tag=left_crystal_broken, tag=!maxor_can_be_caught] at @s run fill 918 153 1041 930 153 1041 sea_lantern
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run execute as @e[tag=maxor_spawn_setup_done, tag=right_crystal_broken, tag=left_crystal_broken, tag=!maxor_can_be_caught] at @s run fill 924 153 1041 924 153 1036 sea_lantern
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run execute as @e[tag=maxor_spawn_setup_done, tag=right_crystal_broken, tag=left_crystal_broken, tag=!maxor_can_be_caught] at @s run title @a[distance=..200] times 1t 2s 1t
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run execute as @e[tag=maxor_spawn_setup_done, tag=right_crystal_broken, tag=left_crystal_broken, tag=!maxor_can_be_caught] at @s run title @a[distance=..200] subtitle {"text": "The Energy Laser is charging up!", "color": "green"}
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run execute as @e[tag=maxor_spawn_setup_done, tag=right_crystal_broken, tag=left_crystal_broken, tag=!maxor_can_be_caught] at @s run title @a[distance=..200] title {"text": ""}
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run execute as @e[tag=maxor_spawn_setup_done, tag=right_crystal_broken, tag=left_crystal_broken, tag=!maxor_can_be_caught] run tag @s add maxor_can_be_caught

execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run fill 901 138 1071 901 154 1071 sea_lantern
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run fill 901 154 1071 893 154 1071 sea_lantern
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run fill 899 152 1051 899 152 1055 sea_lantern
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run fill 899 152 1055 903 152 1055 sea_lantern
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run fill 903 152 1055 903 152 1053 sea_lantern
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run fill 892 153 1048 892 153 1041 sea_lantern
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run fill 892 153 1041 889 153 1041 sea_lantern
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run fill 903 149 1048 903 149 1046 sea_lantern
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run fill 903 149 1046 902 149 1046 sea_lantern
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run fill 902 149 1046 902 149 1045 sea_lantern
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run fill 902 149 1045 902 138 1045 sea_lantern
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run fill 920 151 1032 886 151 1032 sea_lantern
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run fill 886 151 1032 886 153 1032 sea_lantern

execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run tag @s add left_energy_dummy_waiting
execute as @e[tag=left_energy_dummy_moving_to_front] at @s if block ~ ~-1 ~ orange_concrete run tag @s remove left_energy_dummy_moving_to_front

