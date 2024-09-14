package com.kanokiw.mc.sushida;

import org.bukkit.Material;
import org.bukkit.SoundCategory;
import org.bukkit.enchantments.Enchantment;
import org.bukkit.entity.Creeper;
import org.bukkit.entity.Enderman;
import org.bukkit.entity.Entity;
import org.bukkit.entity.EntityType;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.block.BlockPhysicsEvent;
import org.bukkit.event.entity.EntityDeathEvent;
import org.bukkit.event.entity.EntityExplodeEvent;
import org.bukkit.event.entity.EntityTeleportEvent;
import org.bukkit.event.player.PlayerInteractEntityEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.vehicle.VehicleExitEvent;
import org.bukkit.inventory.ItemFlag;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.ItemMeta;
import org.bukkit.scheduler.BukkitRunnable;

import java.util.Arrays;
import java.util.Random;

import org.bukkit.ChatColor;

public class Listeners implements Listener{
    Listeners(){

    }

    @EventHandler
    public void onEndermanTeleport(EntityTeleportEvent event){
        Entity entity = event.getEntity();
        if (entity instanceof Enderman && entity.getLocation().getY() > 0){
            event.setCancelled(true);
        }
    }


    @EventHandler
    public void onEntityDismount(VehicleExitEvent event){
        Entity exitedEntity = event.getExited();
        if (exitedEntity.getType() == EntityType.ENDERMAN){
            event.setCancelled(true);
        }
    }


    @EventHandler
    public void onEntityExplode(EntityExplodeEvent event){
        Entity entity = event.getEntity();
        if (entity instanceof Creeper && ((Creeper) entity).isPowered()) {
            event.setCancelled(true);
        }
    }


    @EventHandler
    public void onPlayerInteractEntity(PlayerInteractEntityEvent event){
        Entity entity = event.getRightClicked();
        Player player = event.getPlayer();
        if (entity instanceof Creeper && ((Creeper) entity).isInvulnerable()){
            if (player.getInventory().getItemInMainHand().getType() == Material.FLINT_AND_STEEL){
                event.setCancelled(true);
            }
        }
    }


    @EventHandler
    public void onBlockPhysics(BlockPhysicsEvent event) {
        if (event.getBlock().getType().name().contains("FALLING_BLOCK")) {
            event.setCancelled(true);
        }
    }


    @EventHandler
    public void onEntityDeath(EntityDeathEvent event){
        final Entity dead = event.getEntity();
        if (Slayer.emanFighterMap.keySet().contains(((Integer)dead.getEntityId()).toString())){
            event.getDrops().clear();
            event.setDroppedExp(250);
            //ItemStack head = new ItemStack(Material.PLAYER_HEAD);
            //SkullMeta skull_meta = (SkullMeta) head.getItemMeta();
            ItemStack null_sphere = new ItemStack(Material.FIREWORK_STAR, (new Random()).nextInt(180, 250));
            ItemMeta null_sphere_meta = null_sphere.getItemMeta();
            null_sphere_meta.addEnchant(
                Enchantment.DAMAGE_UNDEAD, 0, true
                );
            null_sphere_meta.setDisplayName(ChatColor.GREEN+"Null Sphere");
            null_sphere_meta.setLore(Arrays.asList(
                ChatColor.YELLOW+"Right-click to view recipes!",
                "",
                ""+ChatColor.GREEN+ChatColor.BOLD+"UNCCMMON"
            ));
            null_sphere_meta.addItemFlags(
                ItemFlag.HIDE_ENCHANTS
            );
            null_sphere.setItemMeta(null_sphere_meta);
            dead.getWorld().dropItem(dead.getLocation(), null_sphere);
            new BukkitRunnable(){
                @Override
                public void run(){
                    for (Player p : Slayer.emanFighterMap.get(((Integer)dead.getEntityId()).toString())){
                        playRNG(p);
                    }
                }
            }.runTaskLater(Slayer.plugin, 10L);
        }
    }


    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event){
        //Player player = event.getPlayer();
        //player.setResourcePack("http://kanokiw.com:22312/resourcepacks/RNG.zip");
    }


    public void playRNG(Player player){
        player.playSound(player, "block.anvil_destroy", SoundCategory.MASTER, 2f, 1f);
    }
}
