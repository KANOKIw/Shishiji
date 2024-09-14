package com.kanokiw.mc.disablechat;

import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.event.EventHandler;
import org.bukkit.event.player.AsyncPlayerChatEvent;
import org.bukkit.event.Listener;

public class Main extends JavaPlugin implements Listener{
    @Override
    public void onEnable(){
        getServer().getPluginManager().registerEvents(this, this);
        getLogger().info("DisableChat loaded");
    }

    @EventHandler
    public void onPlayerChat(AsyncPlayerChatEvent event){
        if (event.getMessage().startsWith("/")) return;
        event.setCancelled(true);
    }
}
