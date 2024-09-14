package com.kanokiw.mc.funcs;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.lang.Thread;

import net.md_5.bungee.api.ChatColor;
import net.md_5.bungee.api.CommandSender;
import net.md_5.bungee.api.ProxyServer;
import net.md_5.bungee.api.plugin.Command;
import net.md_5.bungee.api.plugin.TabExecutor;
import net.md_5.bungee.api.chat.BaseComponent;
import net.md_5.bungee.api.chat.ClickEvent;
import net.md_5.bungee.api.chat.ComponentBuilder;
import net.md_5.bungee.api.chat.HoverEvent;
import net.md_5.bungee.api.chat.TextComponent;
import net.md_5.bungee.api.config.ServerInfo;
import net.md_5.bungee.api.connection.ProxiedPlayer;



public class Party extends Command implements TabExecutor {
    private static Main plugin = Main.getInstance();
    public static Map<String, PlayerParty> partiesMap = new HashMap<String, PlayerParty>();
    static ChatColor cr = ChatColor.RED;
    static ChatColor cb = ChatColor.BLUE;
    static ChatColor cg = ChatColor.GREEN;
    static ChatColor cg_ = ChatColor.GOLD;
    static ChatColor cy = ChatColor.YELLOW;
    static ChatColor ca = ChatColor.AQUA;

    public Party() {
        super("party", null, "p");
    }


    @Override
    public void execute(final CommandSender sender, String[] args) {
        if (sender instanceof net.md_5.bungee.api.connection.ProxiedPlayer){
            final String sendersName = sender.getName().toLowerCase();
            if (args.length < 1) {
                PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"使用方法: /party <プレイヤーネーム>").create(),
                sendersName);
                return;
            }

            final String a1 = args[0].toLowerCase();
            if (a1.equals("get")){
                PlayerParty _ppp = partiesMap.get(sendersName);
                if (_ppp == null){
                    sender.sendMessage(new TextComponent(cr+"NullPointerException: Couldn't get any instance of PlayerParty from "
                    +sender.getName()+"."));
                    return;
                }
                sender.sendMessage(new TextComponent(
                    " leader: "+_ppp.leader
                    +" subs: "+_ppp.subLeaders
                    +" mems: "+_ppp.members
                    +" partiesMap: "+partiesMap
                    +" pPlayers: "+PlayerParty._partiedPlayers
                    +" mutedPc: "+_ppp.mutedPcPlayers
                    +" pendingInvites:"+_ppp.pendingInvites
                    +" gotInvitedEver(decs _inv):"+_ppp.gotInvitedEver
                    +" __experiedSessions__: "+Mmbetac.__experiedSessions__
                ));
                return;
            }

