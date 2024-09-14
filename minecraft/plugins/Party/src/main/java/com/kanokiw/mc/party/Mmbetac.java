package com.kanokiw.mc.funcs;

import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;
import net.md_5.bungee.api.ChatColor;
import net.md_5.bungee.api.CommandSender;
import net.md_5.bungee.api.plugin.Command;
import net.md_5.bungee.api.chat.TextComponent;
import net.md_5.bungee.api.config.ServerInfo;
import net.md_5.bungee.api.ProxyServer;

public class Mmbetac extends Command {
    protected String[] __servers__ = {"lobby", "super-flat", "survival", "limbo"};
    public static List<String> __experiedSessions__ = new ArrayList<String>();
    public Mmbetac() {
        super("mmbetac", null, "mmbetacl");
    }

    @Override
    public void execute(CommandSender sender, String[] args) {
        if (sender instanceof net.md_5.bungee.api.connection.ProxiedPlayer){
            net.md_5.bungee.api.connection.ProxiedPlayer player = (net.md_5.bungee.api.connection.ProxiedPlayer) sender;
            if (args.length < 1) {
                sender.sendMessage(new TextComponent(ChatColor.DARK_RED + "Failed to load arguments, don't use this command if you aren't an admin!"));
                return;
            }
            if (!Arrays.asList(__servers__).contains(args[0])) {
                sender.sendMessage(new TextComponent(ChatColor.YELLOW + "Public class Mmbetac: Protected constructor variable __servers__ did not contain args[0]."));
                sender.sendMessage(new TextComponent(ChatColor.DARK_RED + "Also, another error occurred: while handling void execute(), initialhandler has already pinged but called twice."));
                return;
            }
            if (player.getServer().getInfo().getName().equals(args[0])){
                sender.sendMessage(new TextComponent(ChatColor.RED+"既に接続しています！"));
                return;
            }
            if (args.length > 1){
                if (__experiedSessions__.contains(args[1])){
                    sender.sendMessage(new TextComponent(ChatColor.RED+"セッションが期限切れです！"));
                    return;
                }
                __experiedSessions__.add(args[1]);
            }
            ServerInfo server = ProxyServer.getInstance().getServerInfo(args[0]);
            player.sendMessage(new TextComponent(ChatColor.GRAY + "Warping you to the server [" + args[0] + "]..."));
            player.connect(server);
        }
    }
}
