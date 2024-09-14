package com.kanokiw.mc.lobby;

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.Location;


public class Middle implements CommandExecutor {
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player)){
            sender.sendMessage("You can't use this command because you aren't a player!");
            return true;
        }
        Player whoPlayer = (Player) sender;
        Location lobbyLocation = new Location(whoPlayer.getWorld(), 9.5, 82.0, 2.5, 0, 0);
        whoPlayer.teleport(lobbyLocation);
        whoPlayer.playSound(lobbyLocation, "minecraft:entity.enderman.teleport", 1, 1);
        return true;
    }
}
