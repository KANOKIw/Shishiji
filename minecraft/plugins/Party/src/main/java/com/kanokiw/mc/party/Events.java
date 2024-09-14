package com.kanokiw.mc.funcs;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import net.md_5.bungee.api.ChatColor;
import net.md_5.bungee.api.chat.BaseComponent;
import net.md_5.bungee.api.chat.ClickEvent;
import net.md_5.bungee.api.chat.ComponentBuilder;
import net.md_5.bungee.api.chat.HoverEvent;
import net.md_5.bungee.api.chat.TextComponent;
import net.md_5.bungee.api.chat.hover.content.Content;
import net.md_5.bungee.api.config.ServerInfo;
import net.md_5.bungee.api.connection.ProxiedPlayer;
import net.md_5.bungee.api.event.ChatEvent;
import net.md_5.bungee.api.event.PlayerDisconnectEvent;
import net.md_5.bungee.api.event.PostLoginEvent;
import net.md_5.bungee.api.event.ServerConnectEvent;
import net.md_5.bungee.api.event.ServerDisconnectEvent;
import net.md_5.bungee.api.event.ServerKickEvent;
import net.md_5.bungee.api.event.ServerSwitchEvent;
import net.md_5.bungee.api.plugin.Listener;
import net.md_5.bungee.event.EventHandler;


public class Events implements Listener {
    private Main plugin = Main.getInstance();
    public static Map<String, String> whatChat = new HashMap<String,String>();
    public static List<String> onWarpPlayers = new ArrayList<String>();
    public static Random random = new Random();

    @EventHandler
    public void postLoginEvent(PostLoginEvent event){
        String name = event.getPlayer().getName();
        if (whatChat.get(name) == null) whatChat.put(name, "all");
    }

    @EventHandler
    public void onPlayerDisconnect(ServerSwitchEvent event){
        String name = event.getPlayer().getName();
        String server = event.getPlayer().getServer().getInfo().getName();
        if (server.equals("limbo")) return;
        if (plugin.getProxy().getPlayer(name) == null) return;
        if (onWarpPlayers.contains(name.toLowerCase())){
            onWarpPlayers.remove(name.toLowerCase());
            return;
        }

        PlayerParty _party = Party.partiesMap.get(name.toLowerCase());
        if (_party == null) return;

        HoverEvent _follow = new HoverEvent(HoverEvent.Action.SHOW_TEXT, new ComponentBuilder(ChatColor.YELLOW+"Click to follow!").create());
        String _session;
        do {
            _session = String.valueOf(random.nextInt(100000));
        } while (Mmbetac.__experiedSessions__.contains(_session));

        ClickEvent _click = new ClickEvent(ClickEvent.Action.RUN_COMMAND, "/mmbetac "+server+" "+_session);
        if (server.equals("lobby")) server = "Lobby";
        if (server.equals("super-flat")) server = "Super Flat";
        if (server.equals("survival")) server = "Survival";
        BaseComponent[] _clickable = new ComponentBuilder(ChatColor.YELLOW+""+ChatColor.BOLD+" FOLLOW").event(_follow).event(_click)
            .create();
        BaseComponent[] _notify = new ComponentBuilder(_party.getColor(name)+name+ChatColor.GREEN
            +" is travelling to "+ChatColor.GOLD+"["+server+"]")
            .append(_clickable)
            .create();
        for (String player : _party.getAll()){
            if (player.equals(name.toLowerCase())) continue;
            try {
                plugin.getProxy().getPlayer(player).sendMessage(_notify);
            } catch (NullPointerException e){
                ;
            }
        }
    }

    //@EventHandler
    public void playerDisconnectEvent(PlayerDisconnectEvent event){
        ServerInfo lobby = plugin.getProxy().getServerInfo("lobby");
        ProxiedPlayer p = event.getPlayer();
        // functions
    }

    //@EventHandler
    public void serverKickEvent(ServerKickEvent event){
        ServerInfo lobby = plugin.getProxy().getServerInfo("lobby");
        ProxiedPlayer p = event.getPlayer();
        ProxiedPlayer a = plugin.getProxy().getPlayer("KANOKIw");
        BaseComponent[] rsn = event.getKickReasonComponent();
        BaseComponent[] hv = new ComponentBuilder(ChatColor.GREEN + "詳細を確認").create();
        ClickEvent ce = new ClickEvent(ClickEvent.Action.RUN_COMMAND, "/grsn " + rsn);
        HoverEvent _hv = new HoverEvent(HoverEvent.Action.SHOW_TEXT, hv);
        BaseComponent[] _rsn = new ComponentBuilder(ChatColor.RED + "接続が切断されたのでロビーに転送されました！").event(ce).event(_hv).create();

        p.connect(lobby);
        p.sendMessage(_rsn);
    }

    //@EventHandler
    public void serverDisconnectEvent(ServerDisconnectEvent event){
        ServerInfo lobby = plugin.getProxy().getServerInfo("lobby");
        ProxiedPlayer p = event.getPlayer();

        plugin.getLogger().info(p.getServer().getInfo().getName());
        if (!p.getServer().getInfo().getName().equals("lobby")) {
            p.connect(lobby);
        }
        p.sendMessage(new TextComponent(ChatColor.RED + "接続が切断されたのでロビーに転送されました！"));
    }

    /**
     * disabled because event.setMessage not affecting...
     * @param event
     */
    @EventHandler
    public void onPlayerChat(ChatEvent event){
        ProxiedPlayer sender = (ProxiedPlayer) event.getSender();
        String message = event.getMessage();
        String channel = whatChat.get(sender.getName());

        if (message.startsWith("/")) return;
        if (channel == null) channel = "all";
        if (channel.equals("party")){
            PlayerParty sendersParty = Party.partiesMap.get(sender.getName().toLowerCase());
            if (sendersParty == null){
                whatChat.put(sender.getName(), "all");
                sender.sendMessage(new ComponentBuilder(ChatColor.RED+"Party に参加していないため、全体チャットに戻りました。").create());
                return;
            } else if (sendersParty.hasMuted(sender.getName())){
                whatChat.put(sender.getName(), "all");
                sender.sendMessage(new ComponentBuilder(ChatColor.RED+"Party をミュートにしているため、全体チャットに戻りました。").create());
                return;
            }

            ChatColor _playerColor = sendersParty.getColor(sender.getName().toLowerCase());
            BaseComponent[] _message = new ComponentBuilder(ChatColor.BLUE+"Party > "+_playerColor+sender.getName()+ChatColor.WHITE+": "+message).create();
            for (String _player : sendersParty.getAll()){
                if (sendersParty.hasMuted(_player)) continue;
                plugin.getProxy().getPlayer(_player).sendMessage(_message);
            }
        } else {
            String name = sender.getName();
            if (sender.getName().equals("mochi1202")){
                name = ChatColor.RED+"["+ChatColor.WHITE+"STREAMER"+ChatColor.RED+"]";
            }
            for (ProxiedPlayer p : sender.getServer().getInfo().getPlayers()){
                p.sendMessage(new ComponentBuilder(name+ChatColor.RESET+": "+ message).create());
            }
        }
    }
}
