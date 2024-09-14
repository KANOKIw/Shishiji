package com.kanokiw.mc.sushida;

import org.bukkit.Particle;
import org.bukkit.Particle.DustOptions;
import org.bukkit.entity.Entity;
import org.bukkit.entity.Player;

public class Effects {
    /**
     * returns if entity is dead
     * @param ent
     * @param e
     * @param data
     * @param p
     * @param se
     */
    public static void doFerocity(Entity ent, double e, DustOptions data, Player p, boolean se){
        double theta = 0;
        double r = 0.3d;

        if (ent.isDead())
            return;
        if (e % 2 == 0 && !ent.isDead()){
            for (double y = 0.5d; y <= 2.5d; y += 0.1d){
                double radian = Math.toRadians(theta);
                double x = r*Math.cos(radian);
                double z = r*Math.sin(radian);
                ent.getWorld().spawnParticle(
                    Particle.REDSTONE,
                    ent.getLocation().add(x, y, z),
                    1,
                    0, 0, 0,
                    data
                );
                ent.getWorld().spawnParticle(
                    Particle.REDSTONE,
                    ent.getLocation().add(x, y, -z),
                    1,
                    0, 0, 0,
                    data
                );
                theta += 9d;
            }
        } else {
            for (double y = 2.5d; y >= 0.5d; y -= 0.1d){
                double radian = Math.toRadians(theta);
                double x = r*Math.cos(radian);
                double z = r*Math.sin(radian);
                ent.getWorld().spawnParticle(
                    Particle.REDSTONE,
                    ent.getLocation().add(x, y, z),
                    1,
                    0, 0, 0,
                    data
                );
                ent.getWorld().spawnParticle(
                    Particle.REDSTONE,
                    ent.getLocation().add(x, y, -z),
                    1,
                    0, 0, 0,
                    data
                );
                theta += 9d;
            }
        }
        if (se)
            p.playSound(ent.getLocation(), "entity.zombie.break_wooden_door", 0.25f, 1.5f);
    }
}
