package com.kanokiw.mc.funcs;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import net.md_5.bungee.api.ChatColor;
import net.md_5.bungee.api.CommandSender;
import net.md_5.bungee.api.plugin.Command;
import net.md_5.bungee.api.chat.BaseComponent;
import net.md_5.bungee.api.chat.ComponentBuilder;
import net.md_5.bungee.api.chat.TextComponent;

public class Chat extends Command {
    static ChatColor cr = ChatColor.RED;
    static ChatColor cb = ChatColor.BLUE;
    static ChatColor cg = ChatColor.GREEN;
    static ChatColor cg_ = ChatColor.GOLD;
    static ChatColor cy = ChatColor.YELLOW;
    static ChatColor ca = ChatColor.AQUA;
    public Chat() {
        super("chat");
    }

    @Override
    public void execute(CommandSender sender, String[] args) {
        // Avoid null Object Error
        if (args.length < 1){
            sender.sendMessage(new TextComponent(ChatColor.RED + "使用方法: /chat <all/party>"));
            return;
        }
        String a1 = args[0];
        if (a1.equals("a")) a1 = "all";
        if (a1.equals("p")) a1 = "party";
        if (!a1.equals("all") && !a1.equals("party")){
            sender.sendMessage(new TextComponent(ChatColor.RED + "使用方法: /chat <all/party>"));
            return;
        }//
        String value = Events.whatChat.get(sender.getName());
        if (value != null && value.equals(a1)){
            sender.sendMessage(new TextComponent(ChatColor.RED+"既にこのチャンネルに参加しています！"));
            return;
        }
        if (a1.equals("party") && Party.partiesMap.get(sender.getName().toLowerCase()) == null) {
            PlayerParty._notifyBaseComponents(new ComponentBuilder(ChatColor.RED+"Party チャンネルに参加するには、Party に参加している必要があります！").create(), sender.getName());
            return;
        }
        Events.whatChat.put(sender.getName(), a1);
        String chatType = "全体";
        if (a1.equals("party")) chatType = "Party";
        sender.sendMessage(new TextComponent(ChatColor.GREEN+"あなたは現在 "+ChatColor.GOLD+chatType+ChatColor.GREEN+" チャンネルにいます"));
    }
}