            if (a1.equals("accept") || a1.equals("join")){
                if (args.length < 2){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"使用方法: /party accept <招待者名>").create(),
                    sendersName);
                    return;
                }

                String a2 = args[1].toLowerCase();
                if (PlayerParty._partiedPlayers.contains(sendersName)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"既に Party に参加しています。").create(),
                    sendersName);
                    return;
                }

                PlayerParty partytoJoin = partiesMap.get(a2);
                if (partytoJoin == null){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"その Party は解散さえれました。").create(),
                    sendersName);
                    return;
                }

                if (!partytoJoin.isBeingInvited(sendersName)){
                    if (partytoJoin.hasGottenInvited(sendersName)){
                        PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"招待が期限切れです。").create(),
                        sendersName);
                        return;
                    } else {
                        PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"あなたはその Party に招待されていません。").create(),
                        sendersName);
                        return;
                    }
                }

                partytoJoin.join(sendersName);
                PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cg_+getName(partytoJoin.leader) + cg+" の Party に参加しました。").create(), sendersName);
                partiesMap.put(sendersName, partytoJoin);

            } else if (a1.equals("leave")){ 
                if (!PlayerParty._partiedPlayers.contains(sendersName)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"あなたは現在 Party に参加していません。").create(),
                    sendersName);
                    return;
                }

                PlayerParty partytoJoin = partiesMap.get(sendersName);
                PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+" Party から退出しました。").create(),
                    sendersName);
                int res = partytoJoin.leave(sendersName);
                if (res == 0){
                    partytoJoin = null;
                    System.gc();
                }

            } else if (a1.equals("list")){
                if (!PlayerParty._partiedPlayers.contains(sendersName)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"あなたは現在 Party に参加していません。").create(),
                        sendersName);
                    return;
                }

                PlayerParty p = partiesMap.get(sendersName);
                int _len = p.members.size();
                _len+=p.subLeaders.size()+1;
                List<BaseComponent[]> _ms_ = new ArrayList<BaseComponent[]>();
                _ms_.add((BaseComponent[]) new ComponentBuilder(_len + "人のプレイヤー: ").create());
                String _subLeaders = "??";
                String _members = "??";
                for (String sl : p.subLeaders){
                    _subLeaders = _subLeaders.replace("??", "");
                    _subLeaders = _subLeaders
                    + getStatus(sl)
                    + ca+getName(sl)
                    + ", ";
                }_subLeaders = _subLeaders.substring(0, _subLeaders.length()-2);

                for (String member : p.members){
                    _members = _members.replace("??", "");
                    _members = _members
                    + getStatus(member)
                    + ChatColor.LIGHT_PURPLE+getName(member)
                    + ", ";
                }_members = _members.substring(0, _members.length()-2);

                _ms_.add((BaseComponent[]) new ComponentBuilder(" "+cg_+"" + ChatColor.BOLD + "    リーダー: " +getStatus(p.leader)+cg_+ getName(p.leader)).create());
                if (!_subLeaders.equals("")) {
                    _ms_.add((BaseComponent[]) new ComponentBuilder(" "+ca+ "" + ChatColor.BOLD + "    サブリーダー: " + _subLeaders).create());
                }

                if (!_members.equals("")){
                    _ms_.add((BaseComponent[]) new ComponentBuilder(" "+ChatColor.LIGHT_PURPLE + "" + ChatColor.BOLD + "    メンバー: " + ChatColor.LIGHT_PURPLE+_members)
                    .create());
                }

                PlayerParty.__notifyBaseComponents(_ms_, sendersName);
            } else if (a1.equals("promote")){
                if (!PlayerParty._partiedPlayers.contains(sendersName)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(
                        " "+cr+"あなたは現在 Party に参加していません。"
                    )
                    .create(),
                    sendersName);
                    return;
                }

                if (args.length < 2){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(
                        " "+cr+"使用方法: /party promote <プレイヤーネーム>"
                    )
                    .create(),
                    sendersName);
                    return;
                }

                final String a2 = args[1].toLowerCase();
                PlayerParty sendersParty = partiesMap.get(sendersName);
                if (!sendersParty.hasPermission(sendersName)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"権限がありません。")
                    .create(),
                    sendersName);
                    return;
                }

                if (sendersName.equals(a2)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"自分に対して行うことはできません。")
                    .create(),
                    sendersName);
                    return;
                }

                boolean res = sendersParty.promote(sendersName, a2);
                if (!res){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(
                        " "+cr+"自分以上の権限を持っているプレイヤーに対しては使用できません。"
                    )
                    .create(),
                    sendersName);
                }
                
            } else if(a1.equals("demote")){
                if (!PlayerParty._partiedPlayers.contains(sendersName)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(
                        " "+cr+"あなたは現在 Party に参加していません。"
                    )
                    .create(),
                        sendersName);
                    return;
                }

                if (args.length < 2){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"使用方法: /party demote <プレイヤーネーム>")
                    .create(),
                    sendersName);
                    return;
                }

                String a2 = args[1];
                PlayerParty sendersParty = partiesMap.get(sendersName);
                if (!sendersParty.isLeader(sendersName)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"権限がありません。")
                    .create(),
                    sendersName);
                    return;
                }

                if (sendersName.equals(a2)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"自分に対して行うことはできません。")
                    .create(),
                    sendersName);
                    return;
                }

                sendersParty.demote(sendersName, a2);
            } else if(a1.equals("transfer")){
                if (!PlayerParty._partiedPlayers.contains(sendersName)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"あなたは現在 Party に参加していません。")
                    .create(),
                        sendersName);
                    return;
                }

                if (args.length < 2){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(
                        " "+cr+"使用方法: /party transfer <プレイヤーネーム>"
                    )
                    .create(),
                    sendersName);
                    return;
                }

                String a2 = args[1];
                PlayerParty sendersParty = partiesMap.get(sendersName);
                if (sendersName.equals(a2)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"自分に対して行うことはできません。")
                    .create(),
                    sendersName);
                    return;
                }

                if (!sendersParty.isLeader(sendersName)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(
                        " "+cr+"これを使用できるのは Party リーダーだけです。"
                    )
                    .create(),
                    sendersName);
                    return;
                } else{
                    sendersParty.transfer(a2);
                }

            } else if(a1.equals("kick")){
                if (!PlayerParty._partiedPlayers.contains(sendersName)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"あなたは現在 Party に参加していません。")
                    .create(),
                        sendersName);
                    return;
                }

                if (args.length < 2){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"使用方法: /party kick <プレイヤーネーム>")
                    .create(),
                    sendersName);
                    return;
                }

                PlayerParty sendersParty = partiesMap.get(sendersName);
                if (!sendersParty.hasPermission(sendersName)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"プレイヤーをキックする権限がありません。")
                    .create(),
                        sendersName);
                    return;
                }
                
                String a2 = args[1];
                if (a2.equals(sendersName)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"自分自身をキックすることはできません。")
                    .create(),
                        sendersName);
                    return;
                }

                boolean rqp = sendersParty.kick(sendersName, a2);
                if (!rqp){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(
                        " "+cr+"自分以上の権限を持っているプレイヤーに対しては使用できません。"
                    )
                    .create(),
                    sendersName);
                }

            } else if(a1.equals("disband")){
                PlayerParty sendersParty = partiesMap.get(sendersName);
                if (sendersParty == null){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"あなたは現在 Party に参加していません。")
                    .create(),
                        sendersName);
                    return;
                }

                if (!sendersParty.isLeader(sendersName)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"これを使用できるのは Party リーダーのみです。")
                    .create(),
                        sendersName);
                    return;
                }

                boolean _pres = sendersParty.disband();
                if (_pres){
                    sendersParty = null;
                    System.gc();
                }

            } else if(a1.equals("warp")){
                ProxiedPlayer _ps = (ProxiedPlayer) sender;
                if (!PlayerParty._partiedPlayers.contains(sendersName)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"あなたは現在 Party に参加していません。").create(),
                        sendersName);
                    return;
                }

                PlayerParty sendersParty = partiesMap.get(sendersName);
                if (!sendersParty.isLeader(sendersName)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(
                        " "+cr+"これを使用できるのは Party リーダーのみです。"
                        ).create(),
                        sendersName);
                    return;
                }

                if (_ps.getServer().getInfo().getName().equals("limbo")){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(
                        " "+cr+"Limbo では使用できません。"
                        ).create(),
                        sendersName);
                    return;
                }

                final ProxiedPlayer player = (net.md_5.bungee.api.connection.ProxiedPlayer) sender;
                String _server = player.getServer().getInfo().getName();
                List<Integer> rp = sendersParty.warp(_server);
                BaseComponent[] _line_1 = new ComponentBuilder(ChatColor.GOLD+"☆ "+cy+rp.get(0)+cg+" players affected.").create();
                BaseComponent[] _line_2 = new ComponentBuilder(cr+"✖ "+cy+rp.get(1)+cg+" players failed.").create();
                List<BaseComponent[]> _ms_ = new ArrayList<BaseComponent[]>();

                _ms_.add(_line_1);
                _ms_.add(_line_2);
                PlayerParty.__notifyBaseComponents(_ms_, sendersName);

            } else if (a1.equals("mute")){
                PlayerParty sendersParty = partiesMap.get(sendersName);
                if (sendersParty == null){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"あなたは現在 Party に参加していません。").create(),
                        sendersName);
                    return;
                }
                sendersParty.mute(sendersName);

            } else if (a1.equals("sushida")){
                if (!PlayerParty._partiedPlayers.contains(sendersName)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"あなたは現在 Party に参加していません。").create(),
                        sendersName);
                    return;
                }
                PlayerParty sendersParty = partiesMap.get(sendersName);
                if (!sendersParty.isLeader(sendersName)){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(
                        " "+cr+"これを使用できるのは Party リーダーのみです。"
                        ).create(),
                        sendersName);
                    return;
                }
                HoverEvent _follow = new HoverEvent(HoverEvent.Action.SHOW_TEXT, new ComponentBuilder(ChatColor.YELLOW+"Start!!").create());
                String _session;
                String _players = "";
                ClickEvent _click;
                for (String _n : sendersParty.getAll()){
                    _players = _players + getName(_n) + " ";
                } if (!_players.equals("")) _players = _players.substring(0, _players.length() -1);
                _session = String.valueOf(Events.random.nextInt(100000));
                if (args.length > 1 && args[1].equals("eng")){
                    _click = new ClickEvent(ClickEvent.Action.RUN_COMMAND, "/sushida with all eng "+_session+" "+_players);
                } else {
                    _click = new ClickEvent(ClickEvent.Action.RUN_COMMAND, "/sushida with all rome "+_session+" "+_players);
                }
                BaseComponent[] _clickable = new ComponentBuilder(ChatColor.GREEN+""+ChatColor.BOLD+"[START]")
                    .event(_follow)
                    .event(_click)
                    .create();
                BaseComponent[] _notify = new ComponentBuilder(ChatColor.DARK_AQUA+"準備が整いました！クリックして開始")
                    .event(_follow)
                    .event(_click)
                    .create();
                List<BaseComponent[]> _m = new ArrayList<BaseComponent[]>();
                _m.add(_clickable);
                _m.add(_notify);
                PlayerParty.__notifyBaseComponents(_m, sendersName);

            } else {
                final PlayerParty sendersParty = partiesMap.get(sendersName);
                if (sendersParty != null && !sendersParty.hasPermission(sendersName)){
                    PlayerParty._notifyBaseComponents(new ComponentBuilder(" "+ChatColor.RED + "プレイヤーを招待する権限がありません。")
                    .create(),
                    sendersName);
                    return;
                }

                if (sendersName.equals(a1)){
                    sender.sendMessage(new TextComponent(" "+ChatColor.RED + "自分自身を招待することはできません。"));
                    return;
                }

                ProxiedPlayer whowasInvited = plugin.getProxy().getPlayer(a1);
                if (whowasInvited == null){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"プレイヤーが見つかりません。").create(),
                        sendersName);
                    return;
                }

                if (whowasInvited.getServer() == null){
                    PlayerParty._notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+cr+"プレイヤーはオフラインです。").create(),
                        sendersName);
                    return;
                }

                if (sendersParty == null){
                    final PlayerParty newParty = new PlayerParty(sendersName);
                    newParty.inviterMap.put(a1, sendersName);
                    newParty.pendingInvites.add(a1);
                    partiesMap.put(sendersName, newParty);
                    ProxyServer.getInstance().getScheduler().schedule(plugin, new Runnable() {
                        @Override
                        public void run() {
                            newParty.experieInvite(sendersName, a1);
                        }
                    }, 60, java.util.concurrent.TimeUnit.SECONDS);

                } else {
                    if (sendersParty.isBeingInvited(a1)){
                        PlayerParty._notifyBaseComponents(new ComponentBuilder(" "+ChatColor.RED + "そのプレイヤーはすでに招待されています。")
                        .create(),
                        sendersName);
                        return;
                    }

                    if (sendersParty.members.contains(a1) || sendersParty.leader.equals(a1)){
                        PlayerParty._notifyBaseComponents(new ComponentBuilder(" "+ChatColor.RED + "そのプレイヤーはすでに Party にいます。")
                        .create(),
                        sendersName);
                        return;
                    }

                    sendersParty.pendingInvites.add(a1);
                    sendersParty.inviterMap.put(a1, sendersName);
                    ProxyServer.getInstance().getScheduler().schedule(plugin, new Runnable() {
                        @Override
                        public void run() {
                            sendersParty.experieInvite(sendersName, a1);
                        }
                    }, 60, java.util.concurrent.TimeUnit.SECONDS);
                }

                BaseComponent[] __hv = new ComponentBuilder(cg+"Accpet!").create();
                ClickEvent ce = new ClickEvent(ClickEvent.Action.RUN_COMMAND, "/p accept " + sendersName);
                HoverEvent _hv = new HoverEvent(HoverEvent.Action.SHOW_TEXT, __hv);
                BaseComponent[] _content = new ComponentBuilder(" "+cg_+sender.getName()+cg+" が"+cg_+"あなた"
                    +cg+"を Party に招待しました！ "+cg+"[Accept]")
                    .event(_hv).event(ce).create();
                BaseComponent[] __content = new ComponentBuilder(" "+cg_+"こちらをクリック "+cy+"もしくは "+cg_+"/p accept " + getName(sendersName) +cy+" で参加").event(_hv).event(ce).create();
                List<BaseComponent[]> _ms_ = new ArrayList<BaseComponent[]>();
                PlayerParty _p_a = partiesMap.get(sendersName);

                _ms_.add(_content);
                _ms_.add(__content);
                PlayerParty.__notifyBaseComponents(_ms_, whowasInvited.getName());

                BaseComponent[] _rdr = new ComponentBuilder(" "+ca+whowasInvited.getName()+cg+" に招待を送信しました！"+cb+"有効期限は"+cy+"1"+cb+"分間です。").create();
                BaseComponent[] __rdr = new ComponentBuilder(" "+_p_a.getColor(sendersName)+getName(sendersName)
                    +cg+" が "+cy+a1+cg+" を Party に招待しました！"
                    +cb+"有効期限は"+cy+"1"+cb+"分間です。").create();
                for (String _pl : _p_a.getAll()){
                    if (_pl.equals(sendersName)) continue;
                    PlayerParty._notifyBaseComponents(__rdr, _pl);
                }
                PlayerParty._notifyBaseComponents(_rdr, sendersName);
            }
        }
    }

    @Override
    public Iterable<String> onTabComplete(CommandSender sender, String[] args){
        List<String> _candidates_1 = new ArrayList<String>();
        List<String> _candidates_2 = new ArrayList<String>();
        List<String> inviters = new ArrayList<String>();
        PlayerParty sendersParty = partiesMap.get(sender.getName().toLowerCase());
        boolean isBeingInvited = false;
        
        for (PlayerParty _party : partiesMap.values()){
            if (_party.isBeingInvited(getName(sender.getName()))){
                inviters.add(getName(_party.inviterMap.get(sender.getName().toLowerCase())));
                isBeingInvited = true;
            }
        }

        if (args.length == 1){
            if (isBeingInvited){
                _candidates_1.add("accept");
                _candidates_1.add("join");
            }
            if (sendersParty == null){
                for (ProxiedPlayer p : plugin.getProxy().getPlayers()){
                    if (p.getName().equals(sender.getName())) {
                        continue;
                    }
                    _candidates_1.add(p.getName());
                }
            } else {
                if (sendersParty.hasPermission(sender.getName())){
                    _candidates_1.add("promote");
                    _candidates_1.add("kick");
                    if (sendersParty.isLeader(sender.getName())){
                        _candidates_1.add("sushida");
                        _candidates_1.add("transfer");
                        _candidates_1.add("demote");
                        _candidates_1.add("disband");
                        _candidates_1.add("warp");
                    }
                }
                _candidates_1.add("leave");
            }
            return _candidates_1;

        } else if (args[0].equals("join") || args[0].equals("accept")){
            return inviters;

        } else if (args[0].equals("kick") || args[0].equals("promote")){
            if (sendersParty != null){
                if (sendersParty.isLeader(sender.getName())){
                    for (String _eall : sendersParty.getAll()){
                        if (_eall.equals(sender.getName().toLowerCase())){
                            continue;
                        }
                        _candidates_2.add(getName(_eall));
                    }
                } else if (sendersParty.isSubLeader(sender.getName())){
                    for (String _eall : sendersParty.getAll()){
                        if (_eall.equals(sender.getName().toLowerCase()) || sendersParty.isLeader(_eall) || sendersParty.isSubLeader(_eall)){
                            continue;
                        }
                        _candidates_2.add(getName(_eall));
                    }
                }
            }
            return _candidates_2;

        } else if (args[0].equals("demote")){
            if (sendersParty != null && sendersParty.isLeader(sender.getName())){
                for (String _eall : sendersParty.subLeaders){
                    _candidates_2.add(getName(_eall));
                }
            }
            return _candidates_2;

        } else if (args[0].equals("transfer")){
            if (sendersParty != null && sendersParty.isLeader(sender.getName())){
                for (String _eall : sendersParty.getAll()){
                    if (_eall.equals(sender.getName().toLowerCase())){
                        continue;
                    }
                    _candidates_2.add(getName(_eall));
                }
            }
            return _candidates_2;

        } else if(args[0].equals("sushida")){
            _candidates_2.add("eng");
            return _candidates_2;

        } else {
            return _candidates_1;
        }
    }

    public static String getName(String name){
        ProxiedPlayer _p = plugin.getProxy().getPlayer(name);
        if (_p == null) return name;
        return _p.getName();
    }

    public static String getStatus(String name){
        ProxiedPlayer _p = plugin.getProxy().getPlayer(name);
        if (_p == null) return ChatColor.RED + "◆ ";
        return ChatColor.GREEN + "◆ ";
    }
}


