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

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.entity.Player;
import org.bukkit.scheduler.BukkitRunnable;
import org.json.JSONArray;
import org.bukkit.entity.Entity;
import org.bukkit.entity.TextDisplay;
import org.bukkit.entity.Display.Billboard;
import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.boss.BarColor;
import org.bukkit.boss.BarStyle;
import org.bukkit.boss.BossBar;


public class Sushida implements CommandExecutor, TabCompleter {
    final public static ChatColor $ccRED = ChatColor.RED;
    final public static ChatColor $ccBLUE = ChatColor.BLUE;
    final public static ChatColor $ccGREEN = ChatColor.GREEN;
    final public static ChatColor $ccYELLOW = ChatColor.YELLOW;
    final public static ChatColor $ccGOLD = ChatColor.GOLD;
    final public static ChatColor $ccWHITE = ChatColor.WHITE;
    final public static ChatColor $ccLIGHT_PURPLE = ChatColor.LIGHT_PURPLE;
    final public static ChatColor $ccAQUA = ChatColor.AQUA;
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
    private static Map<String, BossBar> playerConsecutivelyBossBarMap = new HashMap<String, BossBar>();
    private static Map<String, Integer> playerConsective = new HashMap<String, Integer>();
    private static Map<String, String> playerPrevArg = new HashMap<String, String>();
    private static Map<String, String> playerSubTitle = new HashMap<String, String>();
    private static Map<String, List<String>> letterCandidateListMap = new HashMap<String, List<String>>();
    private static Map<String, List<String>> optional_1letterCondadate = new HashMap<String, List<String>>();
    private static Map<String, String> currentInputFar = new HashMap<String, String>();
    private static Map<String, String> isOnR = new HashMap<String, String>();
    private static Map<String, String> isOnSmalltu = new HashMap<String, String>();
    private static Map<String, List<String>> isOnSmalltuReqs = new HashMap<String, List<String>>();
    private static Map<String, String> nextCanBeN = new HashMap<String, String>();
    private static Map<String, TextDisplay> playersTextDisplay_lower = new HashMap<String, TextDisplay>();
    private static Map<String, TextDisplay> playersTextDisplay_upper = new HashMap<String, TextDisplay>();
    public static List<String> sentences = new ArrayList<String>();
    final String sentencePath = "./Sushida/sushis.json";
    final String limitedTitle = $ccRED+"\u6587\u5B57\u6570\u306E\u4E0A\u9650\u306B\u9054\u3057\u307E\u3057\u305F\uFF01";
    final String limitedSubTitle = $ccRED+"Enter \u304B ESC \u3092\u304A\u3057\u3066\u3082\u3046\u4E00\u5EA6\u958B\u304F";


    public Sushida(){
        try {
            ClassLoader cl = Sushida.class.getClassLoader() ;
            InputStream is = cl.getResourceAsStream("sushis.json");
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
            player.sendTitle($ccRED+""+$ccBOLD+"/.\u2423 \u3067\u7D9A\u884C", null, 0, 800, 0);
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
        String letter; // Better to be Char...? length of 1 character will be contained(sender's input)
        String title;
        String input = "";
        String lowerText;
        String _currentSentInput = currentInputFar.get(name);
        Integer d = 0;
        Integer correct = null;
        Integer miss = null;
        Integer pastSentences = null;
        Integer consec = playerConsective.get(name);
        boolean setup = false;
        boolean del2 = false;
        boolean delNext = false;
        boolean skipSpan = false;
        boolean smallTuDelt = false;
        boolean pot = false;
        List<Integer> counts = new ArrayList<Integer>();
        List<String> smalls = new ArrayList<String>(Arrays.asList(
            "ゃ",
            "ゅ",
            "ょ",
            "ぁ",
            "ぃ",
            "ぅ",
            "ぇ",
            "ぉ"
        ));
        BossBar consective = playerConsecutivelyBossBarMap.get(name);

        if (_currentSentInput == null){
            _currentSentInput = "";
        } if (consec == null){
            consec = 0;
        }
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
            } if (input.length() > 245){
                sender.sendMessage($ccYELLOW+"そろそろ文字数制限です！");
                player.playSound(player, "block.anvil.land", 0.5F, 2F);
            }
            if (prevArg == null){
                letter = input;
                playerSubTitle.put(name, "");
            } else {
                letter = input.replace(prevArg, "");
            }

            final String _prevArg = input;

            playerPrevArg.remove(name);
            playerPrevArg.put(name, _prevArg);
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
                final TextDisplay _text_display_lower = playersTextDisplay_lower.get(name);
                final TextDisplay _text_display_upper = playersTextDisplay_upper.get(name);
                String _lowerText = $ccLIGHT_PURPLE+"score: 0"
                    +$ccWHITE+" ("+$ccGREEN+""+$ccBOLD+"✓"+$ccRESET+""+$ccGREEN+"0 "
                    +$ccRED+"✗0"+$ccWHITE+")";
                sentence = newSentence(name);
                player.playSound(player, "entity.player.levelup", 1F, 2F);
                setup = true;
                if (_text_display_lower != null && _text_display_upper != null){
                    _text_display_lower
                        .setText($ccWHITE+sentence);
                    _text_display_lower
                        .teleport(player.getLocation().add(0, 2.4d, 0));
                    _text_display_upper
                        .setText(_lowerText);
                    _text_display_upper
                        .teleport(player.getLocation().add(0, 2.7d, 0));
                }
            }

