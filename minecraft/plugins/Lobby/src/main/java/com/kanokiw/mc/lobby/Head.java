package com.kanokiw.mc.lobby;

import java.util.ArrayList;
import java.util.List;
import java.util.Collection;

import org.bukkit.OfflinePlayer;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.entity.Player;



public class Head implements CommandExecutor, TabCompleter {
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player)){
            sender.sendMessage("You can't use this command because you aren't a player!");
            return true;
        }
        String playerName;
        String _command = "give " + sender.getName() + " player_head{SkullOwner: \"";
        if (args.length < 1){
            playerName = sender.getName();
        } else playerName = args[0];
        _command += playerName + "\"}";
        sender.getServer().dispatchCommand(sender.getServer().getConsoleSender(), _command);
        return true;
    }

    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args) {
        List<String> subs = new ArrayList<String>();

        if (args.length == 1){
            OfflinePlayer[] offplayers = sender.getServer().getOfflinePlayers();
            for (OfflinePlayer offplayer : offplayers){
                subs.add(offplayer.getName());
            }
            Collection<? extends Player> onplayers = sender.getServer().getOnlinePlayers();
            for (Player onplayer: onplayers){
                subs.add(onplayer.getName());
            }
        }
        return subs;
    }
}
