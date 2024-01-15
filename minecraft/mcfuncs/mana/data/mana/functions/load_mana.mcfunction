scoreboard objectives add mana_max dummy "最大マナ"
scoreboard objectives add mana_current dummy "現在マナ"
scoreboard objectives add mana_recover dummy "回復マナ"
scoreboard players set mana_k mana_recover 50

function mana:recover