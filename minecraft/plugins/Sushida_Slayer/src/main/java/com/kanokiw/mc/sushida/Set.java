package com.kanokiw.mc.sushida;

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;

import java.util.ArrayList;
import java.util.List;


public class Set implements CommandExecutor, TabCompleter {
    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String label, String[] args){
        List<String> candidates = new ArrayList<>();
        if (args.length == 1){
            candidates.add("broken_heart_radiation_range");
        }
        return candidates;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args){
        if (args.length > 1){
            switch (args[0]){
                case "broken_heart_radiation_range":
                    Slayer.broken_heart_radiation_range = Long.valueOf(args[1]);
            }
        }
        return true;
    }
}
