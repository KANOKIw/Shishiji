package com.kanokiw.mc.sushida;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.bukkit.ChatColor;
import org.bukkit.Material;
import org.bukkit.attribute.Attribute;
import org.bukkit.attribute.AttributeModifier;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.enchantments.Enchantment;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemFlag;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.ItemMeta;


public class Stuffs implements CommandExecutor, TabCompleter {
    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String label, String[] args){
        List<String> candidates = new ArrayList<>();
        if (args.length == 1){
            candidates.add("wither_cloak_sword");
            candidates.add("atomsplit_katana");
            candidates.add("wand_of_atonement");
            candidates.add("fire_veil_wand");
        }
        return candidates;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args){
        if (args.length >= 1){
            String potato = ChatColor.YELLOW+"(+30)";
            String theArtofWar = ChatColor.GOLD+"[+5]";
            AttributeModifier _maxed = new AttributeModifier(
                "AttackSpeedModifier",
                10000,
                AttributeModifier.Operation.ADD_NUMBER
            );
            if (args[0].equals("wither_cloak_sword")){
                Player player = (Player) sender;
                ItemStack item = new ItemStack(Material.STONE_SWORD);
                ItemMeta meta = item.getItemMeta();
                meta.setCustomModelData(1);
                meta.setDisplayName(
                    ChatColor.DARK_PURPLE+"Heroic Wither Cloak Sword"
                    +ChatColor.GOLD+" ✪✪✪✪✪"+ChatColor.RED+"➎"
                );
                meta.setLore(
                    Arrays.asList(
                        ChatColor.GRAY+"Gear Score: "+ChatColor.LIGHT_PURPLE+"875",
                        ChatColor.GRAY+"Damage: "+ChatColor.RED+"+190",
                        ChatColor.GRAY+"Strength: "+ChatColor.RED+"+135",
                        ChatColor.GRAY+"Defence: "+ChatColor.GREEN+"+250",
                        "",
                        ""+ChatColor.LIGHT_PURPLE+ChatColor.BOLD+"Ultimate Wise V",
                        "",
                        ChatColor.GOLD+"Ability: Creeper Veil  "+ChatColor.YELLOW+ChatColor.BOLD+"RIGHT CLICK",
                        ChatColor.GRAY+"Spawns a protective veil that",
                        ChatColor.GRAY+"grants you immunity from damage.",
                        ChatColor.GRAY+"Consumes "+ChatColor.AQUA+"20% max mana",
                        ChatColor.GRAY+"each time you block a hit.",
                        ChatColor.GRAY+"You cannot attack while the",
                        ChatColor.GRAY+"barrier is up.",
                        ChatColor.DARK_GRAY+"Cooldown: "+ChatColor.GREEN+"10s",
                        "",
                        ""+ChatColor.YELLOW+ChatColor.BOLD+"RIGHT CLICK "+ChatColor.GRAY+"while active.",
                        "",
                        ChatColor.DARK_GRAY+"This item can be reforged!",
                        ""+ChatColor.DARK_PURPLE+ChatColor.BOLD+"EPIC DUNGEON SWORD"
                    )
                );
                meta = toNormalMeta(meta);
                meta.addEnchant(Enchantment.DAMAGE_ALL, 5, true);
                meta.addAttributeModifier(Attribute.GENERIC_ATTACK_SPEED, _maxed);
                item.setItemMeta(meta);
                player.getInventory().addItem(item);
            }
            if (args[0].equals("atomsplit_katana")){
                Player player = (Player) sender;
                ItemStack item = new ItemStack(Material.DIAMOND_SWORD);
                ItemMeta meta = item.getItemMeta();
                meta.setCustomModelData(2);
                meta.setDisplayName(
                    ChatColor.LIGHT_PURPLE+"Withered Atomsplit Katana"
                );
                meta.setLore(
                    Arrays.asList(
                        ChatColor.GRAY+"Damage: "+ChatColor.RED+"+275 "+potato,
                        ChatColor.GRAY+"Strength: "+ChatColor.RED+"+312 "+potato+" "+theArtofWar+ChatColor.BLUE+" (+170)"+ChatColor.LIGHT_PURPLE+" (+14)",
                        ChatColor.GRAY+"Crit Chance: "+ChatColor.RED+"+10%",
                        ChatColor.GRAY+"Crit Damage: "+ChatColor.RED+"+210%",
                        ChatColor.GRAY+"Intelligence: "+ChatColor.GREEN+"+324"+ChatColor.LIGHT_PURPLE+" (+60)",
                        ChatColor.GRAY+"Ferocity: "+ChatColor.GREEN+"+5",
                        ChatColor.GOLD+" ["+ChatColor.AQUA+"⚔"+ChatColor.GOLD+"] "+ChatColor.GOLD+"["+ChatColor.AQUA+"⚔"+ChatColor.GOLD+"] "+ChatColor.GOLD+"["+ChatColor.LIGHT_PURPLE+"⚔"+ChatColor.GOLD+"]",
                        "",
                        ""+ChatColor.LIGHT_PURPLE+ChatColor.BOLD+"Inferno V"+ChatColor.RESET+ChatColor.BLUE+", Champion X, CleaveV",
                        ""+ChatColor.BLUE+"Critical VII, Cubism V, Ender Slayer VII",
                        ""+ChatColor.BLUE+"Experience IV, Giant Killer VII, Impaling III",
                        ""+ChatColor.BLUE+"Lethality VI, Lootion IV, Luck VI",
                        ""+ChatColor.BLUE+"Procecute V, Scavenger IV, Sharpness VII",
                        ""+ChatColor.BLUE+"Syphon IV, Thunderlord VII, Triple-Strike IV",
                        ""+ChatColor.BLUE+"Vamparism VI, Venomous V",
                        "",
                        ChatColor.GRAY+"Deal "+ChatColor.GREEN+"+300% "+ChatColor.GRAY+"damage to Endermen.",
                        ChatColor.GRAY+"Receive "+ChatColor.GREEN+"12% "+ChatColor.GRAY+"less damage",
                        ChatColor.GRAY+"from Endermen while held.",
                        "",
                        ""+ChatColor.LIGHT_PURPLE+ChatColor.BOLD+"⦾"+ChatColor.RESET+ChatColor.GOLD+" Ability: Soulcry  "+ChatColor.YELLOW+ChatColor.BOLD+"RIGHT CLICK",
                        ChatColor.GRAY+"Gain "+ChatColor.RED+"+400%⫽ Ferocity "+ChatColor.GRAY+"against",
                        ChatColor.GRAY+"Endermen for "+ChatColor.GREEN+"4s",
                        ChatColor.DARK_GRAY+"Soulflow Cost: "+ChatColor.DARK_AQUA+"2",
                        ChatColor.DARK_GRAY+"Mana Cost: "+ChatColor.DARK_AQUA+"200",
                        ChatColor.DARK_GRAY+"Cooldown: "+ChatColor.GREEN+"4s",
                        "",
                        ""+ChatColor.BLUE+"Withered Bonus",
                        ChatColor.GRAY+"Grants "+ChatColor.GREEN+"+1 "+ChatColor.RED+"❁ Strength "+ChatColor.GRAY+"per",
                        ChatColor.RED+"Catacombs "+ChatColor.GRAY+"level.",
                        "",
                        ""+ChatColor.LIGHT_PURPLE+ChatColor.BOLD+ChatColor.MAGIC+"O"+ChatColor.RESET+ChatColor.LIGHT_PURPLE+ChatColor.BOLD+" MYTHIC SWORD "+ChatColor.MAGIC+"O"
                    )
                );
                meta = toNormalMeta(meta);
                meta.addEnchant(Enchantment.DAMAGE_ALL, 15, true);
                meta.addAttributeModifier(
                    Attribute.GENERIC_ATTACK_SPEED,
                    _maxed
                );
                item.setItemMeta(meta);
                player.getInventory().addItem(item);
            }
            if (args[0].equals("wand_of_atonement")){
                Player player = (Player) sender;
                ItemStack item = new ItemStack(Material.STICK);
                ItemMeta meta = item.getItemMeta();
                meta.setCustomModelData(3);
                meta.setDisplayName(
                    ChatColor.GOLD+"Wand of Atonement"
                );
                meta.setLore(
                    Arrays.asList(
                        ""+ChatColor.LIGHT_PURPLE+ChatColor.BOLD+"Ultimate Wise V",
                        ChatColor.GRAY+"Reduces the ability mana cost of",
                        ChatColor.GRAY+"this item by "+ChatColor.GREEN+"50%",
                        "",
                        ""+ChatColor.LIGHT_PURPLE+ChatColor.BOLD+"⦾"+ChatColor.RESET+ChatColor.GOLD+" Ability: Huge Heal  "+ChatColor.YELLOW+ChatColor.BOLD+"RIGHT CLICK",
                        ChatColor.GRAY+"Heal "+ChatColor.RED+"170♥"+ChatColor.GRAY+"/s for 7s.",
                        ChatColor.DARK_GRAY+"Wand Heals don't stack.",
                        ChatColor.GRAY+"Mana Cost: "+ChatColor.DARK_AQUA+"120",
                        ChatColor.DARK_GRAY+"Cooldown: "+ChatColor.GREEN+"1s",
                        "",
                        ""+ChatColor.GOLD+ChatColor.BOLD+"LEGENDARY WAND"
                    )
                );
                meta = toNormalMeta(meta);
                meta.addEnchant(Enchantment.DAMAGE_UNDEAD, 0, true);
                meta.addAttributeModifier(Attribute.GENERIC_ATTACK_SPEED, _maxed);
                item.setItemMeta(meta);
                player.getInventory().addItem(item);
            }
            if (args[0].equals("fire_veil_wand")){
                Player player = (Player) sender;
                ItemStack item = new ItemStack(Material.BLAZE_ROD);
                ItemMeta meta = item.getItemMeta();
                meta.setCustomModelData(4);
                meta.setDisplayName(
                    ChatColor.GOLD+"Fire Veil Wand"
                );
                meta.setLore(
                    Arrays.asList(
                        ChatColor.GRAY+"Damage: "+ChatColor.RED+"+50 ",
                        ChatColor.GRAY+"Intelligence: "+ChatColor.GREEN+"+200 ",
                        "",
                        ""+ChatColor.LIGHT_PURPLE+ChatColor.BOLD+"Ultimate Wise V",
                        "",
                        ""+ChatColor.AQUA+ChatColor.BOLD+"⦾"+ChatColor.RESET+ChatColor.GOLD+" Ability: Fire Veil  "+ChatColor.YELLOW+ChatColor.BOLD+"RIGHT CLICK",
                        ChatColor.GRAY+"Creates a veil of fire around",
                        ChatColor.GRAY+"you for "+ChatColor.GREEN+"5s"+ChatColor.GRAY+", "+ChatColor.GRAY+"dealing "+ChatColor.RED+"350,278",
                        ChatColor.GRAY+"damage per second to mobs",
                        ChatColor.GRAY+"within.",
                        ChatColor.DARK_GRAY+"Mana Cost: "+ChatColor.DARK_AQUA+"300",
                        ChatColor.DARK_GRAY+"Cooldown: "+ChatColor.GREEN+"1s",
                        "",
                        ""+ChatColor.GOLD+ChatColor.BOLD+ChatColor.MAGIC+"O"+ChatColor.RESET+ChatColor.GOLD+ChatColor.BOLD+" LEGENDARY WAND "+ChatColor.MAGIC+"O"
                    )
                );
                meta = toNormalMeta(meta);
                meta.addEnchant(Enchantment.DAMAGE_UNDEAD, 0, true);
                meta.addAttributeModifier(Attribute.GENERIC_ATTACK_SPEED, _maxed);
                item.setItemMeta(meta);
                player.getInventory().addItem(item);
            }
        }
        return true;
    }


    private ItemMeta toNormalMeta(ItemMeta meta){
        meta.addItemFlags(
            ItemFlag.HIDE_ARMOR_TRIM,
            ItemFlag.HIDE_ATTRIBUTES,
            ItemFlag.HIDE_DESTROYS,
            ItemFlag.HIDE_DYE,
            ItemFlag.HIDE_ENCHANTS,
            ItemFlag.HIDE_PLACED_ON,
            ItemFlag.HIDE_POTION_EFFECTS,
            ItemFlag.HIDE_UNBREAKABLE
        );
        meta.setUnbreakable(true);
        return meta;
    }
}
