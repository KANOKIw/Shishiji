package com.kanokiw.mc.sushida;

import java.io.IOException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;

import org.bukkit.Bukkit;
import org.bukkit.entity.*;
import org.bukkit.Color;
import org.bukkit.Location;
import org.bukkit.Material;
import org.bukkit.Particle;
import org.bukkit.Particle.DustOptions;
import org.bukkit.SoundCategory;
import org.bukkit.World;
import org.bukkit.attribute.Attribute;
import org.bukkit.attribute.AttributeModifier;
import org.bukkit.enchantments.Enchantment;
import org.bukkit.entity.Display.Billboard;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.block.Action;
import org.bukkit.event.entity.EntityDamageByEntityEvent;
import org.bukkit.event.entity.EntityDamageEvent;
import org.bukkit.event.entity.EntityTargetEvent;
import org.bukkit.event.player.PlayerInteractEvent;
import org.bukkit.inventory.ItemFlag;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.ItemMeta;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;
import org.bukkit.scheduler.BukkitRunnable;
import org.bukkit.scheduler.BukkitTask;
import org.bukkit.util.Vector;

import net.md_5.bungee.api.ChatColor;


/**
 * 
 * Bukkit Plugin ectends Plugin -> The Main class at `plugin.yml`
 * @diff
 * @Slayers
 *     + Voidgloom Seraph
 *     - Revenant Horror
 * @Stuffs
 *     + Wither Cloak Sword
 *     + Atomsplit Katana
 *     + Wand of Atonement
 *     - Zombie Swords
 * @see
 *     https://github.com/KANOKIw/Sushida
 *     https://github.com/KANOKIw/.sd
 */
public class Slayer extends JavaPlugin implements Listener {
    public static Slayer plugin;
    public static Random random = new Random();
    public static long broken_heart_radiation_range = 160L;
    private Integer vgFeroDivision = 4;
    private List<String> meleeHitCD = new ArrayList<>();
    private List<String> _wand_of_atonementPls = new ArrayList<>();
    private static Map<String, Integer> emanHitsMap = new HashMap<>();
    protected static Map<String, List<Player>> emanFighterMap = new HashMap<>();
    private static List<String> normalEmans = new ArrayList<>();
    private static List<String> preparingBeam = new ArrayList<>();
    private static List<String> onBeam = new ArrayList<>();
    private static List<String> pastPhase2 = new ArrayList<>();
    private static List<String> pastPhase3 = new ArrayList<>();
    private static List<String> pastBeam1 = new ArrayList<>();
    private static List<String> pastBeam2 = new ArrayList<>();
    private static List<String> pastBeam3 = new ArrayList<>();
    private static List<String> emanHasParticles = new ArrayList<String>(); // index won't be matched if `String`, not Integer
    private Map<String, List<Double>> guardianPosTheta = new HashMap<>(); // {entityID=[θ, y]}
    private Map<String, CVeil> cpreeperVeilMap = new HashMap<>();
    private Map<String, List<ItemStack>> soulcryMap = new HashMap<>();
    private Map<String, Double> emanHitsThetaMap = new HashMap<>();
    private Map<String, BukkitTask> wand_of_atonementMap = new HashMap<>();
    public static Map<String, FVeil> fire_veil_wandMap = new HashMap<>();
    private static Map<String, BukkitTask> emanHittingDmgMap = new HashMap<>();
    private Map<String, List<String>> player_entity_onNoDamageTicksMap = new HashMap<>();

    
    public Slayer() throws IOException {
        plugin = this;
    }


    @Override
    public void onEnable(){
        getServer().getScheduler().scheduleSyncRepeatingTask(this, new Runnable(){
            @Override
            public void run(){
                final World world = getServer().getWorld("world");
                for (final Entity entity : world.getEntities()){
                    String entityID = getStringID(entity);
                    if (entity instanceof Enderman){
                        if (normalEmans.contains(entityID)){
                            return;
                        }
                        if (emanHitsMap.get(entityID) == null){
                            entity.setCustomName(
                                ChatColor.RED+"☠ "
                                +ChatColor.AQUA+"Voidgloom Seraph "
                                +ChatColor.WHITE+ChatColor.BOLD+"100 Hits"
                            );
                            entity.setCustomNameVisible(true);
                            emanHasParticles.add(entityID);
                        }
                        double r = 0.6d;
                        double theta;
                        if (emanHitsThetaMap.get(entityID) == null){
                            emanHitsThetaMap.put(entityID, 0d);
                            theta = 0.0d;
                        }
                        theta = emanHitsThetaMap.get(entityID);
                        double radian = Math.toRadians(theta);
                        double x = r*Math.cos(radian);
                        double z = r*Math.sin(radian);
                        for (double y = 0.2d; y <= 2.7d; y += 0.5d){
                            world.spawnParticle(
                                Particle.SPELL_WITCH,
                                entity.getLocation().add(x, y, z),
                                1,
                                0,
                                0,
                                0,
                                0
                            );
                        }
                        theta += 15;
                        emanHitsThetaMap.put(entityID, theta);
                    }
                }
            }
        }, 0L, 0L);
        getServer().getScheduler().scheduleSyncRepeatingTask(this, new Runnable(){
            @Override
            public void run(){
                Sushida.removeCd();
            }
        }, 0L, 20L);
        getServer().getPluginManager().registerEvents(this, this);
        getServer().getPluginManager().registerEvents(new Listeners(), this);
		getCommand("typing").setExecutor(new Sushida());
        getCommand("entyping").setExecutor(new Engda());
        getCommand("sushida").setExecutor(new Start());
        getCommand("nextparticle").setExecutor(new Find());
        getCommand("slayer").setExecutor(new Spawn());
        getCommand("set").setExecutor(new Set());
        getCommand("stuff").setExecutor(new Stuffs());
        getLogger().info("----------------------");
        getLogger().info("This is Sushida");
        getLogger().info("Successfully loaded");
        getLogger().info("----------------------");
    }

