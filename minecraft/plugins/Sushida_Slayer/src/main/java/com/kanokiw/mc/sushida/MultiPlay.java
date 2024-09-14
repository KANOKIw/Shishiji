package com.kanokiw.mc.sushida;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.Comparator;
import java.util.Collections;
import java.util.HashMap;

import org.bukkit.entity.Player;
import org.bukkit.ChatColor;


public class MultiPlay {
    private List<Player> members = new ArrayList<Player>();
    public boolean resultSent = false;

    
    MultiPlay(List<String> players){
        for (String player : players){
            Player _player = Slayer.plugin.getServer().getPlayer(player);
            if (_player != null){
                members.add(_player);
            }
        }
    }


    public void sendResult(){
        List<String> messageList = new ArrayList<String>();
        List<String> modifiedPlayerList = new ArrayList<String>();
        Map<String, List<Integer>> nextMap = new HashMap<>();
        Map<String, List<Integer>> sortedMap = new LinkedHashMap<>();
        Integer cplus = 0;

        for (Player player : members){
            List<Integer> counts = Sushida.getCounts(player.getName());
            nextMap.put(player.getName(), counts);
        }

        List<Map.Entry<String, List<Integer>>> sortedEntries = new ArrayList<>(nextMap.entrySet());
        Collections.sort(sortedEntries, new Comparator<Map.Entry<String, List<Integer>>>(){
            @Override
            public int compare(Map.Entry<String, List<Integer>> entry1, Map.Entry<String, List<Integer>> entry2) {
                return Integer.compare(entry2.getValue().get(2), entry1.getValue().get(2));
            }
        });
        
        for (Player player : members){
            modifiedPlayerList.add(player.getName());
        }

        for (Map.Entry<String, List<Integer>> entry : sortedEntries) {
            if (modifiedPlayerList.contains(entry.getKey())){
                sortedMap.put(entry.getKey(), entry.getValue());
            }
        }

        for (String playerName : sortedMap.keySet()){
            List<Integer> counts = sortedMap.get(playerName);
            ChatColor leadColor = Sushida.$ccGREEN;
            String result;

            if (cplus == 0){
                leadColor = Sushida.$ccGOLD;
            } else if (cplus == 1){
                leadColor = Sushida.$ccAQUA;
            } else if (cplus == 2){
                leadColor = Sushida.$ccLIGHT_PURPLE;
            }
            result = Sushida.$ccYELLOW+""+Sushida.$ccBOLD+"\uFD3E "
                +Sushida.$ccRESET+leadColor+playerName
                +Sushida.$ccYELLOW+""+Sushida.$ccBOLD+" \uFD3F"+Sushida.$ccRESET+""
                +Sushida.$ccYELLOW+" ➡ "
                +Sushida.$ccLIGHT_PURPLE+counts.get(2)*240;
            messageList.add(result);
            cplus++;
        }
        for (Player player : members){
            player.sendMessage(
                ChatColor.BLUE+""+ChatColor.BOLD+""+ChatColor.STRIKETHROUGH+"-----------------------------------"
            );
            player.sendMessage(
                ChatColor.BLUE+""+ChatColor.BOLD+""+ChatColor.GOLD+"Game ended!!"
            );
            for (String message: messageList){
                player.sendMessage(message);
            }
            player.sendMessage(
                ChatColor.BLUE+""+ChatColor.BOLD+""+ChatColor.STRIKETHROUGH+"-----------------------------------"
            );
        }
    }
}
