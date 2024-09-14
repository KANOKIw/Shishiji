package com.kanokiw.mc.lobby;

import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.event.EventHandler;
import org.bukkit.event.player.PlayerInteractEntityEvent;
import org.bukkit.event.player.PlayerInteractEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.inventory.EquipmentSlot;
import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.World;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.event.Listener;
import org.bukkit.event.block.LeavesDecayEvent;
import org.bukkit.scoreboard.Scoreboard;
//import org.bukkit.scoreboard.Scoreboard;
import org.bukkit.scoreboard.Team;
import org.bukkit.Location;
import org.bukkit.Material;
import org.bukkit.SoundCategory;
import org.bukkit.scheduler.BukkitRunnable;
//import org.bukkit.scheduler.BukkitRunnable;
import org.bukkit.scheduler.BukkitScheduler;
import org.bukkit.scheduler.BukkitTask;
import org.bukkit.entity.ArmorStand;
import org.bukkit.entity.Egg;
import org.bukkit.entity.Entity;
import org.bukkit.entity.PigZombie;



public class Lobby extends JavaPlugin implements Listener {
    private Map<String, String> team_NCmap = new HashMap<String, String>();
    private Map<String, String> team_SCmap = new HashMap<String, String>();
    private List<String> whoonLaunchPad = new ArrayList<String>();
    private static Random random = new Random();
    private final static long delay = 15L;
    public static String[] joinSounds = {
        "block.note_block.banjo",
        "block.note_block.bell",
        "block.note_block.bit",
        "block.note_block.chime",
        "block.note_block.cow_bell",
        "block.note_block.didgeridoo",
        "block.note_block.flute",
        "block.note_block.guitar",
        "entity.wither.spawn"
    };
    public static long joinSoundDelay = 2L;
    public static Lobby plugin;
    public Lobby(){
        plugin = this;
        team_NCmap.put("Owner", ChatColor.RED + " >" + ChatColor.DARK_RED + ">" + ChatColor.RED + "> ");
        team_NCmap.put("Admin", "");
        team_NCmap.put("streamer", ChatColor.AQUA + " >" + ChatColor.RED + ">" + ChatColor.GREEN + "> ");
        team_NCmap.put("TheGenius", ChatColor.AQUA + " >" + ChatColor.RED + ">" + ChatColor.GREEN + "> ");
        team_SCmap.put("Owner", ChatColor.RED + " <" + ChatColor.DARK_RED + "<" + ChatColor.RED + "<");
        team_SCmap.put("Admin", "");
        team_SCmap.put("streamer", ChatColor.AQUA + " <" + ChatColor.RED + "<" + ChatColor.GREEN + "<");
        team_SCmap.put("TheGenius", ChatColor.AQUA + " <" + ChatColor.RED + "<" + ChatColor.GREEN + "<");
    }

    @Override
    public void onEnable(){
        getServer().getPluginManager().registerEvents(this, this);
        getCommand("middle").setExecutor(new Middle());
        getCommand("head").setExecutor(new Head());
        getCommand("change").setExecutor(new Change());
        getLogger().info("< Lobby Plugin loaded!! >");
    }

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        Player joined_player = event.getPlayer();
        Team team = Methods._getTeam(joined_player);
        StringBuilder _playerName = new StringBuilder(joined_player.getName());
        String joinMessage;
        String _messagePrefix = "" + ChatColor.GRAY;
        String _messageSuffix = "";
        
        if (!(team == null)){
            _playerName.insert(0, team.getColor());
            _playerName.insert(0, team.getPrefix());
            _playerName.append(team.getSuffix());
            _messagePrefix = team_NCmap.get(team.getName());
            _messageSuffix = team_SCmap.get(team.getName());
        }
        _playerName.insert(0, _messagePrefix);
        