    @EventHandler
    public void onEntityDamage(final EntityDamageByEntityEvent event){
        final Entity damager = event.getDamager();
        final Entity entity = event.getEntity();
        final String entityID = getStringID(entity);
        final String damagerID = getStringID(damager);
        Integer hits = emanHitsMap.get(entityID);
        ChatColor hitColor = ChatColor.WHITE;
        float pitch;
        final Integer fero = 600;

        if (cpreeperVeilMap.get(getStringID(damager)) != null){
            event.setCancelled(true);
            return;
        }
        if (entity instanceof Player){
            ((Player)entity).setNoDamageTicks(0);
        }
        if (entity instanceof EnderDragon){
            displayDamage(
                entity.getLocation(),
                (random.nextDouble(29000, 31000)*6.5d*event.getDamage()),
                event.getDamage() == 60 || event.getDamage() == 40
            );
            event.setDamage(event.getDamage()/20);
            new BukkitRunnable(){
                @Override
                public void run(){
                    ((EnderDragon) entity).setNoDamageTicks(0);
                }
            }.runTaskLater(this, 0L);
        }
        if (damager instanceof Player && !(entity instanceof Enderman) && entity instanceof LivingEntity){
            if (
                player_entity_onNoDamageTicksMap.get(damagerID) != null && 
                player_entity_onNoDamageTicksMap.get(damagerID).contains(entityID)
                ) return;
            final Player player = (Player) damager;
            final boolean isSoulcry = soulcryMap.keySet().contains(damagerID);
            final LivingEntity _entity = (LivingEntity) entity;
            
            boolean isBow = false;
            if (event.getDamage() == 15 || event.getDamage() == 45) // term || salvation
                isBow = true;
            if (!isBow){
                if (player_entity_onNoDamageTicksMap.get(damagerID) != null){
                    List<String> a = new ArrayList<>(player_entity_onNoDamageTicksMap.get(damagerID));
                        a.add(entityID);
                        player_entity_onNoDamageTicksMap.put(damagerID, a);
                } else {
                    player_entity_onNoDamageTicksMap.put(damagerID, Arrays.asList(entityID));
                }
            }
            if (isSoulcry && !(event.getDamage() == 60 || event.getDamage() == 40)){
                getServer().getScheduler().runTaskTimer(this, new Runnable(){
                    private Integer c = 0;
                    private DustOptions redstone = new Particle.DustOptions(Color.RED, 1);
                    private final Integer feros = toFerocityCount(fero);

                    @Override
                    public void run(){
                        if (this.c < this.feros){
                            this.c++;
                            Effects.doFerocity(_entity, c, redstone, player, true);
                            _entity.setNoDamageTicks(0);
                            _entity.damage(event.getDamage());
                            _entity.setNoDamageTicks(0);
                        }
                    }
                }, 8L, 8L);
                if (!isBow){
                    new BukkitRunnable(){
                        @Override
                        public void run(){
                            List<String> e = new ArrayList<>(player_entity_onNoDamageTicksMap.get(damagerID));
                                e.remove(entityID);
                                player_entity_onNoDamageTicksMap.put(damagerID, e);
                        }
                    }.runTaskLater(this, 10L);
                }
            }
        }

        if (entity instanceof Enderman && damager instanceof Player){
            final Player player = (Player) damager;
            final Enderman eman = (Enderman) entity;
            final Location _now = eman.getLocation();
            final boolean isSoulcry = soulcryMap.keySet().contains(damagerID);
            boolean isAtomsplit = false;
            ItemMeta meta = player.getInventory().getItemInMainHand().getItemMeta();
            if (
                meta != null && 
                meta.hasCustomModelData() && meta.getCustomModelData() == 2 &&
                event.getDamage() != 40
                ){
                if (meleeHitCD.contains(damagerID)){
                    event.setCancelled(true);
                    return;
                }
                isAtomsplit = true;
            }
            Integer health = toBossHealth(eman.getHealth());
            // immunity from knockbacks
            new BukkitRunnable(){
                @Override
                public void run(){
                    eman.setVelocity(new Vector(0, 0, 0));
                    eman.teleport(_now);
                    this.cancel();
                }
            }.runTaskLater(this, 0L);

            if (normalEmans.contains(entityID) && !onBeam.contains(entityID)){
                double damage = event.getDamage();
                double remaining_health = eman.getHealth();
                ChatColor health_color = ChatColor.GREEN;
                boolean isMagic = false;
                boolean isBow = false;

                if (isAtomsplit){
                    damage *= random.nextDouble(0.0032d, 0.035d);   // 2M
                } else {
                    damage *= random.nextDouble(0.0029d, 0.0033d); // 1.5M
                }

                if (event.getDamage() == 60 || event.getDamage() == 40) // hyp || fire veil wand
                    isMagic = true; 
                if (event.getDamage() == 15 || event.getDamage() == 45) // term || salvation
                    isBow = true;

                double _he = remaining_health - damage;
                if (_he < 0) _he = 0;
                health = toBossHealth(_he);
                eman.setHealth(_he);
                event.setDamage(0d);
                displayDamage(eman.getLocation().add(0, 1.5d, 0), 300_000_000/(40/damage), isMagic);

                final double _dmg = damage;
                if (isSoulcry && !isMagic){
                    getServer().getScheduler().runTaskTimer(this, new Runnable(){
                        private Integer c = 0;
                        private DustOptions redstone = new Particle.DustOptions(Color.RED, 1);
                        private Integer feros = toFerocityCount(fero/vgFeroDivision); // Voidgloom Seraph divides ferocity by 4()

                        @Override
                        public void run(){
                            if (this.c < this.feros){
                                this.c++;
                                double __dmg = _dmg;
                                ChatColor health_color = ChatColor.GREEN;
                                int health = toBossHealth(eman.getHealth() - __dmg);

                                Effects.doFerocity(
                                    eman,
                                    c,
                                    redstone,
                                    player,
                                    !(!normalEmans.contains(entityID) || onBeam.contains(entityID))
                                );
                                
                                if (!normalEmans.contains(entityID))
                                    eman.damage(_dmg, player);
                                if (!normalEmans.contains(entityID) || onBeam.contains(entityID))
                                    return;
                                displayDamage(eman.getLocation().add(0, 1.5, 0), 300_000_000/(40/_dmg), false);
                                eman.damage(_dmg);
                                Integer _health = toBossHealth(eman.getHealth());
                                if (health <= 150) health_color = ChatColor.YELLOW;
                                entity.setCustomName(
                                    ChatColor.RED+"☠ "
                                    +ChatColor.AQUA+"Voidgloom Seraph "
                                    +health_color+_health
                                    +"M"
                                );
                                new BukkitRunnable(){
                                    @Override
                                    public void run(){
                                        eman.setNoDamageTicks(0);
                                    }
                                }.runTaskLater(Slayer.plugin, 2L);
                                if (
                                    ((health <= 250 && !pastBeam1.contains(entityID)) ||
                                    (health <= 150 && !pastBeam2.contains(entityID)) ||
                                    (health <= 50 && !pastBeam3.contains(entityID))) && 
                                    !preparingBeam.contains(entityID)
                                    ){
                                    startBeam(eman, eman.getWorld());
                                    preparingBeam.add(entityID);
                                }
                                if (health <= 200 && !pastPhase2.contains(entityID) ||
                                    health <= 100 && !pastPhase3.contains(entityID)){
                                    normalEmans.remove(entityID);
                                }
                            }
                        }
                    }, 8L, 8L);
                }

                if (isMagic || isBow){
                    if (meta != null && meta.hasCustomModelData() && meta.getCustomModelData() == 2)
                        event.setDamage(event.getDamage()*4);
                    new BukkitRunnable(){
                        @Override
                        public void run(){
                            eman.setNoDamageTicks(0);
                        }
                    }.runTaskLater(this, 0L);
                } else {
                    meleeHitCD.add(damagerID);
                    new BukkitRunnable(){
                        @Override
                        public void run(){
                            eman.setNoDamageTicks(0);
                            meleeHitCD.remove(damagerID);
                        }
                    }.runTaskLater(this, 5L); // bonus attack speed %/100
                }
                if (health <= 150) health_color = ChatColor.YELLOW;

                if (
                    ((health <= 250 && !pastBeam1.contains(entityID)) ||
                    (health <= 150 && !pastBeam2.contains(entityID)) ||
                    (health <= 50 && !pastBeam3.contains(entityID))) && 
                    !preparingBeam.contains(entityID)
                    ){
                    startBeam(eman, eman.getWorld());
                    preparingBeam.add(entityID);
                }
                if (health <= 200 && !pastPhase2.contains(entityID) ||
                    health <= 100 && !pastPhase3.contains(entityID)){
                    normalEmans.remove(entityID);
                } else {
                    entity.setCustomName(
                        ChatColor.RED+"☠ "
                        +ChatColor.AQUA+"Voidgloom Seraph "
                        +health_color+health
                        +"M"
                    );
                    return;
                }
            }

            if (damager instanceof Player && !normalEmans.contains(entityID) && !onBeam.contains(entityID)){
                ChatColor health_color = ChatColor.GREEN;
                PotionEffect fireResistanceEffect = new PotionEffect(
                    PotionEffectType.FIRE_RESISTANCE, PotionEffect.INFINITE_DURATION,
                    1, true, false
                );
                eman.addPotionEffect(fireResistanceEffect);
                emanHasParticles.remove(entityID);
                if (hits == null){
                    hits = 100;
                    emanHasParticles.add(entityID);
                    playSoundtoPlayers(eman.getLocation(), "entity.zombie_villager.converted", 2f, 2f);
                    if (emanHittingDmgMap.get(entityID) == null){
                        emanHittingDmgMap.put(entityID,
                            getServer().getScheduler().runTaskTimer(this, new Runnable(){
                                private double damageRate = 0.01d;
                                @Override
                                public void run(){
                                    if (emanFighterMap.get(entityID) == null)
                                        return;
                                    for (Player player : emanFighterMap.get(entityID)){
                                        if (get2Ddistance(eman.getLocation(), player.getLocation()) <= 15d)
                                            player.damage(player.getHealthScale()*this.damageRate);
                                        if (this.damageRate <= 0.7d)
                                            this.damageRate += 0.015;
                                    }
                                }
                            }, 20L, 20L)
                        );
                    }
                }

                hits--;
                event.setCancelled(true);
                displayDamage(eman.getLocation().add(0d, 1.5d, 0d), 0d, false);
                if (isSoulcry && !(event.getDamage() == 60 || event.getDamage() == 40 || event.getDamage() == 101)){
                    getServer().getScheduler().runTaskTimer(this, new Runnable(){
                        private Integer c = 0;
                        private DustOptions redstone = new Particle.DustOptions(Color.RED, 1);
                        private Integer feros = toFerocityCount(fero/vgFeroDivision);

                        @Override
                        public void run(){
                            if (this.c < this.feros){
                                this.c++;
                                double dm = event.getDamage()*random.nextDouble(0.009d, 0.011d);
                                Effects.doFerocity(
                                    eman,
                                    c,
                                    redstone,
                                    player,
                                    false
                                );
                                if (!normalEmans.contains(entityID)){
                                    eman.damage(101, player);
                                    return;
                                }
                                displayDamage(eman.getLocation().add(0, 1.5, 0), 300_000_000/(40/dm), false);
                                eman.damage(dm);
                                ChatColor health_color = ChatColor.GREEN;
                                Integer health = toBossHealth(eman.getHealth());
                                if (health <= 150) health_color = ChatColor.YELLOW;
                                entity.setCustomName(
                                    ChatColor.RED+"☠ "
                                    +ChatColor.AQUA+"Voidgloom Seraph "
                                    +health_color+health
                                    +"M"
                                );
                            }
                        }
                    }, 8L, 8L);
                }

                if (hits == 0){
                    emanHittingDmgMap.get(entityID).cancel();
                    emanHittingDmgMap.remove(entityID);
                    eman.removePotionEffect(PotionEffectType.FIRE_RESISTANCE);
                    emanHitsMap.remove(entityID);
                    playSoundtoPlayers(entity.getLocation(), "entity.zombie_villager.cure", 1.0f, 0.8f);
                    normalEmans.add(entityID);
                    if (health <= 150) health_color = ChatColor.YELLOW;
                    entity.setCustomName(
                        ChatColor.RED+"☠ "
                        +ChatColor.AQUA+"Voidgloom Seraph "
                        +health_color+health
                        +"M"
                    );
                    if (health <= 200 && !pastPhase2.contains(entityID)){
                        pastPhase2.add(entityID);
                        new BukkitRunnable(){
                            @Override
                            public void run(){
                                startYangGlyphs(eman);
                                this.cancel();
                            }
                        }.runTaskLater(Slayer.plugin, random.nextLong(40L, 80L));
                    } else if (health <= 100 && !pastPhase3.contains(entityID)){
                        pastPhase3.add(entityID);
                    }
                } else {
                    if (hits < 66 && 40 < hits){
                        hitColor = ChatColor.LIGHT_PURPLE;
                    } else if (hits < 41) {
                        hitColor = ChatColor.DARK_PURPLE;
                    }
                    pitch = (175 - hits) / 100f;
                    if (pitch > 1.9f) pitch = 1.9f;
                    entity.setCustomName(
                        ChatColor.RED+"☠ "
                        +ChatColor.AQUA+"Voidgloom Seraph "
                        +hitColor+ChatColor.BOLD+hits.toString()+" Hits"
                    );
                    entity.setCustomNameVisible(true);
                    emanHitsMap.put(entityID, hits);
                    if (!onBeam.contains(entityID)){
                        Location _location = entity.getLocation().add(random.nextDouble(-0.7, 0.7), 0, random.nextDouble(-0.7, 0.7));
                        entity.getWorld().spawnParticle(
                            Particle.PORTAL,
                            entity.getLocation(),
                            50,
                            1d,
                            2d,
                            1d,
                            1d
                        );
                        while (_location.getBlock().getType() != Material.AIR){
                            _location = _location.add(0, 1, 0);
                        }
                        entity.teleport(_location);
                        playSoundtoPlayers(entity.getLocation(), "entity.enderman.teleport", 1.0f, pitch);
                    }
                }
            }
            if (onBeam.contains(entityID)){
                event.setCancelled(true);
            }
        }
        if (entity instanceof Guardian) event.setCancelled(true);
    }


