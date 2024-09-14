package com.kanokiw.mc.sushida;

import java.util.ArrayList;
import java.util.List;

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.entity.Player;


public class Spawn implements CommandExecutor, TabCompleter {
    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String label, String[] args){
        List<String> candidates = new ArrayList<>();
        if (args.length == 1){
            candidates.add("voidgloom");
        }
        return candidates;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args){
        if (args.length >= 1){
            if (args[0].equals("voidgloom")){
                Slayer.spawnVoidgloom(Slayer.plugin.getServer().getWorld("world"), ((Player) sender).getLocation(), (Player) sender);
            }
        }
        return true;
    }
}