class PlayerParty{
    public static List<String> _partiedPlayers = new ArrayList<String>();
    protected String leader;
    protected List<String> members = new ArrayList<String>();
    protected List<String> subLeaders = new ArrayList<String>();
    public List<String> pendingInvites = new ArrayList<String>();
    public List<String> gotInvitedEver = new ArrayList<String>();
    public List<String> mutedPcPlayers = new ArrayList<String>();
    public Map<String, String> inviterMap = new HashMap<String, String>();
    public boolean onWarp = false;
    static private Main plugin = Main.getInstance();


    PlayerParty(String __leader){
        this.leader = __leader;
        PlayerParty._partiedPlayers.add(leader);
    }


    public boolean join(String name){
        if (this.members.contains(name) || this.leader.equals(name) || this.subLeaders.contains(name)){
            return false;
        }

        this.members.add(name);
        BaseComponent[] _n = new ComponentBuilder(" "+ChatColor.LIGHT_PURPLE+Party.getName(name)
        +ChatColor.GREEN+" が Party に参加しました。").create();
        for (String member : members){
            if (member.equals(name)) continue;
            _notifyBaseComponents(_n, member);
        }
        this.pendingInvites.remove(name);
        this.inviterMap.remove(name);
        _notifyBaseComponents(_n, leader);
        PlayerParty._partiedPlayers.add(name);
        // put(past) partiesMap at `Party`
        return true;
    }


