package com.kanokiw.mc.funcs;

import net.md_5.bungee.api.ChatColor;
import net.md_5.bungee.api.CommandSender;
import net.md_5.bungee.api.plugin.Command;
import net.md_5.bungee.api.chat.TextComponent;


public class Grsn extends Command {

    public Grsn() {
        super("grsn");
    }

    @Override
    public void execute(CommandSender sender, String[] args) {
        if (args.length < 1) {
            sender.sendMessage(new TextComponent(ChatColor.RED + "このコマンドを使用する権限がありません！"));
            return;
        }
        String _a = "";
        for (String a : args){
            _a = _a +" "+ a;
        }
        sender.sendMessage(new TextComponent(ChatColor.GRAY + _a));
    }
}