    private int toBossHealth(@Nonnull final double health){
        /*
         * Convert to Voidgloom serph health
         */
        return (int)Math.ceil(health*7.5f);
    }


    private void startBeam(final Enderman eman, final World world){
        final String entityID = getStringID(eman);
        final ArmorStand armorStand = (ArmorStand) world.spawnEntity(
            eman.getLocation().add(0, -1.4, 0),
            EntityType.ARMOR_STAND
        );
        final PotionEffect fireResistanceEffect = new PotionEffect(
            PotionEffectType.FIRE_RESISTANCE, PotionEffect.INFINITE_DURATION,
            1, true, false
        );

        eman.addPotionEffect(fireResistanceEffect);
        armorStand.setInvisible(true);
        armorStand.setInvulnerable(true);
        armorStand.addPassenger(eman);
        armorStand.setGravity(false);
        world.spawnParticle(
            Particle.EXPLOSION_LARGE,
            eman.getLocation().add(0, 1, 0),
            50,
            1.5d,
            1.5d,
            1.5d,
            0
        );
        final BukkitTask loop = getServer().getScheduler().runTaskTimer(Slayer.plugin, new Runnable(){
            @Override
            public void run(){
                armorStand.addPassenger(eman);
            }
        }, 0L, 0L);
        // start broken heart radiation after waited for explosion for 1 secound
        new BukkitRunnable(){
            @Override
            public void run(){
                List<Entity> guardians = new ArrayList<>();
                List<ArmorStand> arms_ = new ArrayList<>();
                double x = 11.3d;
                eman.setTarget(null);
                onBeam.add(entityID);
                preparingBeam.remove(entityID);
                for (double y = -0.4d; y <= 2.5d; y += 1.45d){
                    for (double z = -14.14d; z <= 14.14d; z += 28.28d){
                        ArmorStand arms = (ArmorStand) world.spawnEntity(
                            eman.getLocation().add(x, y, z),
                            EntityType.ARMOR_STAND
                        );
                        arms.setInvisible(true);
                        arms.setInvulnerable(true);
                        arms.setGravity(false);
                        Guardian guardian = (Guardian) world.spawnEntity(eman.getLocation().add(-x, y, -z), EntityType.GUARDIAN);
                            guardian.setInvisible(true);
                            guardian.setGravity(false);
                            guardian.setInvulnerable(true);
                            guardian.setLaser(true);
                            guardian.setTarget(arms);
                            guardians.add(guardian);
                            guardian.addPotionEffect(fireResistanceEffect);
                            if (z > 0d){
                                guardianPosTheta.put(getStringID(guardian), Arrays.asList(135d, y));
                            }
                            else {
                                guardianPosTheta.put(getStringID(guardian), Arrays.asList(225d, y));
                            }
                        arms_.add(arms);
                    }
                }
                final List<Entity> _guardians = guardians;
                final List<ArmorStand> _arms = arms_;
                final BukkitTask _loop = getServer().getScheduler().runTaskTimer(Slayer.plugin, new Runnable(){
                    @Override
                    public void run(){
                        final double r = 20d;
                        for (Entity _g : _guardians){
                            List<Player> _dmgd = new ArrayList<>();
                            int __index = _guardians.indexOf(_g);
                            Guardian _guardian = (Guardian) _g;
                            ArmorStand _a = _arms.get(__index);
                            List<Double> _guardianLocation = guardianPosTheta.get(getStringID(_guardian));
                            double theta = _guardianLocation.get(0);
                            double radians = Math.toRadians(theta);
                            double x = r*Math.cos(radians);
                            double y = _guardianLocation.get(1);
                            double z = r*Math.sin(radians);

                            // eman.getLocation() = O(0, 0)
                            /*         z
                            *          ↑
                            *          |
                            *          |
                            * ---------+-------->x
                            *         O|
                            *          |
                            *          |
                            */
                            _guardian.teleport(
                                eman.getLocation().add(x, y, z)
                            );
                            _a.teleport(
                                eman.getLocation().add(-x, y, -z)
                            );
                            for (double _r = -20d; _r <= 20d; _r += 0.5d){
                                boolean _lf = false;
                                if (_r < 0) _lf = true;
                                double rd = Math.abs(_r);
                                double _radians = Math.toRadians(theta);
                                double _x = rd*Math.cos(_radians);
                                double _y = y;
                                double _z = rd*Math.sin(_radians);
                                if (_lf) {_x *= -1; _z *= -1;}
                                Location _sLoc = eman.getLocation().add(_x, _y, _z);
                                
                                if (emanFighterMap.get(entityID) != null){
                                    for (Player player : emanFighterMap.get(entityID)){
                                        if (isStacking(player.getLocation(), _sLoc, 0.5d, 1d, 0.5d)){
                                            _dmgd.add(player);
                                        }
                                    }
                                }
                            }
                            for (Player _pl : _dmgd){
                                _pl.damage(_pl.getHealthScale()/4);
                            }
                            theta += 2;    // speed
                            if (theta > 360) theta -= 360;
                            guardianPosTheta.put(getStringID(_guardian), Arrays.asList(theta, y));
                            _guardian.setLaser(true);
                            _guardian.setTarget(_a);
                            _guardian.setFireTicks(0);
                            armorStand.addPassenger(eman);
                            if (!loop.isCancelled()) loop.cancel();
                        }
                        for (Player player : eman.getWorld().getPlayers()) player.stopSound("entity.guardian.ambient_land");
                    }
                }, 0L, 0L);
                new BukkitRunnable(){
                    @Override
                    public void run(){
                        String entityID = getStringID(eman);
                        eman.removePotionEffect(PotionEffectType.FIRE_RESISTANCE);
                        for (Entity guardian : _guardians){
                            guardianPosTheta.remove(getStringID(guardian));
                            guardian.remove();
                        }
                        for (ArmorStand __a : _arms){
                            __a.remove();
                        }
                        onBeam.remove(entityID);
                        armorStand.remove();
                        if (!pastBeam1.contains(entityID)){
                            pastBeam1.add(entityID);
                        } else if (!pastBeam2.contains(entityID)){
                            pastBeam2.add(entityID);
                        } else if (!pastBeam3.contains(entityID)){
                            pastBeam3.add(entityID);
                        }
                        _loop.cancel();
                        this.cancel();
                    }
                }.runTaskLater(Slayer.plugin, broken_heart_radiation_range + 20L);
            }
        }.runTaskLater(this, 20L);
    }


