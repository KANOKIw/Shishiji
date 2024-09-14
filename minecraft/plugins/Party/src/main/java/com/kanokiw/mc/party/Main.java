package com.kanokiw.mc.funcs;

import java.net.http.WebSocket.Listener;

import net.md_5.bungee.api.plugin.Plugin;

public class Main extends Plugin implements Listener {
    private static Main instance;

    @Override
    public void onEnable(){
        setInstance(this);
        getProxy().getPluginManager().registerCommand(this, new Lobby());
        getProxy().getPluginManager().registerCommand(this, new Mmbetac());
        getProxy().getPluginManager().registerCommand(this, new Party());
        getProxy().getPluginManager().registerCommand(this, new Grsn());
        getProxy().getPluginManager().registerCommand(this, new Pl());
        getProxy().getPluginManager().registerCommand(this, new Chat());
        getProxy().getPluginManager().registerCommand(this, new Pc());
        getProxy().getPluginManager().registerListener(this , new Events());
        getLogger().info("< KANOKIw-BungeeCOrd loaded!! >");
    }

    public static Main getInstance(){
        return instance;
    }

    private static void setInstance(Main instance){
        Main.instance = instance;
    }
}
