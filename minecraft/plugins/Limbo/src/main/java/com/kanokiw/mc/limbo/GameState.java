package com.kanokiw.mc.limbo;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class GameState extends Random{
    public static void main(String[] args){
        new GameState().math();
    }


    public void math(){
        String[] line_ta = {"た", "ち", "つ", "て", "と"};
        String output;
        float avg = 0F;
        List<Integer> cn = new ArrayList<Integer>();
        
        for (int h = 0; h < 2000; h++){
            if (h % 20 == 0) System.out.println(ViewNumber(h));
            for (Integer t = 1; true; t++){
                output = String.format("ありが%sん%sん", line_ta[nextInt(line_ta.length)], line_ta[nextInt(line_ta.length)]);
                if (output.equals("ありがちんちん")){
                    cn.add(t);
                    break;
                }
            }
        }
        for (float j : cn) avg += j;
        avg /= cn.size(); 
        System.out.println(String.format("Average: %f", avg));
        System.out.println(String.format("Average late;  is: %f", 1/avg));
    }


    public static String ViewNumber(final float x){
        String j = String.valueOf(x);if (j.contains("E") || j.contains("e")){
            int m = j.indexOf("E") - j.indexOf(".") -1;
            int k = Integer.parseInt(j.substring(j.length() -1, j.length())) -m;
            String q = j.substring(0, j.length() -2).replace(".", "");

            for (int t = 0; t < k; t++){
                q += "0";
            } j = q + ".0";
        }
        String b = j.substring(j.indexOf("."), j.length());
        StringBuilder n = new StringBuilder(j.substring(0, j.indexOf("."))).reverse();
        StringBuilder u = new StringBuilder();
        for (int i = 0; i < n.length(); i++){
            String v = n.substring(i, i +1);
            if (i % 3 == 0 && i != 0) u.append(",");
            u.append(v);
        }
        if (!b.equals(".0")) return u.reverse().toString() + b;
        return u.reverse().toString();
    }
}