    @EventHandler
    public void onEntityTarget(EntityTargetEvent event){
        Entity entity = event.getEntity();
        if (entity instanceof Guardian && event.getTarget() instanceof Player){
            event.setCancelled(true);
        }
        if (entity instanceof Enderman && onBeam.contains(getStringID(entity))){
            event.setCancelled(true);
        }
        if (entity instanceof Creeper && ((Creeper) entity).isPowered()){
            event.setCancelled(true);
        }
    }


    @EventHandler
    public void onEntityDamage(EntityDamageEvent event){
        Entity entity = event.getEntity();
        if (entity instanceof Player){
            Player player = (Player) entity;
            if (cpreeperVeilMap.get(getStringID(player)) != null){
                event.setCancelled(true);
            }
        }
    }


    public static Enderman spawnVoidgloom(final World world, final Location location, Player spawner){
        final Enderman eman = (Enderman) world.spawnEntity(
            location,
            EntityType.ENDERMAN
        );
        final String emanID = getStringID(eman);
        PotionEffect insta_heal = new PotionEffect(
            PotionEffectType.HEAL, 1,
            100, true, false
        );
        PotionEffect health_boost = new PotionEffect(
            PotionEffectType.HEALTH_BOOST, PotionEffect.INFINITE_DURATION,
            4, true, false
        );
        PotionEffect jump_boost = new PotionEffect(
            PotionEffectType.JUMP, PotionEffect.INFINITE_DURATION,
            5, true, false
        );
        PotionEffect speed_boost = new PotionEffect(
            PotionEffectType.SPEED, PotionEffect.INFINITE_DURATION,
            7, true, false
        );
        for (PotionEffect p : Arrays.asList(
            health_boost, jump_boost, speed_boost, insta_heal
            )) spawner.addPotionEffect(p);
        emanFighterMap.put(emanID, Arrays.asList(spawner));
        emanHasParticles.add(emanID);
        eman.setCustomName(
            ChatColor.RED+"☠ "
            +ChatColor.AQUA+"Voidgloom Seraph "
            +ChatColor.WHITE+ChatColor.BOLD+"100 Hits"
        );
        Slayer.emanHittingDmgMap.remove(emanID);
        emanHittingDmgMap.put(emanID,
            Slayer.plugin.getServer().getScheduler().runTaskTimer(Slayer.plugin, new Runnable(){
                private double damageRate = 0.01d;
                @Override
                public void run(){
                    for (Player player : emanFighterMap.get(emanID)){
                        if (Slayer.get2Ddistance(eman.getLocation(), player.getLocation()) <= 15d)
                            player.damage(player.getHealthScale()*this.damageRate);
                        if (this.damageRate <= 0.7d)
                            this.damageRate += 0.015d;
                    }
                }
            }, 20L, 20L)
        );
        eman.setCustomNameVisible(true);
        emanHitsMap.put(emanID, 100);
        Slayer.plugin.startEtherWarp(eman, 240L);
        playSoundtoPlayers(eman.getLocation(), "entity.wither.spawn", 1.0f, 1.8f);
        playSoundtoPlayers(eman.getLocation(), "entity.zombie_villager.converted", 2f, 2f);
        return eman;
    }


