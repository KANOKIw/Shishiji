package com.kanokiw.mc.sushida;

import org.bukkit.Particle;
import org.bukkit.entity.Player;
import org.bukkit.entity.ArmorStand;
import org.bukkit.entity.Entity;
import org.bukkit.entity.LivingEntity;
import org.bukkit.scheduler.BukkitTask;

public class FVeil {
    Player player;
    public final double maxrem = 50d;
    public double rem = 50d;
    private double r = 3d;
    private BukkitTask task;
    private boolean initable = false;
    private BukkitTask _task;
    public BukkitTask cdTask;


    public FVeil(Player player){
        this.player = player;
    }


    public void startVeil(){
        this._task = startFireDamage();
        this.task = Slayer.plugin.getServer().getScheduler().runTaskTimer(Slayer.plugin, new Runnable(){
            @Override
            public void run(){
                if (rem < 0){
                    shutDown();
                }
                for (double theta = 0; theta <= 360; theta += 20){
                    for (double y = 0.1d; y <= 5.1d; y++){
                        double radian = Math.toRadians(theta);
                        double x = r*Math.cos(radian);
                        double z = r*Math.sin(radian);

                        player.getWorld().spawnParticle(Particle.FLAME, player.getLocation().add(x, y, z), 1,
                            0, 0, 0,
                            0
                        );
                    }
                }
                rem--;
            }
        }, 0L, 2L);
    }


    public void setInitable(boolean a){
        this.initable = a;
    }

    public boolean isInitable(){
        return this.initable;
    }

    public BukkitTask startFireDamage(){
        return Slayer.plugin.getServer().getScheduler().runTaskTimer(Slayer.plugin, new Runnable(){
            @Override
            public void run(){
                for (Entity entity : player.getWorld().getNearbyEntities(player.getLocation(), 3d, 5d, 3d)){
                    if (
                        Slayer.get2Ddistance(player.getLocation(), entity.getLocation()) <= r &&
                        entity instanceof LivingEntity &&
                        !(entity instanceof Player) && 
                        !(entity instanceof ArmorStand) &&
                        !entity.isInvulnerable()
                        ){
                        LivingEntity _entity = (LivingEntity) entity;
                        if (_entity.isInvisible())
                            return;
                        _entity.setFireTicks(15);
                        _entity.damage(40, player);
                    }
                }
            }
        }, 0L, 15L);
    }

    /**
     * run after startVeil() or throws NullPointerException
     * known useage -> run with init
     * @throws NullPointerException
     */
    public void restartFireDamage() throws NullPointerException{
        this._task.cancel();
        this._task = startFireDamage();
    }

    public void shutDown(){
        Slayer.fire_veil_wandMap.remove(((Integer) player.getEntityId()).toString());
        this.task.cancel();
        this._task.cancel();
    }
}
