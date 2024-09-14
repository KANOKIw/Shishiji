package com.kanokiw.mc.sushida;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.entity.Player;
import org.json.JSONArray;

import org.bukkit.ChatColor;


public class Start implements CommandExecutor, TabCompleter {
    private List<String> __sessions__ = new ArrayList<String>();

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args){
        Player player = (Player) sender;
        Integer playSec = 120;
        if (args.length < 1){
            sender.sendMessage(ChatColor.RED+"使用方法: /sushida start <number/\"infinity\">");
            return true;
        }
        
        if (args.length > 4){
            if (__sessions__.contains(args[3])){
                sender.sendMessage(ChatColor.RED+"無効なセッションです！");
                return true;
            }
            playSec = 180;
            if (args[0].equals("with") && args[1].equals("all") && args[2].equals("eng")){
                List<String> members = new ArrayList<String>();
                __sessions__.add(args[3]);
                for (String _name : args){
                    if (_name.equals("with") || _name.equals("all") ||  _name.equals(args[2]) || _name.equals(args[3])){
                        continue;
                    }
                    members.add(_name);
                }
                MultiPlay group = new MultiPlay(members);
                for (String _name : args){
                    if (_name.equals("with") || _name.equals("all") ||  _name.equals(args[2]) || _name.equals(args[3])){
                        continue;
                    }
                    Engda.__playerInit__(_name, false, true);
                    Sushida.__playerInit__(_name, false, true);
                    Engda.playerGameMode.put(_name, playSec);
                    Engda.playerMaxSec.put(_name, playSec);
                    Engda.playerGroupMap.put(_name, group); // multiplay
                    Engda._startTyping(Slayer.plugin.getServer().getPlayer(_name));
                }
            } else if (args[0].equals("with") && args[1].equals("all") && args[2].equals("rome")){
                List<String> members = new ArrayList<String>();
                __sessions__.add(args[3]);
                for (String _name : args){
                    if (_name.equals("with") || _name.equals("all") ||  _name.equals(args[2]) || _name.equals(args[3])){
                        continue;
                    }
                    members.add(_name);
                }
                MultiPlay group = new MultiPlay(members);
                for (String _name : args){
                    if (_name.equals("with") || _name.equals("all") ||  _name.equals(args[2]) || _name.equals(args[3])){
                        continue;
                    }
                    Engda.__playerInit__(_name, false, true);
                    Sushida.__playerInit__(_name, false, true);
                    Sushida.playerGameMode.put(_name, playSec);
                    Sushida.playerMaxSec.put(_name, playSec);
                    Sushida.playerGroupMap.put(_name, group); // multiplay
                    Sushida._startTyping(Slayer.plugin.getServer().getPlayer(_name));
                }
            }
        }

        if (args[0].equals("start")){
            if (Sushida.isPlaying(sender.getName())){
                sender.sendMessage(ChatColor.RED+"あなたは現在プレイ中です！");
                sender.sendMessage(ChatColor.RED+"/sushida end で終了");
                return true;
            }
            if (args.length > 1){
                if (args[1].equals("infinity")){
                    playSec = -1;
                } else {
                    try {
                        playSec = Integer.parseInt(args[1]);
                    } catch (NumberFormatException e){
                        sender.sendMessage(ChatColor.RED+"2つ目の引数は整数でなければなりません！");
                        return true;
                    }
                }
            }
            if (args.length > 2 && args[2].equals("eng")){
                Engda.playerGameMode.put(sender.getName(), playSec);
                Engda.playerMaxSec.put(sender.getName(), playSec);
                player.sendTitle(ChatColor.GREEN+""+ChatColor.BOLD+"/_␣ で開始", null, 0, 800, 0);
                return true;
            }
            Sushida.playerGameMode.put(sender.getName(), playSec);
            Sushida.playerMaxSec.put(sender.getName(), playSec);
            player.sendTitle(ChatColor.GREEN+""+ChatColor.BOLD+"/.␣ で開始", null, 0, 800, 0);
        } else if (args[0].equals("end")){
            if (!Sushida.isPlaying(sender.getName()) && !Engda.isPlaying(sender.getName())){
                sender.sendMessage(ChatColor.GREEN+"あなたは現在プレイをしていません！");
                sender.sendMessage(ChatColor.GREEN+"/sushida start... で開始");
                return true;
            }
            try {
                if (Sushida.isPlaying(sender.getName())){
                    List<Integer> counts_ = Sushida.getCounts(sender.getName());
                    String result = Sushida.$ccWHITE+"("+Sushida.$ccGREEN+""+Sushida.$ccBOLD
                        +"✓"+Sushida.$ccRESET+""+Sushida.$ccGREEN+counts_.get(0)+" "
                        +Sushida.$ccRED+"✗"+counts_.get(1)+Sushida.$ccWHITE+")";
                    player.playSound(player, "entity.wither.death", 0.5F, 1F);
                    player.sendTitle(
                        Sushida.$ccLIGHT_PURPLE+"Finish!!",
                        Sushida.$ccGREEN+"Score: "+Sushida.playerCounts.get(sender.getName()).get(2)*120+", "+result,
                        0,
                        200,
                        20
                    );
                    player.sendMessage(Sushida.$ccGREEN+"Score: "+Sushida.playerCounts.get(sender.getName()).get(2)*120+", "+result);
                } else {
                    List<Integer> counts_ = Engda.getCounts(sender.getName());
                    String result = Engda.$ccWHITE+"("+Engda.$ccGREEN+""+Engda.$ccBOLD
                        +"✓"+Engda.$ccRESET+""+Engda.$ccGREEN+counts_.get(0)+" "
                        +Engda.$ccRED+"✗"+counts_.get(1)+Engda.$ccWHITE+")";
                    player.playSound(player, "entity.wither.death", 0.5F, 1F);
                    player.sendTitle(
                        Engda.$ccLIGHT_PURPLE+"Finish!!",
                        Engda.$ccGREEN+"Score: "+Engda.playerCounts.get(sender.getName()).get(2)*120+", "+result,
                        0,
                        200,
                        20
                    );
                    player.sendMessage(Engda.$ccGREEN+"Score: "+Engda.playerCounts.get(sender.getName()).get(2)*120+", "+result);
                }
            } catch (NullPointerException e){

            } finally {
                Sushida.__playerInit__(sender.getName(), false, true);
                Engda.__playerInit__(sender.getName(), false, true);
                sender.sendMessage(ChatColor.RED+"ゲームを終了しました。");
                player.resetTitle();
            }
        } else if (args[0].equals("get")){
            sender.sendMessage(Sushida.playerGameMode.toString());
            sender.sendMessage(Sushida.players.toString());
        } else if (args[0].equals("resent")){
            try {
                String jsonString = new String(Files.readAllBytes(Paths.get("./Sushida/sentences.json")));
                JSONArray jsonArray = new JSONArray(jsonString);
                for (int i = 0; i < jsonArray.length(); i++) {
                    String element = jsonArray.getString(i);
                    Sushida.sentences.add(element);
                }
                sender.sendMessage(ChatColor.GREEN+"Reload Complete!!");
            } catch (IOException e){
                e.printStackTrace();
                sender.sendMessage(ChatColor.RED+"Reload Failed: "+e.getMessage());
            }
        }
        return true;
    }

    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String label, String[] args){
        List<String> _candidates = new ArrayList<String>();
        if (args.length == 1){
            if (Sushida.isPlaying(sender.getName())){
                _candidates.add("end");
            } else {
                _candidates.add("start");
            }
        } else if (args.length == 2){
            _candidates.add("infinity");
            _candidates.add("<number>");
        } else if (args.length == 3){
            _candidates.add("eng");
        }
        return _candidates;
    }
}