    public static String getStringID(Entity e){
        return ((Integer)e.getEntityId()).toString();
    }


    public static void playSoundtoPlayers(Location location, String sound, float volume, float pitch){
        for (Player player : location.getWorld().getPlayers()) player.playSound(location, sound, volume, pitch);
    }


    public void startYangGlyphs(final Enderman eman){
        final String entityID = getStringID(eman);
        if (eman.isDead())
            return;
        eman.setCarriedBlock(Bukkit.createBlockData(Material.BEACON));
        playSoundtoPlayers(eman.getLocation(), "entity.elder_guardian.ambient", 2f, 2f);
        new BukkitRunnable(){
            @Override
            public void run(){
                if (normalEmans.contains(entityID)){
                    int _randomValue = random.nextInt(2);
                    int __randomValue = random.nextInt(2);
                    int _result = (_randomValue == 0) ? -1 : 1;
                    int __result = (__randomValue == 0) ? -1 : 1;
                    final Location emanLocation = eman.getLocation();
                    final FallingBlock beacon = eman.getWorld().spawnFallingBlock(emanLocation.add(0, 1, 0), Material.BEACON.createBlockData());
                        beacon.setVelocity(new Vector(
                            _result*random.nextDouble(0.7d, 1d),  // X
                            random.nextDouble(0.3d, 0.5d),        // Y
                            __result*random.nextDouble(0.7d, 1d)  // Z
                        ));
                        beacon.setInvulnerable(true);
                        beacon.setDropItem(false);
                    eman.setCarriedBlock(null);
                    controlYangGlyphs(beacon, eman);
                    this.cancel();
                } else {
                    /*
                     * if eman is on beam phase
                     */
                    getServer().getScheduler().runTaskTimer(Slayer.plugin, new Runnable(){
                        private boolean past = false;
                        @Override
                        public void run(){
                            if (!past && normalEmans.contains(entityID)){
                                int _randomValue = random.nextInt(2);
                                int __randomValue = random.nextInt(2);
                                int _result = (_randomValue == 0) ? -1 : 1;
                                int __result = (__randomValue == 0) ? -1 : 1;
                                final Location emanLocation = eman.getLocation();
                                final FallingBlock beacon = eman.getWorld().spawnFallingBlock(emanLocation.add(0, 1, 0), Material.BEACON.createBlockData());
                                    beacon.setVelocity(new Vector(
                                        _result*random.nextDouble(0.5d, 0.7d),  // X
                                        random.nextDouble(0.3d, 0.5d),          // Y
                                        __result*random.nextDouble(0.5d, 0.7d)  // Z
                                    ));
                                    beacon.setInvulnerable(true);
                                    beacon.setDropItem(false);
                                eman.setCarriedBlock(null);
                                controlYangGlyphs(beacon, eman);
                                this.past = true;
                            }
                        }
                    }, 0L, 20L); // how often of detection
                }
            }
        }.runTaskLater(Slayer.plugin, 60L); // ticks to wait between hold and throw
    }


