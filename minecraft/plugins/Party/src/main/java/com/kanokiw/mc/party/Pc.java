package com.kanokiw.mc.funcs;


import net.md_5.bungee.api.ChatColor;
import net.md_5.bungee.api.CommandSender;
import net.md_5.bungee.api.plugin.Command;
import net.md_5.bungee.api.chat.BaseComponent;
import net.md_5.bungee.api.chat.ComponentBuilder;
import net.md_5.bungee.api.chat.TextComponent;
import net.md_5.bungee.api.chat.hover.content.Text;
import net.md_5.bungee.api.connection.ProxiedPlayer;



public class Pc extends Command {
    private Main plugin = Main.getInstance();
    public Pc(){
        super("pc",null,"partychat");
    }

    @Override
    public void execute(CommandSender sender, String[] args) {
        PlayerParty sendersParty = Party.partiesMap.get(sender.getName().toLowerCase());
        String message = "";
        if (sendersParty == null){
            PlayerParty._notifyBaseComponents(
                new ComponentBuilder(ChatColor.RED+"あなたは現在 Party に参加していません。")
                .create(),
                sender.getName()
            );
            return;
        }
        if (args.length < 1){
            PlayerParty._notifyBaseComponents(
                new ComponentBuilder(ChatColor.RED+"使用方法: /pc <メッセージ...>...")
                .create(),
                sender.getName()
            );
            return;
        }
        for (String arg : args){
            message = message + arg + " ";
        }
        ChatColor _playerColor = sendersParty.getColor(sender.getName());
        BaseComponent[] _message = new ComponentBuilder(ChatColor.BLUE+"Party > "+_playerColor+sender.getName()+ChatColor.WHITE+": "+message).create();
        for (String _player : sendersParty.getAll()){
            if (sendersParty.hasMuted(_player)){
                ProxiedPlayer _me = plugin.getProxy().getPlayer(_player);
                _me.sendMessage(new TextComponent(
                    ChatColor.RED+"あなたは Party チャンネルをミュートにしています！"
                ));
                _me.sendMessage(new TextComponent(
                    ChatColor.RED+"/p mute で切り替え"
                ));
                return;
            }
            try{
                plugin.getProxy().getPlayer(_player).sendMessage(_message);
            }catch(Error e){}
        }
    }
}