            List<String> requiredLetterL = letterCandidateListMap.get(name);
            String subTitle = $ccWHITE + letter;
            List<String> saveReqL = new ArrayList<String>();
            List<String> __requiredLetterL = new ArrayList<String>();
            List<String> optinonal_saveReqL = null;
            List<String> requiredLetterL_ = null;
            List<String> _saveReqL = new ArrayList<String>();
            List<String> requiredLetter = new ArrayList<String>();

            if (requiredLetterL == null || requiredLetterL.size() == 0){
                List<String> optional_smallpast = optional_1letterCondadate.get(name);
                if (optional_smallpast != null && optional_smallpast.contains(_currentSentInput)){
                    _currentSentInput = "";
                    requiredLetterL_ = optional_smallpast;
                    optional_1letterCondadate.remove(name);
                    delNext = true;
                }
                String _mo = sentence.substring(0, 1);
                try {
                    if (smalls.contains(sentence.substring(1, 2))){
                        isOnR.remove(name);
                        isOnR.put(name, "yes");
                        optinonal_saveReqL = getRome(_mo);
                        _mo = _mo + sentence.substring(1, 2);
                        optional_1letterCondadate.remove(name);
                        optional_1letterCondadate.put(name, optinonal_saveReqL);
                    }
                } catch (IndexOutOfBoundsException e){
                    
                }
                if (sentence.substring(0, 1).equals("っ")){
                    try{
                        if (smalls.contains(sentence.substring(2, 3))){
                            String _m_o = sentence.substring(1, 2);
                            isOnR.remove(name);
                            isOnR.put(name, "yes");
                            optinonal_saveReqL = getRome(_m_o);
                            optional_1letterCondadate.remove(name);
                            optional_1letterCondadate.put(name, optinonal_saveReqL);
                            isOnSmalltu.put(name, "oh"); 
                            __requiredLetterL = getRome(sentence.substring(1, 3));
                        } else {
                            isOnSmalltu.put(name, "yes");
                            __requiredLetterL = getRome(sentence.substring(1, 2));
                        }
                        isOnSmalltuReqs.put(name, Arrays.asList("ltu", "xtu"));
                    } catch (IndexOutOfBoundsException e){
                        isOnSmalltu.put(name, "yes");
                        __requiredLetterL = getRome(sentence.substring(1, 2));
                    }
                    requiredLetterL = new ArrayList<String>();
                    for (String lo : __requiredLetterL){
                        requiredLetterL.add(lo.substring(0, 1) + lo);
                    }
                    requiredLetterL.add("ltu***");
                    requiredLetterL.add("xtu***");
                    requiredLetterL.add("ltsu***");
                    requiredLetterL.add("xtsu***");
                } else if (sentence.substring(0, 1).equals("ー")){
                    requiredLetterL = Arrays.asList("-");
                } else {
                    requiredLetterL = getRome(_mo);
                    if (optinonal_saveReqL != null){
                        for (String a : requiredLetterL){
                            _saveReqL.add(a);
                        } for (String b : optinonal_saveReqL){
                            _saveReqL.add(b);
                        }
                        requiredLetterL = _saveReqL;
                    }
                }
                if (sentence.length() == 1 && _mo.equals("ん")){
                    requiredLetterL = Arrays.asList("nn");
                } else if (_mo.equals("ん") && nextCanBeN.get(name) == null){
                    // awaited null
                    nextCanBeN.put(name, "yes");
                }
            }
            for (String rel : requiredLetterL){
                requiredLetter.add(rel.substring(0, 1));
            }
            if (delNext){
                requiredLetter = requiredLetterL_;
            }

