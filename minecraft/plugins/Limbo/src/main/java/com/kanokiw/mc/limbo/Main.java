package com.kanokiw.mc.limbo;

import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.event.EventHandler;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.ChatColor;
import org.bukkit.entity.Player;
import org.bukkit.event.Listener;



public class Main extends JavaPlugin implements Listener {
    public static long joinSoundDelay = 2L;
    public static Main plugin;
    public Main(){
        plugin = this;
    }

    @Override
    public void onEnable(){
        getServer().getPluginManager().registerEvents(this, this);
        getLogger().info("< Lobby Plugin loaded!! >");
    }

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event){
        Player player = event.getPlayer();
        player.sendMessage(ChatColor.GREEN+"サーバー再起動のために一時的にLimboに転送されました");
        event.setJoinMessage(null);
    }

    @EventHandler
    public void onPlayerQuit(PlayerQuitEvent event){
        event.setQuitMessage(null);
    }
}
