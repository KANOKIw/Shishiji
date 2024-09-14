package com.kanokiw.mc.lobby;

import org.bukkit.Bukkit;
import org.bukkit.Location;
import org.bukkit.entity.ArmorStand;
import org.bukkit.entity.Egg;
import org.bukkit.entity.Player;
import org.bukkit.scoreboard.Scoreboard;
import org.bukkit.scoreboard.Team;
import org.bukkit.entity.Entity;
import org.bukkit.util.Vector;

public class Methods {
    public static Team _getTeam(Player player){
        Scoreboard scoreboard = Bukkit.getScoreboardManager().getMainScoreboard();
        for (Team team : scoreboard.getTeams()){
            if (team.hasEntry(player.getDisplayName())){
                return team;
            }
        }
        return null;
    }

    public static Egg _spawnEntityEgg(Location egg_location, double[] egg_Motion) {
        Egg egg = egg_location.getWorld().spawn(egg_location, Egg.class);
        Vector Motion = new Vector(egg_Motion[0], egg_Motion[1], egg_Motion[2]);
        egg.setVelocity(Motion);
        return egg;
    }

    public static ArmorStand _spawnArmorstand_ride(Location location, Player player) {
        ArmorStand armorstand = location.getWorld().spawn(location, ArmorStand.class);
        Entity e = (Entity) player;
        armorstand.setPassenger(e);
        armorstand.setInvulnerable(true);
        armorstand.setVisible(false);
        return armorstand;
    }

    public static void _rideEntityonEntity(Entity player, Entity entity) {
        entity.setPassenger(player);
    }

    public static void _teleportAbove(Entity entity_base, Entity entity_above, double y) {
        Location b = entity_base.getLocation();
        double aY = b.getY() + y;
        Location above = new Location(b.getWorld(), b.getX(), aY, b.getZ());
        Entity pal = entity_above.getPassengers().get(0);
        entity_above.eject();
        entity_above.teleport(above);
        entity_above.setPassenger(pal);
    }
}