    public int leave(String name){
        List<String> players = new ArrayList<String>();
        for(String m:this.members)players.add(m);
        for(String s:this.subLeaders)players.add(s);
        ChatColor _co = getColor(name);

        players.add(this.leader);
        if (this.leader.equals(name)){
            BaseComponent[] _pn = new ComponentBuilder(" "+_co+Party.getName(name)+ChatColor.RED+" が Party から退出しました。").create();
            for (String p : players){
                if (p.equals(name)) continue;
                _notifyBaseComponents(_pn, p);
            }
            if (players.size() < 2){
                BaseComponent[] _n = new ComponentBuilder(" "+ChatColor.RED + " Party に誰もいなくなったため、解散されました。").create();
                _notifyBaseComponents(_n, name);
                Party.partiesMap.remove(name);
                PlayerParty._partiedPlayers.remove(name);
                return 0;
            } else {
                if (this.subLeaders.size() > 0){
                    this.leader = this.subLeaders.get(0);
                } else this.leader = this.members.get(0);
                BaseComponent[] _n = new ComponentBuilder(" "+ChatColor.RED + " Party リーダーが退出したため、この Party は " +Party.cg_+Party.getName(this.leader)
                + " に譲渡されました。").create();
                for (String member : this.members){
                    _notifyBaseComponents(_n, member);
                }
                _notifyBaseComponents(_n, name);
                Party.partiesMap.remove(name);
                PlayerParty._partiedPlayers.remove(name);
                this.members.remove(leader);
                return 1;
            }
        }
        if (!this.members.contains(name) || !this.subLeaders.contains(name)){
            // never
            return 2;
        }

        members.remove(name);
        BaseComponent[] _pn = new ComponentBuilder(" "+_co+Party.getName(name)+ChatColor.RED+" が Party から退出しました。")
        .create();

        for (String member : this.members){
            _notifyBaseComponents(_pn,
                member);
        }
        _notifyBaseComponents(_pn, this.leader);
        Party.partiesMap.remove(name);
        PlayerParty._partiedPlayers.remove(name);
        return 3;
    }


