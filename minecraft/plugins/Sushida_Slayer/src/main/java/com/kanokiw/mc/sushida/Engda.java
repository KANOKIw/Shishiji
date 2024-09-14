package com.kanokiw.mc.sushida;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Random;
import java.util.stream.Collectors;

import javax.annotation.Nullable;

import org.json.JSONArray;

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.entity.Player;
import org.bukkit.scheduler.BukkitRunnable;

import org.bukkit.entity.Entity;
import org.bukkit.entity.TextDisplay;
import org.bukkit.entity.Display.Billboard;
import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.boss.BarColor;
import org.bukkit.boss.BarStyle;
import org.bukkit.boss.BossBar;


public class Engda implements CommandExecutor, TabCompleter {
    final public static ChatColor $ccRED = ChatColor.RED;
    final public static ChatColor $ccBLUE = ChatColor.BLUE;
    final public static ChatColor $ccGREEN = ChatColor.GREEN;
    final public static ChatColor $ccYELLOW = ChatColor.YELLOW;
    final public static ChatColor $ccWHITE = ChatColor.WHITE;
    final public static ChatColor $ccLIGHT_PURPLE = ChatColor.LIGHT_PURPLE;
    final public static ChatColor $ccBOLD = ChatColor.BOLD;
    final public static ChatColor $ccRESET = ChatColor.RESET;

    final private static Random random = new Random();
    public static Map<String, Integer> playerGameMode = new HashMap<String, Integer>();
    public static Map<String, Integer> playerMaxSec = new HashMap<String, Integer>();
    public static Map<String, List<Integer>> playerCounts = new HashMap<String, List<Integer>>();
    public static List<String> players_ = new ArrayList<String>();
    public static List<String> players = new ArrayList<String>();
    public static List<String> onMulti = new ArrayList<String>();
    public static List<String> playerOnContinue = new ArrayList<String>();
    public static Map<String, MultiPlay> playerGroupMap = new HashMap<String, MultiPlay>();

    private static Map<String, String> playerSentence = new HashMap<String, String>();
    private static Map<String, String> playerFullSentence = new HashMap<String, String>();
    private static Map<String, BossBar> playerBossBarMap = new HashMap<String, BossBar>();
    private static Map<String, String> playerPrevArg = new HashMap<String, String>();
    private static Map<String, String> playerSubTitle = new HashMap<String, String>();
    private static Map<String, TextDisplay> playersTextDisplay_lower = new HashMap<String, TextDisplay>();
    private static Map<String, TextDisplay> playersTextDisplay_upper = new HashMap<String, TextDisplay>();
    public static List<String> sentences = new ArrayList<String>();
    final String limitedTitle = $ccRED+"Character limit reached!!";
    final String limitedSubTitle = $ccRED+"Pree Enter or ESC to continue";

