package com.kanokiw.mc.sushida;

import java.util.Arrays;
import java.util.List;

import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;

import org.bukkit.Location;
import org.bukkit.SoundCategory;
import org.bukkit.entity.Creeper;
import org.bukkit.entity.Player;
import org.bukkit.scheduler.BukkitTask;


public class CVeil {
    private static double radius = 1.75;
    private List<Creeper> veils;
    private Player belongedPlayer;
    private double rotionTheta;
    private BukkitTask loop_1;
    private BukkitTask loop_2;
    private boolean de_activable = false;
    

    public CVeil(@Nonnull List<Creeper> creepers, @Nonnull Player bPlayer, @Nonnegative double theta){
        this.veils = creepers;
        this.belongedPlayer = bPlayer;
        this.rotionTheta = theta;
        for (Creeper v : this.veils){
            v.setPowered(true);
            v.setInvisible(true);
            v.setInvulnerable(true);
            v.setAI(false);
        }
    }

    public Player getBelongedPlayer(){
        return this.belongedPlayer;
    }

    public List<Creeper> getVeils(){
        return this.veils;
    }

    public double getTheta(){
        return this.rotionTheta;
    }

    public void setDe_Activable(boolean de_activable){
        this.de_activable = de_activable;
    }

    public boolean canDe_Active(){
        return this.de_activable;
    }

    public List<BukkitTask> rotateVeils(@Nonnull @Nonnegative final double thetaAddtion){
        loop_1 = Slayer.plugin.getServer().getScheduler().runTaskTimer(Slayer.plugin, new Runnable(){
            @Override
            public void run(){
                if (!belongedPlayer.isOnline()){
                    shutDown(); // cancels this task
                }
                for (Creeper crp : veils){
                    double radian = Math.toRadians(rotionTheta);
                    double x = radius*Math.cos(radian);
                    double z = radius*Math.sin(radian);
                    Location loc = belongedPlayer.getLocation().add(x, 0.2d, z);

                    loc.setPitch(0);
                    loc.setYaw(0);
                    crp.teleport(loc);
                    rotionTheta += 360/veils.size();
                    if (rotionTheta > 360) 
                        rotionTheta -= 360;
                }
                rotionTheta += thetaAddtion;
            }
        }, 0L, 0L);
        loop_2 = Slayer.plugin.getServer().getScheduler().runTaskTimer(Slayer.plugin, new Runnable(){
            @Override
            public void run(){
                belongedPlayer.playSound(belongedPlayer, "entity.creeper.hurt", SoundCategory.MASTER, 1f, 1f);
            }
        }, 0L, 20L);
        return Arrays.asList(loop_1, loop_2);
    }

    public void shutDown() throws Error {
        if (!this.de_activable)
            throw new Error("Can't shutdown Cveil while this.de_activable is false");
        for (Creeper cpr : this.veils)
            cpr.remove();
        loop_1.cancel();
        loop_2.cancel();
    }
}
