package com.kanokiw.mc.sushida;

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

import org.bukkit.Color;
import org.bukkit.Particle;
import org.bukkit.World;

public class Find implements CommandExecutor{
    Particle[] particles = {
        Particle.ASH, Particle.BLOCK_CRACK, Particle.BLOCK_DUST, Particle.BLOCK_MARKER,
        Particle.BUBBLE_COLUMN_UP, Particle.BUBBLE_POP, Particle.CAMPFIRE_COSY_SMOKE, Particle.CAMPFIRE_SIGNAL_SMOKE,
        Particle.CHERRY_LEAVES, Particle.CLOUD, Particle.COMPOSTER, Particle.CRIMSON_SPORE,
        Particle.CRIT, Particle.CRIT_MAGIC, Particle.CURRENT_DOWN, Particle.DAMAGE_INDICATOR,
        Particle.DOLPHIN, Particle.DRAGON_BREATH, Particle.DRIPPING_DRIPSTONE_LAVA, Particle.DRIPPING_DRIPSTONE_WATER,
        Particle.DRIPPING_HONEY, Particle.DRIPPING_OBSIDIAN_TEAR, Particle.DRIP_LAVA, Particle.DRIP_WATER,
        Particle.DUST_COLOR_TRANSITION, Particle.EGG_CRACK, Particle.ELECTRIC_SPARK, Particle.ENCHANTMENT_TABLE,
        Particle.END_ROD, Particle.EXPLOSION_HUGE, Particle.EXPLOSION_LARGE, Particle.EXPLOSION_NORMAL,
        Particle.FALLING_DRIPSTONE_LAVA, Particle.FALLING_DRIPSTONE_WATER, Particle.FALLING_DUST, Particle.FALLING_HONEY,
        Particle.FALLING_LAVA, Particle.FALLING_NECTAR, Particle.FALLING_OBSIDIAN_TEAR, Particle.FALLING_SPORE_BLOSSOM,
        Particle.FALLING_WATER, Particle.FIREWORKS_SPARK, Particle.FLAME, Particle.FLASH,
        Particle.GLOW, Particle.GLOW_SQUID_INK, Particle.HEART, Particle.ITEM_CRACK,
        Particle.LANDING_HONEY, Particle.LANDING_LAVA, Particle.LANDING_OBSIDIAN_TEAR, Particle.LAVA,
        Particle.LEGACY_BLOCK_CRACK, Particle.LEGACY_BLOCK_DUST, Particle.LEGACY_FALLING_DUST, Particle.MOB_APPEARANCE,
        Particle.NAUTILUS, Particle.NOTE, Particle.PORTAL, Particle.REDSTONE,
        Particle.REVERSE_PORTAL, Particle.SCRAPE, Particle.SCULK_CHARGE, Particle.SCULK_CHARGE_POP,
        Particle.SCULK_SOUL, Particle.SHRIEK, Particle.SLIME, Particle.SMALL_FLAME,
        Particle.SMOKE_LARGE, Particle.SMOKE_NORMAL, Particle.SNEEZE, Particle.SNOWBALL,
        Particle.SNOWFLAKE, Particle.SNOW_SHOVEL, Particle.SONIC_BOOM, Particle.SOUL,
        Particle.SOUL_FIRE_FLAME, Particle.SPELL, Particle.SPELL_INSTANT, Particle.SPELL_MOB,
        Particle.SPELL_MOB_AMBIENT, Particle.SPELL_WITCH, Particle.SPIT, Particle.SPORE_BLOSSOM_AIR,
        Particle.SQUID_INK, Particle.SUSPENDED, Particle.SUSPENDED_DEPTH, Particle.SWEEP_ATTACK,
        Particle.TOTEM, Particle.TOWN_AURA, Particle.VIBRATION, Particle.VILLAGER_ANGRY,
        Particle.VILLAGER_HAPPY, Particle.WARPED_SPORE, Particle.WATER_BUBBLE, Particle.WATER_DROP,
        Particle.WATER_SPLASH, Particle.WATER_WAKE, Particle.WAX_OFF, Particle.WAX_ON,
        Particle.WHITE_ASH
    };
    private Integer count = 0;

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args){     
        Player player = (Player) sender;
        World world = player.getWorld();
        double r = 1d;
        Particle p = particles[count];

        for (double x = -1d; x <= 1d; x += 0.2d){
            double z = Math.sqrt(Math.pow(r, 2) - Math.pow(x, 2));
            for (int j = 0; j < 2; j++){
                z *= -1;
                for (double k = 0.2d; k <= 1.4d; k += 0.2d){
                    try{
                        world.spawnParticle(
                            p,
                            player.getLocation().add(x, k, z),
                            1
                        );
                    } catch (IllegalArgumentException e){
                        try{
                            Particle.DustOptions data = new Particle.DustOptions(Color.fromRGB(247, 173, 195), 1.0f);
                            world.spawnParticle(
                                p,
                                player.getLocation().add(x, k, z),
                                1,
                                data
                            );
                        } catch (IllegalArgumentException exc){}
                    }
                }
            }
        }
        for (double z = -1d; z <= 1d; z += 0.2d){
            double x = Math.sqrt(Math.pow(r, 2) - Math.pow(z, 2));
            for (int j = 0; j < 2; j++){
                x *= -1;
                for (double k = 0.2d; k <= 1.4d; k += 0.2d){
                    try{
                        world.spawnParticle(
                            p,
                            player.getLocation().add(x, k, z),
                            1
                        );
                    } catch (IllegalArgumentException e){
                        try{
                            Particle.DustOptions data = new Particle.DustOptions(Color.fromRGB(247, 173, 195), 1.0f);
                            world.spawnParticle(
                                p,
                                player.getLocation().add(x, k, z),
                                1,
                                data
                            );
                        } catch (IllegalArgumentException exc){}
                    }
                }
            }
        }
        player.sendMessage(p.name());
        count++;
        if (count >= particles.length) count = 0;
        return true;
    }
}