        joinMessage = _playerName.toString() + ChatColor.GOLD + " がロビーに参加しました！" + ChatColor.RESET + _messageSuffix;
        event.setJoinMessage(joinMessage);
        playJoinSound(joined_player);
    }

    @EventHandler
    public void onPlayerQuit(PlayerQuitEvent event){
        event.setQuitMessage(null);
    }

    @EventHandler
    public void onEntityClick(PlayerInteractEntityEvent event) {
        Player player = event.getPlayer();
        Entity entity = event.getRightClicked();
        if (event.getHand() == EquipmentSlot.HAND) {
            player.playSound(player.getLocation(), "entity.enderman.teleport", 1f, 1.5f);
            getLogger().info(entity.getClass().toString());
        }
    }

    public void onLaunchPad() {
        final World world = Bukkit.getWorld("World");

        for (final Player player : Bukkit.getOnlinePlayers()) {
            Location playerLocation = player.getLocation();

            if (isWithinBounds(playerLocation, new Location(world, 29, 82, -6), new Location(world, 31, 83, -3)) && !whoonLaunchPad.contains(player.getName())) {
                whoonLaunchPad.add(player.getName());
                CommandSender sender = (CommandSender) getServer().getConsoleSender();
                String[] commands = {
                    "tag " + player.getName() + " add on_launch_pad.super_flat",
                    "tag " + player.getName() + " add on_launch_pad_"
                };

                for (String cmd : commands){
                    getServer().dispatchCommand(sender, cmd);
                } //
                Location eggLocation = playerLocation.clone().subtract(0, 40, 0);
                double[] motion = {1.3, 1.5, 0.0};
                player.playSound(player.getLocation(), "entity.generic.explode", 1F, 2F);
                player.playSound(player.getLocation(), "entity.firework_rocket.launch", 1F, 1.2F);
                final Egg egg = Methods._spawnEntityEgg(eggLocation, motion);
                final ArmorStand armorstand = Methods._spawnArmorstand_ride(player.getLocation(), player);

                BukkitScheduler scheduler = getServer().getScheduler();
                scheduler.scheduleSyncRepeatingTask(this, new Runnable() {
                    @Override
                    public void run() {
                        boolean re = isWithinBounds(armorstand.getLocation(), new Location(world, 85, 80, -25), new Location(world, 125, 83, 5));

                        if (!re){
                            Methods._teleportAbove((Entity) egg, (Entity) armorstand, 40);
                            if (armorstand.getPassengers() == null) {
                                Methods._rideEntityonEntity((Entity) player, (Entity) armorstand);
                            }
                        }
                        if (re && whoonLaunchPad.contains(player.getName())) {
                            armorstand.remove();
                            for (int g=0;g<whoonLaunchPad.size();g++){
                                String pn = whoonLaunchPad.get(g);
                                if (player.getName().equals(pn)) {
                                    whoonLaunchPad.remove(g);
                                }
                            }
                        }
                    }
                }, 0, 0);
                break;
            }
        }
    }

    public boolean isWithinBounds(Location location, Location corner1, Location corner2) {
        double minX = Math.min(corner1.getX(), corner2.getX());
        double minY = Math.min(corner1.getY(), corner2.getY());
        double minZ = Math.min(corner1.getZ(), corner2.getZ());
        double maxX = Math.max(corner1.getX(), corner2.getX());
        double maxY = Math.max(corner1.getY(), corner2.getY());
        double maxZ = Math.max(corner1.getZ(), corner2.getZ());
        // returns if the all of the potition within
        return location.getX() >= minX && location.getX() <= maxX
                && location.getY() >= minY && location.getY() <= maxY
                && location.getZ() >= minZ && location.getZ() <= maxZ;
    }

    public static void playJoinSound(final Player player){
        long d = 0;
        String sound;
        do {
            sound = joinSounds[random.nextInt(joinSounds.length)];
            if (sound.equals("entity.wither.spawn")){
                d++;
            }
        } while (sound.equals("entity.wither.spawn") && d < 2);

        final String joinSound = sound;
        new BukkitRunnable(){
            @Override
            public void run() {
                player.playSound(player, joinSound, SoundCategory.MUSIC, 2L, 1L);
                this.cancel();
            }
        }.runTaskLater(plugin, delay);
        if (joinSound.equals("entity.wither.spawn")) {
            return;
        }
        new BukkitRunnable(){
            @Override
            public void run() {
                player.playSound(player, joinSound, SoundCategory.MUSIC, 2L, 1.2F);
                this.cancel();
            }
        }.runTaskLater(plugin, joinSoundDelay+delay);
        new BukkitRunnable(){
            @Override
            public void run() {
                player.playSound(player, joinSound, SoundCategory.MUSIC, 2L, 1.5F);
                this.cancel();
            }
        }.runTaskLater(plugin, joinSoundDelay*2+delay);
    }
}