            if (!setup){
                if (requiredLetter.contains(letter) || (nextCanBeN.get(name) != null && letter.equals("n"))){
                    if (!requiredLetter.contains(letter) && letter.equals("n") && nextCanBeN.get(name) != null){
                        nextCanBeN.remove(name);
                        skipSpan = true;
                    }
                    correct++;
                    consec++;
                    _currentSentInput = _currentSentInput + letter;
                    List<String> optional_smallpast_ = optional_1letterCondadate.get(name);
                    for (String reql : requiredLetterL){
                        if (reql.startsWith(letter)){
                            String nl = reql.substring(1, reql.length());
                            if (nl.equals("")){
                                saveReqL = getRome(sentence.substring(1, sentence.length()));
                                delNext = true;
                                break;
                            }
                            saveReqL.add(reql.substring(1, reql.length()));
                        }
                    }
                    for (String h : saveReqL){
                        if (h.equals("***")){
                            smallTuDelt = true;
                            saveReqL = getRome(sentence.substring(0, 1));
                            isOnR.remove(name);
                            isOnSmalltu.remove(name);
                            isOnSmalltuReqs.remove(name);
                            delNext = false;
                            del2 = false;
                        } else if (h.contains("***")){
                            pot = true;
                        }   
                    }
                    if ((saveReqL.size() == 0 || delNext) && !skipSpan){
                        saveReqL = null;
                        try{
                            if (smalls.contains(sentence.substring(1, 2)) && !smallTuDelt){
                                del2 = true;
                            }   
                        } catch (IndexOutOfBoundsException e){
                            
                        }
                        try {
                            if (optional_smallpast_ != null && optional_smallpast_.contains(_currentSentInput)){
                                if (isOnSmalltu.get(name) != null && isOnSmalltu.get(name).equals("oh") && !smallTuDelt){
                                    isOnSmalltu.remove(name);
                                }
                                optional_1letterCondadate.remove(name);
                                letterCandidateListMap.remove(name);
                                letterCandidateListMap.put(name, getRome(sentence.substring(1, 2)));
                                del2 = false;
                            }
                        } catch (IndexOutOfBoundsException e){

                        }
                        _currentSentInput = "";
                        sentence = sentence.substring(1, sentence.length());
                    }
                    if (del2 || (isOnSmalltu.get(name) != null && !smallTuDelt && !pot)){
                        _currentSentInput = "";
                        if (isOnSmalltu.get(name) != null && isOnSmalltu.get(name).equals("oh")){
                            try{
                                sentence = sentence.substring(1, sentence.length());
                            } catch (IndexOutOfBoundsException e){

                            }
                        }
                        sentence = sentence.substring(1, sentence.length());
                        isOnSmalltu.remove(name);
                    }
                    letterCandidateListMap.remove(name);
                    letterCandidateListMap.put(name, saveReqL);
                    //player.playSound((Entity) player , "block.candle.break", 1F, 0.5F); botu!
                    player.playSound((Entity) player , "entity.experience_orb.pickup", 1F, 1.2F);
                    playerSentence.remove(name);
                    if (sentence.equals("")){
                        pastSentences++;
                        player.playSound((Entity) player , "entity.player.levelup", 1F, 2F);
                        sentence = newSentence(name);
                        subTitle = "";
                        letterCandidateListMap.remove(name);
                        isOnSmalltu.remove(name);
                    } else {
                        playerSentence.put(name, sentence);
                        subTitle = ChatColor.GRAY + playerSubTitle.get(name).replace("§f", "") + $ccWHITE + letter;
                    }
                } else {
                    miss++;
                    consec = 0;
                    player.playSound((Entity) player, "block.note_block.bass", 1F, 1F);
                    subTitle = playerSubTitle.get(name) + $ccWHITE + letter;
                }
            }
            String sent_c = playerFullSentence.get(name);
            double prog = Float.valueOf(consec)/Float.valueOf(50);

