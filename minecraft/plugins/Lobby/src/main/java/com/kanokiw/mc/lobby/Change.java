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
import org.bukkit.event.inventory.ClickType;
import org.bukkit.ChatColor;

import net.md_5.bungee.api.chat.BaseComponent;
import net.md_5.bungee.api.chat.ClickEvent;
import net.md_5.bungee.api.chat.ComponentBuilder;
import net.md_5.bungee.api.chat.HoverEvent;
import net.md_5.bungee.api.chat.TextComponent;



public class Change implements CommandExecutor, TabCompleter {
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (args.length < 1){
            return true;
        }
        if (args[0].equals("delay") && args.length > 1){
            try {
                Lobby.joinSoundDelay = Long.parseLong(args[1]);
            } catch (NumberFormatException e){
                HoverEvent _h = new HoverEvent(HoverEvent.Action.SHOW_TEXT, new ComponentBuilder(ChatColor.RED+"詳細")
                    .create());
                ClickEvent _c = new ClickEvent(ClickEvent.Action.RUN_COMMAND, "/grsn NumberFormatException: "+e.getMessage());
                sender.spigot().sendMessage((BaseComponent[]) new ComponentBuilder("エラー！")
                    .event(_h)
                    .event(_c)
                    .create());
            }
        } else if (args[0].equals("sound")){
            Lobby.playJoinSound((Player) sender);
        }
        return false;
    }

    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args) {
        List<String> subs = new ArrayList<String>();

        if (args.length == 1){
            subs.add("delay");
            subs.add("sound");
        }
        return subs;
    }
}
