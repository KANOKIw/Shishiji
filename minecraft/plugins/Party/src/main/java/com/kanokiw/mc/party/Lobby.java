package com.kanokiw.mc.funcs;

import net.md_5.bungee.api.ChatColor;
import net.md_5.bungee.api.CommandSender;
import net.md_5.bungee.api.plugin.Command;
import net.md_5.bungee.api.chat.TextComponent;
import net.md_5.bungee.api.config.ServerInfo;
import net.md_5.bungee.api.ProxyServer;

public class Lobby extends Command {

    public Lobby() {
        super("lobby", null, "l");
    }

    @Override
    public void execute(CommandSender sender, String[] args) {
        if (sender instanceof net.md_5.bungee.api.connection.ProxiedPlayer){
            net.md_5.bungee.api.connection.ProxiedPlayer player = (net.md_5.bungee.api.connection.ProxiedPlayer) sender;
            String fMsg = ChatColor.GRAY + "Warping you to the lobby...";
            TextComponent msg = new TextComponent(fMsg);
            ServerInfo lobby = ProxyServer.getInstance().getServerInfo("lobby");
            if (!player.getServer().getInfo().getName().equals("lobby")){
                sender.sendMessage(msg);
                if (lobby.isRestricted()){
                    sender.sendMessage(new TextComponent(ChatColor.RED + "エラー: ロビーに接続する権限がありません！"));
                    return;
                }
                player.connect(lobby);
            } else {
                sender.sendMessage(new TextComponent(ChatColor.GREEN + "既にロビーに接続しています！"));
            }
        }
    }
}