    public boolean kick(String executer, String name){
        List<String> players = new ArrayList<String>();
        for(String m:this.members)players.add(m);
        for(String s:this.subLeaders)players.add(s);
        ChatColor co = getColor(name);
        ChatColor _co = getColor(executer);

        players.add(this.leader);
        if (!players.contains(name)){
            _notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+ChatColor.YELLOW+name+ChatColor.RED+" がみつかりませんでした。")
            .create(),executer);
            return true;
        }
        if (name.equals(this.leader) || (this.subLeaders.contains(executer) && this.subLeaders.contains(name))){
            return false;
        }
        this.subLeaders.remove(name);
        this.members.remove(name);
        for (String player : players){
            if (player.equals(name)){
                _notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+co+"あなた"+ChatColor.RED+"は "+_co+Party.getName(executer)
                +ChatColor.RED+" により、 Party からキックされました。")
                .create(), player);
                continue;
            }
            _notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+co+Party.getName(name)+ChatColor.RED+" が "+_co+Party.getName(executer)
            +ChatColor.RED+" により、 Party からキックされました。")
            .create(), player);
        }
        PlayerParty._partiedPlayers.remove(name);
        Party.partiesMap.remove(name);
        return true;
    }


    public boolean disband(){
        List<String> players = new ArrayList<String>();
        for(String m:this.members)players.add(m);
        for(String s:this.subLeaders)players.add(s);

        players.add(this.leader);
        for (String player : players){
            Party.partiesMap.remove(player);
            PlayerParty._partiedPlayers.remove(player);
            _notifyBaseComponents((BaseComponent[]) new ComponentBuilder(
                " "+ChatColor.GOLD+Party.getName(leader)+ChatColor.YELLOW+" が Party を解散させました！").create(), player);
        }
        // In order to gc
        return true;
    }


    /**
     * returns false if name is greater or the same
     */
    public boolean promote(String executer, String name){
        List<String> players = new ArrayList<String>();
        for(String m:this.members)players.add(m);
        for(String s:this.subLeaders)players.add(s);
        ChatColor _co = getColor(executer);

        players.add(this.leader);
        if (!players.contains(name)){
            _notifyBaseComponents((BaseComponent[]) new ComponentBuilder(ChatColor.YELLOW+name+ChatColor.RED+" がみつかりませんでした。")
                    .create(),executer);
            return true;
        }
        if (executer.equals(this.leader)){
            if (this.members.contains(name)){
                this.subLeaders.add(name);
                this.members.remove(name);
                for (String member : this.members){
                    _notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+ChatColor.AQUA+Party.getName(name) + " が "+_co+Party.getName(executer)+ChatColor.YELLOW+" により"
                    +ChatColor.AQUA+"サブリーダー"+ChatColor.YELLOW+"に昇格しました。")
                    .create(),member);
                }
                for (String sl : this.subLeaders){
                    String _o = ChatColor.LIGHT_PURPLE+Party.getName(name) + "が";
                    if (sl.equals(name)) _o = ChatColor.AQUA+"あなたは ";
                    _notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+_o+_co+Party.getName(executer)+ChatColor.YELLOW+" により"
                    +ChatColor.AQUA+"サブリーダー"+ChatColor.YELLOW+"に昇格しました。")
                    .create(),sl);
                }
                _notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+ChatColor.AQUA+Party.getName(name) + " が "+_co+Party.getName(executer)+ChatColor.YELLOW+" により"
                +ChatColor.AQUA+"サブリーダー"+ChatColor.YELLOW+"に昇格しました。")
                .create(),this.leader);
            } else {
                // likely /p transfer
                subLeaders.add(this.leader);
                this.leader = name;
                subLeaders.remove(name);
                BaseComponent[] kj = new ComponentBuilder(" "+ChatColor.YELLOW+"この Party は "+ChatColor.AQUA+Party.getName(executer)+ChatColor.YELLOW
                    +" により "+ChatColor.GOLD+Party.getName(name)+ChatColor.YELLOW+" に譲渡されました").create();
                for (String member : this.members){
                    _notifyBaseComponents(kj,member);
                }
                for (String sl : this.subLeaders){
                    _notifyBaseComponents(kj,sl);
                }
                _notifyBaseComponents(new ComponentBuilder(" "+ChatColor.YELLOW +"この Party は "+ChatColor.AQUA+Party.getName(executer)+ChatColor.YELLOW+" により"
                    +ChatColor.GOLD+"あなた"+ChatColor.YELLOW+"に譲渡されました。").create(),
                this.leader);
            }
            return true;
        } else {
            if (name.equals(this.leader) || this.subLeaders.contains(name)){
                return false;
            }
            this.subLeaders.add(name);
            this.members.remove(name);
            for (String member : this.members){
                _notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+ChatColor.AQUA+Party.getName(name) + "が"
                +ChatColor.AQUA+Party.getName(executer)+ChatColor.AQUA+"により"
                +ChatColor.AQUA+"サブリーダー"+ChatColor.YELLOW+"に昇格しました。")
                .create(),member);
            }
            for (String sl : this.subLeaders){
                String _o = ChatColor.GREEN+Party.getName(name) + "が";
                if (sl.equals(_o)) _o = ChatColor.AQUA+"あなたは";
                _notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+_o+ChatColor.AQUA+Party.getName(executer)+ChatColor.YELLOW+"により"
                +ChatColor.AQUA+"サブリーダー"+ChatColor.YELLOW+"に昇格しました。")
                .create(),sl);
            }
            _notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+ChatColor.AQUA+Party.getName(name) + "が"+ChatColor.AQUA+Party.getName(executer)+ChatColor.YELLOW+"により"
            +ChatColor.AQUA+"サブリーダー"+ChatColor.YELLOW+"に昇格しました。")
            .create(),this.leader);
            return true;
        }
    }


    /**
     * returns false if name is greater or the same
     * Only the leader can handle this
     * Method only allows subLeader -> member
     */
    public void demote(String executer, String name){
        List<String> players = new ArrayList<String>();
        for(String m:this.members)players.add(m);
        for(String s:this.subLeaders)players.add(s);
        players.add(this.leader);

        if (!players.contains(name)){
            _notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+ChatColor.YELLOW+name+ChatColor.RED+" がみつかりませんでした。")
                    .create(),executer);
            return;
        }
        if (this.members.contains(name)){
            _notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+ChatColor.LIGHT_PURPLE+Party.getName(name)+ChatColor.RED+" は"
            +ChatColor.LIGHT_PURPLE+"メンバー"+ChatColor.RED+"であるためこれ以上降格させることはできません")
                .create(),executer);
            return;
        } else {
            this.members.add(name);
            this.subLeaders.remove(name);

            players.remove(name);
            for (String p : players){
                _notifyBaseComponents(new ComponentBuilder(" "+ChatColor.LIGHT_PURPLE+Party.getName(name)+ChatColor.YELLOW+" が "
                +ChatColor.GOLD+Party.getName(executer)+" により"
                +ChatColor.LIGHT_PURPLE+"メンバー"
                +ChatColor.YELLOW+"に降格されました。").create(),
                p);
            }
            _notifyBaseComponents(new ComponentBuilder(" "+ChatColor.LIGHT_PURPLE+"あなた"+ChatColor.YELLOW+"は "+ChatColor.GOLD+Party.getName(executer)+" により"
                +ChatColor.LIGHT_PURPLE+"メンバー"
                +ChatColor.YELLOW+"に降格されました。").create(),
                name);
        }
        return;
    }


    public void transfer(String name){
        String __leader = this.leader;
        List<String> players = new ArrayList<String>();
        for(String m:this.members)players.add(m);
        for(String s:this.subLeaders)players.add(s);

        players.add(this.leader);
        if (!players.contains(name)){
            _notifyBaseComponents((BaseComponent[]) new ComponentBuilder(" "+ChatColor.YELLOW+name+ChatColor.RED+" がみつかりませんでした。")
                    .create(),this.leader);
        }
        this.subLeaders.add(this.leader);
        this.leader = name;
        this.members.remove(name);
        this.subLeaders.remove(name);

        for (String m : this.members){
            _notifyBaseComponents(new ComponentBuilder(" "+ChatColor.YELLOW +" この Party は "+ChatColor.AQUA+Party.getName(__leader)+ChatColor.YELLOW+" により "
            +ChatColor.GOLD+Party.getName(leader)+ChatColor.YELLOW+" に譲渡されました。").create(),
            m);
        }
        for (String s : this.subLeaders){
            _notifyBaseComponents(new ComponentBuilder(" "+ChatColor.YELLOW +" この Party は "+ChatColor.AQUA+Party.getName(__leader)+ChatColor.YELLOW+" により "
            +ChatColor.GOLD+Party.getName(leader)+ChatColor.YELLOW+" に譲渡されました。").create(),
            s);
        }
        _notifyBaseComponents(new ComponentBuilder(" "+ChatColor.YELLOW +" この Party は "+ChatColor.AQUA+Party.getName(__leader)+ChatColor.YELLOW+" により"
        +ChatColor.GOLD+"あなた"+ChatColor.YELLOW+"に譲渡されました。").create(),
        this.leader);
        return;
    }


    public List<Integer> warp(String servername){
        int i = 0;
        final ServerInfo server = plugin.getProxy().getServerInfo(servername);
        List<String> players = new ArrayList<String>();
        for(String m:this.members)players.add(m);
        for(String s:this.subLeaders)players.add(s);
        for(String p:players){
            ProxiedPlayer _p = plugin.getProxy().getPlayer(p);
            if (_p.getServer().getInfo().getName().equals(servername)) {
                _p.sendMessage(new TextComponent(" "+ChatColor.GRAY+"Warping you to the server "+ChatColor.YELLOW+"["+servername+"]"));
                i++;
            } else {
                try{
                    Events.onWarpPlayers.add(p);
                    _p.connect(server);
                }catch(Error e){
                    i++;
                }
            }
            _notifyBaseComponents(new ComponentBuilder(" "+ChatColor.GOLD+"リーダーの "+Party.getName(leader)
            +ChatColor.YELLOW+" が"+getColor(p)+"あなた"+ChatColor.YELLOW+"をサーバーに召喚しました。")
            .create(), p);
        }
        return Arrays.asList(players.size()-i, i);
    }


    /*
     * name mutes party
     * (toggles mute)
     */
    public void mute(String name){
        if (this.mutedPcPlayers.contains(name)){
            this.mutedPcPlayers.remove(name);
            _notifyBaseComponents(new ComponentBuilder(" "+Party.cg_+"Party "+Party.cg+"チャンネルのミュートを解除しました。")
            .create(),
            name);
            return;
        }
        this.mutedPcPlayers.add(name);
        _notifyBaseComponents(new ComponentBuilder(" "+Party.cg_+"Party "+Party.cg+"チャンネルをミュートしました。")
        .create(),
        name);
    }


    public boolean isLeader(String name){
        return this.leader.equals(name.toLowerCase());
    }


    public boolean isSubLeader(String name){
        return this.subLeaders.contains(name.toLowerCase());
    }


    public boolean hasPermission(String name){
        return this.leader.equals(name.toLowerCase()) || this.subLeaders.contains(name.toLowerCase());
    }


    public ChatColor getColor(String name){
        if (this.leader.equals(name.toLowerCase())) return ChatColor.GOLD;
        if (this.subLeaders.contains(name.toLowerCase())) return ChatColor.AQUA;
        return ChatColor.LIGHT_PURPLE;
    }


    public List<String> getAll(){
        List<String> players = new ArrayList<String>();
        for(String m:this.members)players.add(m);
        for(String s:this.subLeaders)players.add(s);
        players.add(this.leader);
        return players;
    }


    public boolean hasMuted(String name){
        return this.mutedPcPlayers.contains(name.toLowerCase());
    }


    public void experieInvite(String inviter, String name){
        if (this.pendingInvites.contains(name.toLowerCase())){
            _notifyBaseComponents(new ComponentBuilder(ChatColor.RED+Party.getName(name)+" への招待の有効期限が切れました。").create(), inviter);
            _notifyBaseComponents(new ComponentBuilder(ChatColor.RED+Party.getName(inviter)+" からの招待の有効期限が切れました。").create(), name);
        }
        this.inviterMap.remove(name.toLowerCase());
        this.gotInvitedEver.add(name.toLowerCase());
        this.pendingInvites.remove(name.toLowerCase());
    }


    public boolean isBeingInvited(String name){
        return this.pendingInvites.contains(name.toLowerCase());
    }


    public boolean hasGottenInvited(String name){
        return this.gotInvitedEver.contains(name.toLowerCase());
    }


    public static void _notifyBaseComponents(BaseComponent[] __base, String player){
        List<BaseComponent[]> _msgs = new ArrayList<BaseComponent[]>();
        final BaseComponent[] _line = new ComponentBuilder(ChatColor.BLUE+""+ChatColor.BOLD+""+ChatColor.STRIKETHROUGH+"-----------------------------------").create();

        _msgs.add(_line);
        _msgs.add(__base);
        _msgs.add(_line);
        ProxiedPlayer p = plugin.getProxy().getPlayer(player);
        for (BaseComponent[] msg : _msgs){
            // null means p is offline
            if (p != null) p.sendMessage(msg);
        }
    }

    
    public static void __notifyBaseComponents(List<BaseComponent[]> __base, String player){
        List<BaseComponent[]> _msgs = new ArrayList<BaseComponent[]>();
        final BaseComponent[] _line = new ComponentBuilder(ChatColor.BLUE+""+ChatColor.BOLD+""+ChatColor.STRIKETHROUGH+"-----------------------------------").create();

        _msgs.add(_line);
        for (BaseComponent[] _b : __base){
            _msgs.add(_b);
        }
        _msgs.add(_line);
        ProxiedPlayer _p = plugin.getProxy().getPlayer(player);
        for (BaseComponent[] msg : _msgs){
            // null means _p is offline
            if (_p != null) _p.sendMessage(msg);
        }
    }
}