    public BukkitTask controlYangGlyphs(final FallingBlock fb, final Enderman eman){
        final String entityID = getStringID(eman);
        return getServer().getScheduler().runTaskTimer(this, new Runnable(){
            private Location _lastLoc = fb.getLocation();
            private boolean past = false;

            @Override
            public void run(){
                if (fb.isDead() && !this.past){
                    _lastLoc.getWorld().setBlockData(
                        _lastLoc, Material.BEACON.createBlockData()
                    );
                    final Location lastLoc = _lastLoc;
                    // <se>
                    final BukkitTask _taskLoop = getServer().getScheduler().runTaskTimer(Slayer.plugin, new Runnable(){
                        private boolean _e = false;
                        @Override
                        public void run(){
                            if (this._e) return;
                            List<Player> _fighters = emanFighterMap.get(entityID);
                            playSoundtoPlayers(lastLoc, "entity.elder_guardian.curse", 0.25f, 0.5f);
                            lastLoc.getWorld().spawnParticle(
                                Particle.ENCHANTMENT_TABLE,
                                lastLoc,
                                100,
                                0d,
                                0d,
                                0d,
                                3d
                            );
                            for (Player figher : _fighters){
                                if (isTouching(lastLoc, figher.getLocation()) || eman.isDead()){
                                    lastLoc.getWorld().setBlockData(lastLoc, Material.AIR.createBlockData());
                                    List<Player> fighters = emanFighterMap.get(entityID);
                                    lastLoc.getWorld().setBlockData(lastLoc, Material.AIR.createBlockData());
                                    if (!eman.isDead()){
                                        for (Player _figher : fighters){
                                            _figher.playSound(lastLoc, "block.glass.break", 5f, 0.5f);
                                            _figher.playSound(lastLoc, "item.shield.break", 5f, 0.5f);
                                        }
                                    }
                                    getServer().getScheduler().runTaskTimer(Slayer.plugin, new Runnable(){
                                        private boolean d = false;
                                        @Override
                                        public void run(){
                                            if (d || !normalEmans.contains(entityID))
                                                return;
                                            startYangGlyphs(eman);
                                            this.d = true;
                                        }
                                    }, 100L, 60L); // delay: ticks to wait between break and hold
                                    this._e = true;
                                    break;
                                }
                            }
                        }
                    }, 0L, 1L);
                    new BukkitRunnable(){
                        @Override
                        public void run(){
                            getServer().getScheduler().runTaskTimer(Slayer.plugin, new Runnable(){
                                final private float max_pitch = 1.85f;
                                private float pitch = 0.6f;
                                private boolean _e = false;
                                @Override
                                public void run(){
                                    boolean _isb = lastLoc.getWorld().getBlockAt(lastLoc).getType() == Material.BEACON;
                                    if (!_isb) return;
                                    if (this.pitch < this.max_pitch){
                                        playSoundtoPlayers(lastLoc, "entity.elder_guardian.curse", 0.5f, this.pitch);
                                        this.pitch += 0.02f;
                                    } else if (!this._e){
                                        List<Player> _fighters = emanFighterMap.get(entityID);
                                        lastLoc.getWorld().setBlockData(lastLoc, Material.AIR.createBlockData());
                                        this.pitch = this.max_pitch;
                                        for (Player figher : _fighters){
                                            figher.playSound(lastLoc, "block.glass.break", 5f, 0.5f);
                                            figher.playSound(lastLoc, "item.shield.break", 5f, 0.5f);
                                            figher.damage(9999d);
                                        }
                                        getServer().getScheduler().runTaskTimer(Slayer.plugin, new Runnable(){
                                            private boolean d = false;
                                            @Override
                                            public void run(){
                                                if (d || !normalEmans.contains(entityID))
                                                    return;
                                                startYangGlyphs(eman);
                                                this.d = true;
                                            }
                                        }, 100L, 60L); // delay: ticks to wait between break and hold
                                        _taskLoop.cancel();
                                        this._e = true;
                                    }
                                }
                            }, 0L, 2L);
                        }
                    }.runTaskLater(Slayer.plugin, 1L);
                    // </se>
                    this.past = true;
                } else {
                    _lastLoc = fb.getLocation();
                }
            }
        }, 0L, 0L);
    }