            if (prog >= 1 && playerGroupMap.get(name) == null){
                Integer count = playerGameMode.get(name);
                count += 5;
                player.playSound(player, "block.beacon.activate", 1, 2);
                player.sendMessage($ccGREEN+"+5s");
                prog = 0.0d;
                consec = 0;
                playerGameMode.remove(name);
                playerGameMode.put(name, count);
            }
            if (consective != null){
                consective.setProgress(prog);
            }
            playerConsective.remove(name);
            playerConsective.put(name, consec);
            playerSubTitle.remove(name);
            playerSubTitle.put(name, subTitle);
            counts.add(0, correct);
            counts.add(1, miss);
            counts.add(2, pastSentences);
            playerCounts.remove(name);
            playerCounts.put(name, counts);
            currentInputFar.remove(name);
            currentInputFar.put(name, _currentSentInput);
            // $public variable defined at `this` constructor
            title = $ccGREEN + sent_c
                .substring(0, sent_c.length()-sentence.length())
                .replace(" ", $ccBOLD+"␣"+$ccRESET+$ccGREEN) + $ccWHITE + sentence;
            player.sendTitle(title, subTitle, 0, 800, 0);
            lowerText = $ccLIGHT_PURPLE+"score: "+pastSentences*120
                +$ccWHITE+" ("+$ccGREEN+""+$ccBOLD+"✓"+$ccRESET+""+$ccGREEN+correct+" "
                +$ccRED+"✗"+miss+$ccWHITE+")";
            final TextDisplay text_display_lower = playersTextDisplay_lower.get(name);
            final TextDisplay text_display_upper = playersTextDisplay_upper.get(name);
            if (text_display_lower != null && text_display_upper != null){
                text_display_lower
                    .setText(lowerText);
                text_display_lower
                    .teleport(player.getLocation().add(0, 2.4d, 0));
                text_display_upper
                    .setText(title);
                text_display_upper
                    .teleport(player.getLocation().add(0, 2.7d, 0));
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
        final BossBar consecutive = Bukkit.createBossBar($ccGOLD+"連打メーター", BarColor.RED, BarStyle.SEGMENTED_20);
        final String _lowerText = $ccLIGHT_PURPLE+"score: 0"
            +$ccWHITE+" ("+$ccGREEN+""+$ccBOLD+"✓"+$ccRESET+""+$ccGREEN+"0 "
            +$ccRED+"✗0"+$ccWHITE+")";

        bossBar.setVisible(true);
        bossBar.addPlayer(player);
        consecutive.setVisible(true);
        consecutive.addPlayer(player);
        consecutive.setProgress(0.0d);
        playerBossBarMap.put(player.getName(), bossBar);
        playerConsecutivelyBossBarMap.put(player.getName(), consecutive);
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
                player.sendTitle($ccWHITE+sentence, null, 0, 800, 0);
                player.playSound(player, "entity.player.levelup", 1F, 0.5F);

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
        player.sendTitle($ccLIGHT_PURPLE+"リーダーが寿司打を開始しました"+$ccGREEN+" "+$ccBOLD+"/.␣ でプレイ", null, 0, 100, 0);
        player.playSound(player, "entity.wither.spawn", 0.5F, 1F);

        new BukkitRunnable(){
            @Override
            public void run(){
                player.sendTitle("4..."+$ccGREEN+" "+$ccBOLD+"/.␣ でプレイ", null, 0, 40, 0);
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
                player.sendTitle("3..."+$ccGREEN+" "+$ccBOLD+"/.␣ でプレイ", null, 0, 40, 0);
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
                player.sendTitle("2..."+$ccGREEN+" "+$ccBOLD+"/.␣ でプレイ", null, 0, 40, 0);
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
                player.sendTitle("1..."+$ccGREEN+" "+$ccBOLD+"/.␣ でプレイ", null, 0, 40, 0);
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
                player.sendTitle($ccWHITE+sentence, null, 0, 800, 0);
                player.playSound(player, "entity.player.levelup", 1F, 0.5F);

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
            } else if (prog > 1.0d){
                prog = 1.0d;
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
                    $ccGREEN+"Score: "+_counts.get(2)*120,
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
        BossBar consective = playerConsecutivelyBossBarMap.get(name);

        if (!starter) {
            onMulti.remove(name);
            players_.remove(name);
            players.remove(name);
            playerMaxSec.remove(name);
            playerBossBarMap.remove(name);
            playerGroupMap.remove(name);
            try{
                bossBar.removeAll();
                consective.removeAll();
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
        isOnSmalltuReqs.remove(name);
        isOnSmalltu.remove(name);
        letterCandidateListMap.remove(name);
        optional_1letterCondadate.remove(name);
        currentInputFar.remove(name);
        isOnR.remove(name);
        isOnSmalltu.remove(name);
        nextCanBeN.remove(name);
        playersTextDisplay_lower.remove(name);
        playersTextDisplay_upper.remove(name);
        playerPrevArg.remove(name);
        playerCounts.remove(name);
        playerOnContinue.remove(name);
        playerSentence.remove(name);
        playerFullSentence.remove(name);
        playerSubTitle.remove(name);
    }


    public static List<String> getRome(String hira){
        List<String> l = new ArrayList<String>();

        if (hira.equals("あ")){
            l.add("a");
        } else if (hira.equals("い")){
            l.add("i");
        } else if (hira.equals("う")){
            l.add("u");
        } else if (hira.equals("え")){
            l.add("e");
        } else if (hira.equals("お")){
            l.add("o");
        } else if (hira.equals("か")){
            l.add("ka");
            l.add("ca");
        } else if (hira.equals("き")){
            l.add("ki");
        } else if (hira.equals("く")){
            l.add("ku");
            l.add("cu");
        } else if (hira.equals("け")){
            l.add("ke");
        } else if (hira.equals("こ")){
            l.add("ko");
            l.add("co");
        } else if (hira.equals("さ")){
            l.add("sa");
        } else if (hira.equals("し")){
            l.add("si");
            l.add("shi");
            l.add("ci");
        } else if (hira.equals("す")){
            l.add("su");
        } else if (hira.equals("せ")){
            l.add("se");
            l.add("ce");
        } else if (hira.equals("そ")){
            l.add("so");
        } else if (hira.equals("た")){
            l.add("ta");
        } else if (hira.equals("ち")){
            l.add("chi");
            l.add("ti");
        } else if (hira.equals("つ")){
            l.add("tu");
            l.add("tsu");
        } else if (hira.equals("て")){
            l.add("te");
        } else if (hira.equals("と")){
            l.add("to");
        } else if (hira.equals("な")){
            l.add("na");
        } else if (hira.equals("に")){
            l.add("ni");
        } else if (hira.equals("ぬ")){
            l.add("nu");
        } else if (hira.equals("ね")){
            l.add("ne");
        } else if (hira.equals("の")){
            l.add("no");
        } else if (hira.equals("は")){
            l.add("ha");
        } else if (hira.equals("ひ")){
            l.add("hi");
        } else if (hira.equals("ふ")){
            l.add("hu");
            l.add("fu");
        } else if (hira.equals("へ")){
            l.add("he");
        } else if (hira.equals("ほ")){
            l.add("ho");
        } else if (hira.equals("ま")){
            l.add("ma");
        } else if (hira.equals("み")){
            l.add("mi");
        } else if (hira.equals("む")){
            l.add("mu");
        } else if (hira.equals("め")){
            l.add("me");
        } else if (hira.equals("も")){
            l.add("mo");
        } else if (hira.equals("や")){
            l.add("ya");
        } else if (hira.equals("ゆ")){
            l.add("yu");
        } else if (hira.equals("よ")){
            l.add("yo");
        } else if (hira.equals("ら")){
            l.add("ra");
        } else if (hira.equals("り")){
            l.add("ri");
        } else if (hira.equals("る")){
            l.add("ru");
        } else if (hira.equals("れ")){
            l.add("re");
        } else if (hira.equals("ろ")){
            l.add("ro");
        } else if (hira.equals("わ")){
            l.add("wa");
        } else if (hira.equals("を")){
            l.add("wo");
        } else if (hira.equals("ん")){
            l.add("n");
        } else if (hira.equals("きゃ")){
            l.add("kya");
        } else if (hira.equals("きぃ")){
            l.add("kyi");
        } else if (hira.equals("きゅ")){
            l.add("kyu");
        } else if (hira.equals("きぇ")){
            l.add("kye");
        } else if (hira.equals("きょ")){
            l.add("kyo");
        } else if (hira.equals("しゃ")){
            l.add("sya");
            l.add("sha");
        } else if (hira.equals("しぃ")){
            l.add("syi");
        } else if (hira.equals("しゅ")){
            l.add("syu");
            l.add("shu");
        } else if (hira.equals("しぇ")){
            l.add("sye");
        } else if (hira.equals("しょ")){
            l.add("syo");
            l.add("sho");
        } else if (hira.equals("ちゃ")){
            l.add("tya");
            l.add("cya");
            l.add("cha");
        } else if (hira.equals("ちぃ")){
            l.add("tyi");
            l.add("cyi");
        } else if (hira.equals("ちゅ")){
            l.add("tyu");
            l.add("cyu");
            l.add("chu");
        } else if (hira.equals("ちぇ")){
            l.add("tye");
            l.add("cye");
            l.add("che");
        } else if (hira.equals("ちょ")){
            l.add("tyo");
            l.add("cyo");
            l.add("cho");
        } else if (hira.equals("にゃ")){
            l.add("nya");
        } else if (hira.equals("にぃ")){
            l.add("nyi");
        } else if (hira.equals("にゅ")){
            l.add("nyu");
        } else if (hira.equals("にぇ")){
            l.add("nye");
        } else if (hira.equals("にょ")){
            l.add("nyo");
        } else if (hira.equals("ひゃ")){
            l.add("hya");
        } else if (hira.equals("ひぃ")){
            l.add("hyi");
        } else if (hira.equals("ひゅ")){
            l.add("hyu");
        } else if (hira.equals("ひぇ")){
            l.add("hye");
        } else if (hira.equals("ひょ")){
            l.add("hyo");
        } else if (hira.equals("みゃ")){
            l.add("mya");
        } else if (hira.equals("みぃ")){
            l.add("myi");
        } else if (hira.equals("みゅ")){
            l.add("myu");
        } else if (hira.equals("みぇ")){
            l.add("mye");
        } else if (hira.equals("みょ")){
            l.add("myo");
        } else if (hira.equals("ぁ")){
            l.add("la");
            l.add("xa");
        } else if (hira.equals("ぃ")){
            l.add("li");
            l.add("xi");
        } else if (hira.equals("ぅ")){
            l.add("lu");
            l.add("xu");
        } else if (hira.equals("ぇ")){
            l.add("le");
            l.add("xe");
        } else if (hira.equals("ぉ")){
            l.add("lo");
            l.add("xo");
        } else if (hira.equals("ゃ")){
            l.add("lya");
            l.add("xya");
        } else if (hira.equals("ゅ")){
            l.add("lyu");
            l.add("xyu");
        } else if (hira.equals("ょ")){
            l.add("lyo");
            l.add("xyo");
        } else if (hira.equals("ふぁ")){
            l.add("fa");
        } else if (hira.equals("ふぃ")){
            l.add("fi");
        } else if (hira.equals("ふぇ")){
            l.add("fe");
        } else if (hira.equals("ふぉ")){
            l.add("fo");
        } else if (hira.equals("が")){
            l.add("ga");
        } else if (hira.equals("ぎ")){
            l.add("gi");
        } else if (hira.equals("ぐ")){
            l.add("gu");
        } else if (hira.equals("げ")){
            l.add("ge");
        } else if (hira.equals("ご")){
            l.add("go");
        } else if (hira.equals("ざ")){
            l.add("za");
        } else if (hira.equals("じ")){
            l.add("zi");
            l.add("ji");
        } else if (hira.equals("ず")){
            l.add("zu");
        } else if (hira.equals("ぜ")){
            l.add("ze");
        } else if (hira.equals("ぞ")){
            l.add("zo");
        } else if (hira.equals("だ")){
            l.add("da");
        } else if (hira.equals("ぢ")){
            l.add("di");
        } else if (hira.equals("づ")){
            l.add("du");
        } else if (hira.equals("で")){
            l.add("de");
        } else if (hira.equals("ど")){
            l.add("do");
        } else if (hira.equals("ば")){
            l.add("ba");
        } else if (hira.equals("び")){
            l.add("bi");
        } else if (hira.equals("ぶ")){
            l.add("bu");
        } else if (hira.equals("べ")){
            l.add("be");
        } else if (hira.equals("ぼ")){
            l.add("bo");
        } else if (hira.equals("ぱ")){
            l.add("pa");
        } else if (hira.equals("ぴ")){
            l.add("pi");
        } else if (hira.equals("ぷ")){
            l.add("pu");
        } else if (hira.equals("ぺ")){
            l.add("pe");
        } else if (hira.equals("ぽ")){
            l.add("po");
        } else if (hira.equals("ぎゃ")){
            l.add("gya");
        } else if (hira.equals("ぎぃ")){
            l.add("gyi");
        } else if (hira.equals("ぎゅ")){
            l.add("gyu");
        } else if (hira.equals("ぎぇ")){
            l.add("gye");
        } else if (hira.equals("ぎょ")){
            l.add("gyo");
        } else if (hira.equals("じゃ")){
            l.add("zya");
            l.add("ja");
        } else if (hira.equals("じぃ")){
            l.add("zyi");
        } else if (hira.equals("じゅ")){
            l.add("zyu");
            l.add("ju");
        } else if (hira.equals("じぇ")){
            l.add("zye");
            l.add("je");
        } else if (hira.equals("じょ")){
            l.add("zyo");
            l.add("jo");
        } else if (hira.equals("ぢゃ")){
            l.add("dya");
        } else if (hira.equals("ぢぃ")){
            l.add("dyi");
        } else if (hira.equals("ぢゅ")){
            l.add("dyu");
        } else if (hira.equals("ぢぇ")){
            l.add("dye");
        } else if (hira.equals("ぢょ")){
            l.add("dyo");
        } else if (hira.equals("びゃ")){
            l.add("bya");
        } else if (hira.equals("びぃ")){
            l.add("byi");
        } else if (hira.equals("びゅ")){
            l.add("byu");
        } else if (hira.equals("びぇ")){
            l.add("bye");
        } else if (hira.equals("びょ")){
            l.add("byo");
        } else if (hira.equals("りゃ")){
            l.add("rya");
        } else if (hira.equals("りぃ")){
            l.add("ryi");
        } else if (hira.equals("りゅ")){
            l.add("ryu");
        } else if (hira.equals("りぇ")){
            l.add("rye");
        } else if (hira.equals("りょ")){
            l.add("ryo");
        } else if (hira.equals("ぴゃ")){
            l.add("pya");
        } else if (hira.equals("ぴゅ")){
            l.add("pyu");
        } else if (hira.equals("ぴょ")){
            l.add("pyo");
        } else if (hira.equals("でぃ")){
            l.add("dhi");
        } else if (hira.equals("でぇ")){
            l.add("dhe");
        } else if (hira.equals("てぃ")){
            l.add("thi");
        } else if (hira.equals("てぇ")){
            l.add("the");
        } else if (hira.equals("うぃ")){
            l.add("wi");
        } else if (hira.equals("うぇ")){
            l.add("we");
        } else if (hira.equals("！")){
            l.add("!");
        } else if (hira.equals("？")){
            l.add("?");
        } else if (hira.equals("、")){
            l.add(",");
        } else if (hira.equals("。")){
            l.add(".");
        }
        return l;
    }
}