    public Engda(){
        try {
            ClassLoader cl = Sushida.class.getClassLoader() ;
            InputStream is = cl.getResourceAsStream("sentences.json");
            BufferedReader txtReader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
            String jsonString =  txtReader.lines().collect(Collectors.joining());
            JSONArray jsonArray = new JSONArray(jsonString);
            for (int i = 0; i < jsonArray.length(); i++) {
                String element = jsonArray.getString(i);
                sentences.add(element);
            }
        } catch (UnsupportedEncodingException e){
            e.printStackTrace();
        }
    }


    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args){
        if (isPlaying(sender.getName())){
            Player player = (Player) sender;
            player.sendTitle($ccRED+""+$ccBOLD+"/_␣ で続行", null, 0, 800, 0);
            playerOnContinue.add(sender.getName());
        }
        return true;
    }

    
    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args){
        Player player = (Player) sender;
        List<String> _candidate = new ArrayList<String>();
        String name = sender.getName();
        String sentence = playerSentence.get(name);
        String prevArg = playerPrevArg.get(name);
        String letter; // Better to be Char...? length of 1 character will be contained(sender input)
        String title;
        String input = "";
        String lowerText;
        Integer d = 0;
        Integer correct = null;
        Integer miss = null;
        Integer pastSentences = null;
        boolean setup = false;
        List<Integer> counts = new ArrayList<Integer>();

        try {
            correct = playerCounts.get(name).get(0);
            miss = playerCounts.get(name).get(1);
            pastSentences = playerCounts.get(name).get(2);
        } catch (NullPointerException e){
            correct = 0;
            miss = 0;
            pastSentences = 0;
        }

        if (isPlaying(name) && !players_.contains(name) && !onMulti.contains(name)){
            startTyping(player);
            players_.add(name);
        }
        if (!players.contains(name)){
            return _candidate;
        }
        if (args.length > 0){
            for (final String _input : args){
                if (d == 0){
                    input = _input;
                } else {
                    input = input + " " + _input;
                }
                d++;
            } if (prevArg != null && input.length() == prevArg.length()){
                /*
                 * The limit of chat command character length
                 */
                player.sendTitle(limitedTitle, limitedSubTitle, 0, 800, 0);
                player.playSound(player, "block.note_block.banjo", 1F, 0.5F);
                return _candidate;
            }
            if (prevArg == null){
                letter = input;
                playerSubTitle.put(name, "");
            } else {
                letter = input.replace(prevArg, "");
            }

            final String _prevArg = input;
            playerPrevArg.remove(name);         // static(!this)
            playerPrevArg.put(name, _prevArg);  // static(!this)
            if (playerOnContinue.contains(name)){
                playerOnContinue.remove(name);
                String subTitle = ChatColor.GRAY + playerSubTitle.get(name);
                title = $ccGREEN + playerFullSentence.get(name)
                    .replace(sentence, "")
                    .replace(" ", $ccBOLD+"␣"+$ccRESET+$ccGREEN) + $ccWHITE + sentence;
                player.sendTitle(title, subTitle, 0, 800, 0);
                return _candidate;
            }
            if (prevArg != null && prevArg.length() > input.length()){
                return _candidate;
            }
            if (sentence == null){
                sentence = newSentence(name);
                player.playSound(player, "entity.player.levelup", 1F, 2F);
                setup = true;
            }

            final String requiredLetter = sentence.substring(0, 1);
            String subTitle = $ccWHITE + letter;

            if (!setup){
                if (letter.equals(requiredLetter)){
                    correct++;
                    player.playSound((Entity) player , "entity.experience_orb.pickup", 1F, 1.2F);
                    sentence = sentence.substring(1, sentence.length());
                    playerSentence.remove(name);
                    if (sentence.equals("")){
                        pastSentences++;
                        player.playSound((Entity) player , "entity.player.levelup", 1F, 2F);
                        sentence = newSentence(name);
                        subTitle = "";
                    } else {
                        playerSentence.put(name, sentence);
                        subTitle = ChatColor.GRAY + playerSubTitle.get(name).replace("§f", "") + $ccWHITE + letter;
                    }
                } else {
                    miss++;
                    player.playSound((Entity) player, "block.note_block.bass", 1F, 1F);
                    subTitle = playerSubTitle.get(name) + $ccWHITE + letter;
                }
            }
            String sent_c = playerFullSentence.get(name);
            playerSubTitle.remove(name);
            playerSubTitle.put(name, subTitle);
            counts.add(0, correct);
            counts.add(1, miss);
            counts.add(2, pastSentences);
            playerCounts.remove(name);
            playerCounts.put(name, counts);
            // $public variable defined at `this` constructor
            title = $ccGREEN + sent_c
                .substring(0, sent_c.length()-sentence.length())
                .replace(" ", $ccBOLD+"␣"+$ccRESET+$ccGREEN) + $ccWHITE + sentence;
            player.sendTitle(title, subTitle, 0, 800, 0);
            lowerText = $ccLIGHT_PURPLE+"score: "+pastSentences*240
                +$ccWHITE+" ("+$ccGREEN+""+$ccBOLD+"✓"+$ccRESET+""+$ccGREEN+correct+" "
                +$ccRED+"✗"+miss+$ccWHITE+")";
            TextDisplay text_display_lower = playersTextDisplay_lower.get(name);
            TextDisplay text_display_upper = playersTextDisplay_upper.get(name);
            if (text_display_lower != null && text_display_upper != null){
                text_display_lower.setText(lowerText);
                text_display_lower.teleport(player.getLocation().add(0, 2.4d, 0));
                text_display_upper.setText(title);
                text_display_upper.teleport(player.getLocation().add(0, 2.7d, 0));
            }
        }
        return _candidate;
    }

    /**
     * 
     * @param author
     *              Who gets a new sentence
     * @return
     *      The new sentence generated
     */
    public static String newSentence(final String author){
        final String sentence = sentences.get(random.nextInt(sentences.size()))
            .replace(";", ",")
            .replace(":", ",");
                playerSentence.remove(author);
                playerSentence.put(author, sentence);
                playerFullSentence.remove(author);
                playerFullSentence.put(author, sentence);
                playerSubTitle.put(author, "");
        return sentence;
    }


    private void startTyping(final Player player){
        final BossBar bossBar = Bukkit.createBossBar($ccGREEN+"残り時間", BarColor.GREEN, BarStyle.SOLID);
        final String _lowerText = $ccLIGHT_PURPLE+"score: 0"
            +$ccWHITE+" ("+$ccGREEN+""+$ccBOLD+"✓"+$ccRESET+""+$ccGREEN+"0 "
            +$ccRED+"✗0"+$ccWHITE+")";

        bossBar.setVisible(true);
        bossBar.addPlayer(player);
        playerBossBarMap.put(player.getName(), bossBar);
        player.sendTitle("3...", null, 0, 40, 0);
        player.playSound(player, "block.beacon.power_select", 1F, 1.5F);
        TextDisplay text_display_lower = player.getLocation()
            .getWorld()
            .spawn(
                player.getLocation().add(0, 2.4d, 0),
                TextDisplay.class
                );
        TextDisplay text_display_upper = player.getLocation()
            .getWorld()
            .spawn(
                player.getLocation().add(0, 2.7d, 0),
                TextDisplay.class
                );
        text_display_lower.setBillboard(Billboard.CENTER);
        text_display_lower.setText(_lowerText);
        text_display_upper.setBillboard(Billboard.CENTER);
        text_display_upper.setText($ccGREEN+"3...");
        playersTextDisplay_lower.put(player.getName(), text_display_lower);
        playersTextDisplay_upper.put(player.getName(), text_display_upper);

        new BukkitRunnable(){
            @Override
            public void run(){
                player.sendTitle("2...", null, 0, 40, 0);
                player.playSound(player, "block.beacon.power_select", 1F, 1.5F);
                try{
                    playersTextDisplay_upper.get(player.getName()).setText($ccGREEN+"2...");
                    playersTextDisplay_upper.get(player.getName()).teleport(player.getLocation().add(0, 2.7d, 0));
                    playersTextDisplay_lower.get(player.getName()).teleport(player.getLocation().add(0, 2.4d, 0));
                }catch(NullPointerException e){

                }
                this.cancel();
            }
        }.runTaskLater(Slayer.plugin, 40L);
        new BukkitRunnable(){
            @Override
            public void run(){
                player.sendTitle("1...", null, 0, 40, 0);
                player.playSound(player, "block.beacon.power_select", 1F, 1.5F);
                try{
                    playersTextDisplay_upper.get(player.getName()).setText($ccGREEN+"1...");
                    playersTextDisplay_upper.get(player.getName()).teleport(player.getLocation().add(0, 2.7d, 0));
                    playersTextDisplay_lower.get(player.getName()).teleport(player.getLocation().add(0, 2.4d, 0));
                }catch(NullPointerException e){

                }
                this.cancel();
            }
        }.runTaskLater(Slayer.plugin, 80L);
        new BukkitRunnable(){
            @Override
            public void run(){
                __playerInit__(player.getName(), true, false);
                players.add(player.getName());
                String sentence = newSentence(player.getName());
                player.sendTitle($ccWHITE+sentence, null, 0, 40, 0);
                player.playSound(player, "entity.player.levelup", 1F, 0.5F);
                TextDisplay text_display_lower = player.getLocation()
                    .getWorld()
                    .spawn(
                        player.getLocation(),
                        TextDisplay.class
                        );
                TextDisplay text_display_upper = player.getLocation()
                    .getWorld()
                    .spawn(
                        player.getLocation(),
                        TextDisplay.class
                        );
                text_display_lower.setBillboard(Billboard.CENTER);
                text_display_lower.setText(_lowerText);
                text_display_upper.setBillboard(Billboard.CENTER);
                text_display_upper.setText($ccWHITE+sentence);
                playersTextDisplay_lower.put(player.getName(), text_display_lower);
                playersTextDisplay_upper.put(player.getName(), text_display_upper);
                this.cancel();
            }
        }.runTaskLater(Slayer.plugin, 120L);
    }


    public static void _startTyping(final Player player){
        if (player == null) return;
        final BossBar bossBar = Bukkit.createBossBar($ccGREEN+"残り時間", BarColor.GREEN, BarStyle.SOLID);
        final String _lowerText = $ccLIGHT_PURPLE+"score: 0"
            +$ccWHITE+" ("+$ccGREEN+""+$ccBOLD+"✓"+$ccRESET+""+$ccGREEN+"0 "
            +$ccRED+"✗0"+$ccWHITE+")";

        bossBar.setVisible(true);
        onMulti.add(player.getName());
        bossBar.addPlayer(player);
        playerBossBarMap.put(player.getName(), bossBar);
        player.sendTitle($ccLIGHT_PURPLE+"リーダーがゲームを開始しました"+$ccGREEN+""+$ccBOLD+"/_␣ でプレイ", null, 0, 100, 0);
        player.playSound(player, "entity.wither.spawn", 0.5F, 1F);
        new BukkitRunnable(){
            @Override
            public void run(){
                player.sendTitle("4..."+$ccGREEN+" "+$ccBOLD+"/_␣ でプレイ", null, 0, 40, 0);
                player.playSound(player, "block.beacon.power_select", 1F, 1.5F);
                
                TextDisplay text_display_lower = player.getLocation()
                    .getWorld()
                    .spawn(
                        player.getLocation().add(0, 2.4d, 0),
                        TextDisplay.class
                        );
                TextDisplay text_display_upper = player.getLocation()
                    .getWorld()
                    .spawn(
                        player.getLocation().add(0, 2.7d, 0),
                        TextDisplay.class
                        );
                text_display_lower.setBillboard(Billboard.CENTER);
                text_display_lower.setText(_lowerText);
                text_display_upper.setBillboard(Billboard.CENTER);
                text_display_upper.setText($ccGREEN+"4...");
                playersTextDisplay_lower.put(player.getName(), text_display_lower);
                playersTextDisplay_upper.put(player.getName(), text_display_upper);
                this.cancel();
            }
        }.runTaskLater(Slayer.plugin, 100L);
        new BukkitRunnable(){
            @Override
            public void run(){
                player.sendTitle("3..."+$ccGREEN+" "+$ccBOLD+"/_␣ でプレイ", null, 0, 40, 0);
                player.playSound(player, "block.beacon.power_select", 1F, 1.5F);
                try{
                    playersTextDisplay_upper.get(player.getName()).setText($ccGREEN+"3...");
                    playersTextDisplay_upper.get(player.getName()).teleport(player.getLocation().add(0, 2.7d, 0));
                    playersTextDisplay_lower.get(player.getName()).teleport(player.getLocation().add(0, 2.4d, 0));
                }catch(NullPointerException e){

                }
                this.cancel();
            }
        }.runTaskLater(Slayer.plugin, 140L);
        new BukkitRunnable(){
            @Override
            public void run(){
                player.sendTitle("2..."+$ccGREEN+" "+$ccBOLD+"/_␣ でプレイ", null, 0, 40, 0);
                player.playSound(player, "block.beacon.power_select", 1F, 1.5F);
                try{
                    playersTextDisplay_upper.get(player.getName()).setText($ccGREEN+"2...");
                    playersTextDisplay_upper.get(player.getName()).teleport(player.getLocation().add(0, 2.7d, 0));
                    playersTextDisplay_lower.get(player.getName()).teleport(player.getLocation().add(0, 2.4d, 0));
                }catch(NullPointerException e){
                    
                }
                this.cancel();
            }
        }.runTaskLater(Slayer.plugin, 180L);
        new BukkitRunnable(){
            @Override
            public void run(){
                player.sendTitle("1..."+$ccGREEN+" "+$ccBOLD+"/_␣ でプレイ", null, 0, 40, 0);
                player.playSound(player, "block.beacon.power_select", 1F, 1.5F);
                try{
                    playersTextDisplay_upper.get(player.getName()).setText($ccGREEN+"1...");
                    playersTextDisplay_upper.get(player.getName()).teleport(player.getLocation().add(0, 2.7d, 0));
                    playersTextDisplay_lower.get(player.getName()).teleport(player.getLocation().add(0, 2.4d, 0));
                }catch(NullPointerException e){
                    
                }
                this.cancel();
            }
        }.runTaskLater(Slayer.plugin, 220L);
        new BukkitRunnable(){
            @Override
            public void run(){
                __playerInit__(player.getName(), true, false);
                players.add(player.getName());
                String sentence = newSentence(player.getName());
                player.sendTitle($ccWHITE+sentence, null, 0, 40, 0);
                player.playSound(player, "entity.player.levelup", 1F, 0.5F);

                TextDisplay text_display_lower = player.getLocation()
                    .getWorld()
                    .spawn(
                        player.getLocation(),
                        TextDisplay.class
                        );
                TextDisplay text_display_upper = player.getLocation()
                    .getWorld()
                    .spawn(
                        player.getLocation(),
                        TextDisplay.class
                        );
                text_display_lower.setBillboard(Billboard.CENTER);
                text_display_lower.setText(_lowerText);
                text_display_upper.setBillboard(Billboard.CENTER);
                text_display_upper.setText($ccWHITE+sentence);
                playersTextDisplay_lower.put(player.getName(), text_display_lower);
                playersTextDisplay_upper.put(player.getName(), text_display_upper);
                this.cancel();
            }
        }.runTaskLater(Slayer.plugin, 260L);
    }


    public static boolean isPlaying(final String name){
        return playerGameMode.get(name) != null;
    }


    @Nullable
    public static List<Integer> getCounts(final String name){
        List<Integer> counts = playerCounts.get(name);
        if (counts == null) counts = new ArrayList<Integer>(Arrays.asList(0, 0, 0));
        return counts;
    }


    public static void removeCd(){
        List<String> removable = new ArrayList<String>();
        for (String name : playerGameMode.keySet()){
            Integer count = playerGameMode.get(name);
            Integer max = playerMaxSec.get(name);
            if (count == -1 || !players.contains(name)){
                // For the immovable infinite player
                continue;
            }
            count--;
            double prog = Float.valueOf(count)/Float.valueOf(max);
            if (prog < 0.0d){
                prog = 0.0d;
            }
            BossBar bossBar = playerBossBarMap.get(name);
            bossBar.setProgress(prog);
            // Game ends
            TextDisplay text_display_lower = playersTextDisplay_lower.get(name);
            TextDisplay text_display_upper = playersTextDisplay_upper.get(name);
            Player player_ = Slayer.plugin.getServer().getPlayer(name);
            if (text_display_lower != null && text_display_upper != null && player_ != null){
                text_display_lower.teleport(player_.getLocation().add(0, 2.4d, 0));
                text_display_upper.teleport(player_.getLocation().add(0, 2.7d, 0));
            }
            if (count <= -1){
                Player player = Slayer.plugin.getServer().getPlayer(name);
                List<Integer> _counts = getCounts(name);
                MultiPlay group = playerGroupMap.get(name);
                if (player == null){
                    // When player is offline
                    continue;
                }
                player.playSound(player, "entity.wither.death", 0.5F, 1F);
                player.sendTitle(
                    $ccLIGHT_PURPLE+"Finish!!",
                    $ccGREEN+"Score: "+_counts.get(2)*240,
                    0,
                    200,
                    20
                );
                String result = $ccWHITE+"("+$ccGREEN+""+$ccBOLD
                    +"✓"+$ccRESET+""+$ccGREEN+_counts.get(0)+" "
                    +$ccRED+"✗"+_counts.get(1)+$ccWHITE+")";
                player.sendMessage(Sushida.$ccGREEN+"Score: "+_counts.get(2)*120+", "+result);
                if (group != null && !group.resultSent){
                    group.sendResult();
                    group.resultSent = true;
                }
                removable.add(name);
                __playerInit__(name, false, false);
                continue;
            }
            playerGameMode.put(name, count);
        }
        for (String str : removable){
            Sushida.playerGameMode.remove(str);
        }
    }


    public static void __playerInit__(final String name, boolean starter, boolean removeGameMode){
        BossBar bossBar = playerBossBarMap.get(name);
        if (!starter) {
            onMulti.remove(name);
            players_.remove(name);
            players.remove(name);
            playerMaxSec.remove(name);
            playerBossBarMap.remove(name);
            playerGroupMap.remove(name);
            try{
                bossBar.removeAll();
            }catch(NullPointerException e){
                
            }
        }
        if (removeGameMode){
            playerGameMode.remove(name);
        }
        TextDisplay text_display_lower = playersTextDisplay_lower.get(name);
        TextDisplay text_display_upper = playersTextDisplay_upper.get(name);
        if (text_display_lower != null && text_display_upper != null){
            text_display_lower.remove();
            text_display_upper.remove();
        }
        playersTextDisplay_lower.remove(name);
        playersTextDisplay_upper.remove(name);
        playerPrevArg.remove(name);
        playerCounts.remove(name);
        playerOnContinue.remove(name);
        playerSentence.remove(name);
        playerFullSentence.remove(name);
        playerSubTitle.remove(name);
    }
}