    public BukkitTask startEtherWarp(final Enderman eman, final long period){
        final String entityID = getStringID(eman);
        final BukkitTask task = getServer().getScheduler().runTaskTimer(this, new Runnable(){
            @Override
            public void run(){
                if (!normalEmans.contains(entityID) || eman.isDead())
                    return;
                for (Player p : emanFighterMap.get(entityID)){
                    p.playSound(eman.getLocation(), "entity.ender_dragon.hurt", SoundCategory.MASTER, 2f, 0.5f);
                }
                Location next;
                do {
                    int _randomValue = random.nextInt(2);
                    int __randomValue = random.nextInt(2);
                    int _result = (_randomValue == 0) ? -1 : 1;
                    int __result = (__randomValue == 0) ? -1 : 1;
                    final double xvec = _result*random.nextDouble(4d, 7d);
                    final double zvec = __result*random.nextDouble(4d, 7d);
                    next = emanFighterMap
                        .get(entityID)
                        .get(0)
                        .getLocation()
                        .add(xvec, 0, zvec);
                    next.setY(81d);
                    while (next.getBlock().getType() != Material.AIR){
                        next.add(0, 1, 0);
                    }
                } while (
                    !(get2Ddistance(eman.getLocation(), next) >= 8) &&
                    !preparingBeam.contains(entityID) &&
                    !onBeam.contains(entityID)
                );
                final ArmorStand armrst = (ArmorStand) eman.getWorld().spawnEntity(
                    eman.getLocation(),
                    EntityType.ARMOR_STAND
                );
                armrst.setInvisible(true);
                armrst.setInvulnerable(true);
                armrst.setGravity(false);
                final Location _next = next;

                Slayer.plugin.getServer().getScheduler().runTaskTimer(Slayer.plugin, new Runnable(){
                    private Integer mcount = 11;
                    private double multply = 0.1d;
                    private double mx = (_next.getX() - armrst.getLocation().getX())/2;
                    private double mz = (_next.getZ() - armrst.getLocation().getZ())/2;
                    @Override
                    public void run(){
                        if (this.mcount <= 1){
                            if (!armrst.isDead())
                                armrst.remove();
                            return;
                        }
                        
                        double x = this.mx*this.multply;
                        double z = this.mz*this.multply;
                        for (double y = 0.5d; y <= 2.5d; y += 1.0d){
                            eman.getWorld().spawnParticle(
                                Particle.SPELL_WITCH,
                                armrst.getLocation().add(x, y, z),
                                5,
                                0d, 0d, 0d,
                                0
                            );
                            eman.getWorld().spawnParticle(
                                Particle.SMOKE_LARGE,
                                armrst.getLocation().add(x, y, z),
                                5,
                                0d, 0d, 0d,
                                0
                            );
                        }
                        this.multply += 0.1d;
                        this.mcount--;
                    }
                }, 0L, 2L);
                if (!preparingBeam.contains(entityID) && !onBeam.contains(entityID))
                    eman.teleport(next);
            }
        }, 0L, period);
        return task;
    }


    public boolean isTouching(Location beaconLoc, Location playerLoc){
        double beacX = Math.abs(Math.floor(beaconLoc.getX())) + 0.5d;
        double beacY = Math.abs(Math.floor(beaconLoc.getY()));
        double beacZ = Math.abs(Math.floor(beaconLoc.getZ())) + 0.5d;

        double plyX = Math.abs(playerLoc.getX());
        double plyY = Math.abs(playerLoc.getY());
        double plyZ = Math.abs(playerLoc.getZ());

        double diffX = Math.abs(plyX - beacX);
        double diffY = Math.abs(plyY - beacY);
        double diffZ = Math.abs(plyZ - beacZ);

        return diffX <= 0.81d && diffY <= 1.1d && diffZ <= 0.81d;
    }

    public boolean isStacking(@Nonnull Location loc_a, @Nonnull Location loc_b, @Nonnegative double Xrange, @Nonnegative double Yrange, @Nonnegative double Zrange){
        return Math.abs(loc_a.getX() - loc_b.getX()) <= Xrange &&
            Math.abs(loc_a.getY() - loc_b.getY()) <= Yrange &&
            Math.abs(loc_a.getZ() - loc_b.getZ()) <= Zrange;
    }


