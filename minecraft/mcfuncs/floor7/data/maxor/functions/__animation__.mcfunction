execute as @e[tag=maxor_can_be_caught, tag=!maxor_energy_charged] unless entity @e[tag=maxor_crystal] run tag @e[tag=left_energy_dummy_waiting] add left_energy_dummy_moving_to_front
execute as @e[tag=maxor_can_be_caught, tag=!maxor_energy_charged] unless entity @e[tag=maxor_crystal] run tag @e[tag=left_energy_dummy_waiting] remove left_energy_dummy_waiting
execute as @e[tag=maxor_can_be_caught, tag=!maxor_energy_charged] unless entity @e[tag=maxor_crystal] run tag @e[tag=right_energy_dummy_waiting] add right_energy_dummy_moving_to_left
execute as @e[tag=maxor_can_be_caught, tag=!maxor_energy_charged] unless entity @e[tag=maxor_crystal] run tag @e[tag=right_energy_dummy_waiting] remove right_energy_dummy_waiting
