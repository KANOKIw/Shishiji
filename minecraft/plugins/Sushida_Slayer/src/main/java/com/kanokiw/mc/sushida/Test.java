package com.kanokiw.mc.sushida;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import net.md_5.bungee.api.ChatColor;


public class Test {
    public static Random random = new Random();
    private static Map<String, List<String>> e = new HashMap<>();
    public static void main(String[] args){
        toCritDmg(e.keySet().size());
        print(random.nextDouble(29000, 31000)*15);
    }

    private static String toCritDmg(int dmg){
        String h = String.valueOf(dmg);
        String[] g = h.split("");
        List<String> re = new ArrayList<>();
        List<ChatColor> k = Arrays.asList(ChatColor.YELLOW, ChatColor.YELLOW, ChatColor.RED, ChatColor.RED);
        for (int i = 0; i < g.length ; i++){
            if (g.length - i > 4){
                re.add(g[i]);
                continue;
            }
            re.add(k.get(g.length - i - 1).toString());
            re.add(g[i]);
        }
        return String.join("", re);
    }

    public static String see(double d){
        DecimalFormat df = new DecimalFormat("#,###.######");
        
        String formattedNumber = df.format(d);
        return formattedNumber;
    }

    public static void print(Object x){
        System.out.println(x);
    }

    public static Integer toFerocityCount(Integer ferocity){
        Integer m = (int) Math.floor(ferocity/100);
        if (random.nextInt(0, 100) < ferocity - m*100)
            m++;
        return m;
    }
}