    @EventHandler
    public void onPlayerInteract(PlayerInteractEvent event){
        if (event.getAction() == Action.RIGHT_CLICK_AIR || event.getAction() == Action.RIGHT_CLICK_BLOCK){
            ItemStack item = event.getItem();

            if (item != null){
                ItemMeta meta = item.getItemMeta();
                final Player player = event.getPlayer();
                final String playerID = getStringID(player);
                if (!meta.hasCustomModelData())
                    return;
                // Wither Cloak Sword
                if (meta.getCustomModelData() == 1){
                    CVeil cveil = cpreeperVeilMap.get(playerID);
                    if (cveil != null){
                        cveil.shutDown();
                        cpreeperVeilMap.remove(playerID);
                        player.playSound(player, "entity.skeleton.hurt", SoundCategory.MASTER, 1f, 1.2f);
                        player.sendMessage(ChatColor.LIGHT_PURPLE+"Creeper Veil "+ChatColor.RED+"De-activated!");
                    } else {
                        List<Creeper> _veils = new ArrayList<>();
                        for (int i = 0; i < 6; i++){
                            Creeper crp = (Creeper) player.getWorld().spawnEntity(
                                new Location(player.getWorld(), 0d, 0d, 0d),
                                EntityType.CREEPER
                            );
                            _veils.add(crp);
                        }
                        final CVeil _cveil = new CVeil(_veils, player, 0d);
                        _cveil.rotateVeils(4d);
                        _cveil.setDe_Activable(true);
                        player.sendMessage(ChatColor.LIGHT_PURPLE+"Creeper Veil "+ChatColor.GREEN+"Activated!");
                        cpreeperVeilMap.put(playerID, _cveil);
                    }
                }
                // Atomsplit Katana
                else if (meta.getCustomModelData() == 2){
                    if (soulcryMap.get(playerID) == null){
                        ItemStack _sword = new ItemStack(Material.GOLDEN_SWORD);
                        ItemMeta _meta = _sword.getItemMeta();
                        Map<Enchantment, Integer> _md = meta.getEnchants();
                        AttributeModifier attack_speed = new AttributeModifier(
                            "AttackSpeedModifier",
                            1000,
                            AttributeModifier.Operation.ADD_NUMBER
                        );
                        player.playSound(player, "entity.ghast.scream", SoundCategory.MASTER, 1f, 2f);
                        player.playSound(player, "entity.ghast.warn", SoundCategory.MASTER, 1f, 2f);
                        _meta.setDisplayName(meta.getDisplayName());
                        _meta.setLore(meta.getLore());
                        _meta.setUnbreakable(true);
                        _meta.setCustomModelData(2);
                        for (ItemFlag f : meta.getItemFlags()){
                            _meta.addItemFlags(f);
                        }
                        for (Enchantment e : _md.keySet()){
                            _meta.addEnchant(e, _md.get(e), true);
                        }
                        _meta.addAttributeModifier(Attribute.GENERIC_ATTACK_SPEED, attack_speed);
                        _sword.setItemMeta(_meta);
                        player.getInventory().setItemInMainHand(_sword);
                        soulcryMap.put(playerID, Arrays.asList(item, _sword));
                        new BukkitRunnable(){
                            @Override
                            public void run(){
                                getServer().getScheduler().runTaskTimer(Slayer.plugin, new Runnable(){
                                    private final List<ItemStack> is = soulcryMap.get(playerID);
                                    private boolean done = false;
                                    @Override
                                    public void run(){
                                        if (this.done)
                                            return;
                                        try{
                                            Integer sl = player.getInventory().first(this.is.get(1));
                                            player.getInventory().setItem(sl, this.is.get(0));
                                            soulcryMap.remove(playerID);
                                            player.playSound(player, "entity.ghast.scream", SoundCategory.MASTER, 1f, 1.5f);
                                            player.playSound(player, "entity.ghast.warn", SoundCategory.MASTER, 1f, 1.5f);
                                            this.done = true;
                                        } catch (IndexOutOfBoundsException e){}
                                    }
                                }, 0L, 0L);
                            }
                        }.runTaskLater(this, 80L);
                    } else {
                        player.playSound(player, "entity.enderman.teleport", SoundCategory.MASTER, 1f, 0.5f);
                        player.sendMessage(ChatColor.RED+"This Ability is currently on cooldown!");
                    }
                }
                // Wand of Atonement
                else if (meta.getCustomModelData() == 3){
                    BukkitTask _task = wand_of_atonementMap.get(playerID);
                    if (_wand_of_atonementPls.contains(playerID)){
                        player.playSound(player, "entity.enderman.teleport", SoundCategory.MASTER, 1f, 0.5f);
                        player.sendMessage(ChatColor.RED+"This Ability is currently on cooldown for 1s");
                        return;
                    }
                    _wand_of_atonementPls.add(playerID);
                    if (_task != null)
                        _task.cancel();
                    PotionEffect reg = new PotionEffect(
                        PotionEffectType.REGENERATION,
                        PotionEffect.INFINITE_DURATION,
                        0,
                        true
                    );
                    player.addPotionEffect(reg);
                    wand_of_atonementMap.put(
                        playerID,
                        getServer().getScheduler().runTaskTimer(this, new Runnable(){
                            private double y = 0;
                            @Override
                            public void run(){
                                if (this.y > 10){
                                    player.removePotionEffect(PotionEffectType.REGENERATION);
                                    wand_of_atonementMap.get(playerID).cancel();
                                }
                                try{
                                    player.setHealth(player.getHealth() + player.getHealthScale()/4); /* amout of Huge Heal */
                                } catch (IllegalArgumentException e){
                                    player.addPotionEffect(new PotionEffect(
                                        PotionEffectType.HEAL,
                                        1,
                                        100,
                                        true
                                        )
                                    );
                                }
                                
                                if (this.y == 0)
                                    player.playSound(player, "block.lava.pop", 1f, 1.5f);
                                if (this.y == 1)
                                    _wand_of_atonementPls.remove(playerID);
                                this.y++;
                            }
                        }, 0L, 15L)
                    );
                }
                // Fire Veil Wand
                else if (meta.getCustomModelData() == 4){
                    if (fire_veil_wandMap.get(playerID) == null){
                        final FVeil fveil = new FVeil(player);
                        fveil.startVeil();
                        new BukkitRunnable(){
                            @Override
                            public void run(){
                                fveil.setInitable(true);
                            }
                        }.runTaskLater(this, 10L);
                        fire_veil_wandMap.put(playerID, fveil);
                    } else {
                        final FVeil _fveil = fire_veil_wandMap.get(playerID);
                        if (!_fveil.isInitable()){
                            player.playSound(player, "entity.enderman.teleport", SoundCategory.MASTER, 1f, 0.5f);
                            player.sendMessage(ChatColor.RED+"This Ability is currently on cooldown for 1s");
                            return;
                        }
                        if (_fveil.cdTask != null){
                            _fveil.cdTask.cancel();
                        }
                        _fveil.setInitable(false);
                        _fveil.cdTask = new BukkitRunnable(){
                            @Override
                            public void run(){
                                _fveil.setInitable(true);
                            }
                        }.runTaskLater(this, 10L);
                        _fveil.restartFireDamage();
                        _fveil.rem = _fveil.maxrem;
                    }
                }
            }
        }
    }


    public static double get2Ddistance(@Nonnull Location loc_1, @Nonnull Location loc_2){
        return Math.sqrt(
            Math.pow(loc_1.getX() - loc_2.getX(), 2)+
            Math.pow(loc_1.getZ() - loc_2.getZ(), 2)
        );
    }


    public void displayDamage(Location loc, @Nonnegative double damage, boolean isMagic){
        int _randomValue = random.nextInt(2);
        int __randomValue = random.nextInt(2);
        int ___randomValue = random.nextInt(2);
        int _result = (_randomValue == 0) ? -1 : 1;
        int __result = (__randomValue == 0) ? -1 : 1;
        int ___result = (___randomValue == 0) ? -1 : 1;
        final double xvec = _result*random.nextDouble(0.1d, 0.3d);
        final double yvec = __result*random.nextDouble(0.1d, 0.3d);
        final double zvec = ___result*random.nextDouble(0.1d, 0.3d);
        final TextDisplay td = (TextDisplay) loc.getWorld().spawnEntity(loc.add(xvec, yvec, zvec), EntityType.TEXT_DISPLAY);
        td.setBillboard(Billboard.CENTER);
        String v = toVisualNum((int) damage);
        if (isMagic){
            td.setText(ChatColor.GRAY+v);
        } else {
            td.setText( "✧" +toCritDmg(v)+ChatColor.RESET+ "✧" );
        }
        new BukkitRunnable(){
            @Override
            public void run(){
                td.remove();
            }
        }.runTaskLater(this, 15L);
    }


    public String toVisualNum(int d){
        return (new DecimalFormat("#,###.######")).format(d);
    }
    

    private String toCritDmg(String dmg){
        String h = String.valueOf( dmg );
        String[] g = h.split("");
        List<String> re = new ArrayList<>();
        List<ChatColor> k = Arrays.asList( ChatColor.RED, ChatColor.RED, ChatColor.YELLOW, ChatColor.YELLOW );
        for (int i = 0; i < g.length ; i++){
            if ( g.length - i > 4 || g[i].equals(",") ){
                re.add(g[i]);
                continue;
            }
            if (dmg.length() >= 4){
                re.add( k.get(g.length - i - 1).toString() );
            }
            re.add( g[i] );
        }
        return String.join( "", re );
    }


    /**
     * returns how many times ferocity works
     * @param ferocity a value of percentage
     * @return times to fero
     */
    public Integer toFerocityCount(Integer ferocity){
        Integer m = (int) Math.floor(ferocity/100);
        if (random.nextInt(0, 100) < ferocity - m*100)
            m++;
        return m;
    }
}
