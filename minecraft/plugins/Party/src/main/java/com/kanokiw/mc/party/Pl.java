package com.kanokiw.mc.funcs;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import net.md_5.bungee.api.ChatColor;
import net.md_5.bungee.api.CommandSender;
import net.md_5.bungee.api.plugin.Command;
import net.md_5.bungee.api.chat.BaseComponent;
import net.md_5.bungee.api.chat.ComponentBuilder;

public class Pl extends Command {
    static ChatColor cr = ChatColor.RED;
    static ChatColor cb = ChatColor.BLUE;
    static ChatColor cg = ChatColor.GREEN;
    static ChatColor cg_ = ChatColor.GOLD;
    static ChatColor cy = ChatColor.YELLOW;
    static ChatColor ca = ChatColor.AQUA;
    public Pl() {
        super("pl");
    }

    @Override
    public void execute(CommandSender sender, String[] args) {
        Map<String, PlayerParty> partiesMap = Party.partiesMap;
        PlayerParty sendersParty = partiesMap.get(sender.getName().toLowerCase());
        Main plugin = Main.getInstance();
        if (sendersParty == null){
            PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(ChatColor.RED+"あなたは現在 Party に参加していません。").create(),
                        sender.getName());
            return;
        }
        PlayerParty p = partiesMap.get(sender.getName().toLowerCase());
        int _len = p.members.size();
        _len+=p.subLeaders.size()+1;
        List<BaseComponent[]> _ms_ = new ArrayList<BaseComponent[]>();
        _ms_.add((BaseComponent[]) new ComponentBuilder(_len + "人のプレイヤー: ").create());
        String _subLeaders = "??";
        String _members = "??";
        for (String sl : p.subLeaders){
            _subLeaders = _subLeaders.replace("??", "");
            _subLeaders = _subLeaders
            + Party.getStatus(sl)
            + ca+Party.getName(sl)
            + ", ";
        }_subLeaders = _subLeaders.substring(0, _subLeaders.length()-2);
        for (String member : p.members){
            _members = _members.replace("??", "");
            _members = _members
            + Party.getStatus(member)
            + ChatColor.LIGHT_PURPLE+Party.getName(member)
            + ", ";
        }_members = _members.substring(0, _members.length()-2);
        _ms_.add((BaseComponent[]) new ComponentBuilder(cg_+"" + ChatColor.BOLD + "    リーダー: " +Party.getStatus(p.leader)+cg_+ Party.getName(p.leader)).create());
        if (!_subLeaders.equals("")) {
            _ms_.add((BaseComponent[]) new ComponentBuilder(ca+ "" + ChatColor.BOLD + "    サブリーダー: " +_subLeaders).create());
        }
        if (!_members.equals("")){
            _ms_.add((BaseComponent[]) new ComponentBuilder(ChatColor.LIGHT_PURPLE + "" + ChatColor.BOLD + "    メンバー: " +_members).create());
        }
        PlayerParty.__notifyBaseComponents(_ms_, sender.getName());
    }
}
