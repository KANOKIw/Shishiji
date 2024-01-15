import subprocess
import json
import discord
import datetime
import requests
import asyncio
import time
import zipfile
import os
import sys
import aiofiles
import datetime
import http.server
import threading

from mcrcon import MCRcon
from colorama import Fore
from discord import Client, Intents, app_commands, Interaction
from discord.ext import commands


config_path = "./protocol.config.cnf"
token = "MTEyNzk4NjE0OTc3Njk0OTMwOQ.GRDYTX.vdviRdXXG7aS9VBP5rI_6XBNXjv06hD65ZrT8s"
jar_exited = False
PORT = 22312

with open(config_path) as f:
    config = json.load(f)


bat_path_Bungee = config["bat_path_Bungee"]
__servers__ = config["servers"]
__started_file__ = __file__
__processes__ = []


console_channel_id = int(config["console_channel_id"])
not_again = False
negative_decoration_list = [
    '[Server thread/INFO]: Unknown command. Type "/help" for help.',
    "[Server thread/WARN",
    "[Spigot Watchdog Thread/ERROR",
    "[Netty Server IO",
    "[ServerMain/WARN"
]
positive_decoration_list = [
    "[Server thread/INFO]: Done",
    "[User Authenticator",
    "[Server thread/INFO]: -------- World Settings",
    "[nioEventLoopGroup",
    "[defaultEventLoopGroup",
    "[Geyser Spigot connection thread"
]
need_parmission_command_list = [
    "stop",
    "ban"
]


for server in __servers__:
    try:
        with open(bat_path_Bungee) as f:
            pass
    except FileNotFoundError:
        sys.exit(f"{Fore.RED}Couldn't find {bat_path_Bungee}, must be a relative path")


try:
    with open("./server - main/logs/latest.log", "w") as f:
        f.write("")
except FileNotFoundError:
    pass


class Coturnix(Client):
    def __init__(self, *, intents: Intents):
        super().__init__(intents=intents)
        self.tree = app_commands.CommandTree(self)

    async def setup_hook(self) -> None:
        """ This is called when the bot boots, to setup the global commands """
        await self.tree.sync()


def current_time(year: bool=False) -> str:
    timestr = datetime.datetime.now().replace(microsecond=0)
    timestr = timestr + datetime.timedelta(hours=7)
    if not year:
        return f'[{str(timestr).replace("2023-", "")}] '
    else:
        return f'[{str(timestr)}] '


# not working:(
def _log_into_diff_decorator(logs, console: bool=False):
    """ almost same as _log_into_diff_decorator """
    if len(logs) < 1:
        return "" if console else "- No returns"
    res = "\n"
    for log in logs.split('\n'):
        for nlog in negative_decoration_list:
            if nlog in log:
                log = f"- {log}"
        for plog in positive_decoration_list:
            if plog in log:
                log = f"+ {log}"
        res = res.join([res, log])
    return res


def get_thread() -> str:
    """ return with yeilds """
    _l = datetime.datetime.now()
    yield _l.strftime("[%H:%M:%S]")
    h, m, s = _l.hour, _l.minute, _l.second -1
    if s == -1:
        s = 59
        if m -1 == -1: h, m = h -1, m -1
        else: m -= 1
    if h < 10: h = f"0{h}"
    if m < 10: m = f"0{m}"
    if s < 10: s = f"0{s}"
    yield f"[{h}:{m}:{s}]"
    h, m, s = _l.hour, _l.minute, _l.second -2
    if s < 0:
        s = 59 if s == -1 else 58
        if m -1 == -1: h, m = h -1, m -1
        else: m -= 1
    if h < 10: h = f"0{h}"
    if m < 10: m = f"0{m}"
    if s < 10: s = f"0{s}"
    yield f"[{h}:{m}:{s}]"


def log_into_diff_decorator(log: str, console: bool=False):
    """ compare with nlog and plog """
    if len(log) < 1:
        return "" if console else "- No returns"
    tm = [t for t in get_thread()]
    for nlog in negative_decoration_list:
        for t in tm:
            _log = f"{t} {nlog}"
            if _log in log: log = log.replace(_log, f"- {t} {nlog}")
    for plog in positive_decoration_list:
        for t in tm:
            _log = f"{t} {plog}"
            if _log in log: log = log.replace(_log, f"+ {t} {plog}")
    return log


def into_diff(content):
    return f"```diff\n{content}\n```"


def start_http(port: int, *args):
    server_address = ('', port)
    httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)
    print(f"HTTPserver has started on port: {port}")
    httpd.serve_forever()


class HowtoJoinEmbedButton(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)
        self.add_item(discord.ui.Button(label="サーバーの入り方", url="http://coturnixbot.html.xdomain.jp/"))


intents = discord.Intents.all()
client = commands.Bot(command_prefix="!", intents=intents)
globIP = requests.get("https://ifconfig.me").text



@client.event
async def on_ready():
    print(f"{Fore.GREEN}MIT - Coturnix is now available!!{Fore.RESET}")

    global globIP
    global not_again

    channel = client.get_channel(1127592083398611054)           # MITマインクラフト/#サーバー詳細
    message = await channel.fetch_message(1127999883656302622)
    embed = discord.Embed(title="MITマイクラサーバー", description="オンライン", color=0x32cd32)
    embed.add_field(name="サーバーアドレス", value=f"**mitminecraft.f5.si**\n※統合版のポート番号: 19132\nサーバー状態: :green_circle:")
    embed.set_thumbnail(url="https://cdn.discordapp.com/attachments/1101399574897250376/1127589338369228812/MOJANG.gif")

    await message.edit(content="[ @everyone ]", embed=embed, view=HowtoJoinEmbedButton())
    print(f"{Fore.BLUE}discord setup done. continuing subprocessing...{Fore.RESET}")
    print(f"⚠{Fore.LIGHTRED_EX}to terminate, please kill {bat_path_Bungee}.{Fore.RESET}⚠")

    async def before_exit():
        global jar_exited
        global globIP
        global __processes__
        
        channel = client.get_channel(1127592083398611054)
        message = await channel.fetch_message(1127999883656302622)

        embed = discord.Embed(title="MITマイクラサーバー", description="オフライン", color=0xb22222)
        embed.add_field(name="サーバーアドレス", value=f"**mitminecraft.f5.si**\n※統合版のポート番号: 19132\nサーバー状態: :octagonal_sign:")
        embed.set_thumbnail(url="https://cdn.discordapp.com/attachments/1101399574897250376/1127589338369228812/MOJANG.gif")

        await message.edit(content="[ @everyone ]", embed=embed, view=HowtoJoinEmbedButton())

        jar_exited = True
        sys.exit()

    async def run_Bungee():
        os.chdir(os.path.dirname(os.path.abspath(__started_file__)))
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        bat_process = await asyncio.create_subprocess_exec(
            os.path.basename(bat_path_Bungee)
        )
        return_code = await bat_process.wait()
        print(f"{Fore.RED}{bat_path_Bungee} teminated.{Fore.RESET}")

    async def run_server(__path: str):
        global __processes__
        print(f"{Fore.GREEN}running {Fore.RESET}{__path} 'asyncio'")
        os.chdir(os.path.dirname(os.path.abspath(__started_file__)))
        os.chdir(os.path.dirname(os.path.abspath(__path)))
        jar_process = await asyncio.create_subprocess_exec(
            "java", "-jar", os.path.basename(__path),
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )   # PIPE due to async functions
        __processes__.append(jar_process)
        os.chdir(os.path.dirname(os.path.abspath(__started_file__)))
        return_code = await jar_process.wait()
        print(f"{Fore.RED}{__path} teminated.(return_code: {return_code}){Fore.RESET}")

    async def exit_self():
        global jar_exited
        while True:
            if jar_exited: sys.exit()
            await asyncio.sleep(1)

    async def console_log():
        global console_channel_id
        global bat_path_Bungee
        channel = client.get_channel(console_channel_id)       # MITマインクラフト/#console
        previous_content = ""
        last_log_message = await channel.send(into_diff(f"+ New server started at: {current_time(year=True)}\n- logs are no longer available!(due to a BungeeCord Server)..."))
        return
        while True:
            try:
                with open(config_path, "r") as f:
                    config = json.load(f)
                    bat_path_Bungee = config["bat_path_Bungee"]
                    if console_channel_id != int(config["console_channel_id"]):
                        console_channel_id = int(config["console_channel_id"])
                        previous_channel = channel
                        channel = client.get_channel(console_channel_id)
                        last_log_message = await channel.send(into_diff(f"+ Changed console channel from {previous_channel.guild.name}/#{previous_channel.name}: {current_time(year=True)}\n+ -----------------------..."))
                os.chdir(os.path.dirname(os.path.abspath(__started_file__)))
                with open("./servers/super-flat/logs/latest.log", "r", encoding="Shift_JIS") as f:
                    content = f.read()
                    if content != previous_content and previous_content in content:        # not to get late limited
                        last_log_message_content = last_log_message.content
                        _content = content.replace((previous_content), "").strip()  # del indention
                        _content = log_into_diff_decorator(log=_content, console=True)
                        _content = last_log_message_content[7:-3] + _content        # del discord diff decorator
                        repeat = int(len(_content)/1980) +2                         # discord text max lengh: 2000
                        if repeat <= 2: last_log_message = await last_log_message.edit(content=into_diff(_content))
                        else:
                            for num in range(1, repeat):
                                try:
                                    message_content = _content[1980*(num -1):1980*num]
                                except IndexError:
                                    message_content = _content[1980*(num -1):]
                                if num == 1:
                                    last_log_message = await last_log_message.edit(content=into_diff(message_content))
                                else:
                                    last_log_message = await channel.send(content=into_diff(message_content))
                    previous_content = content
            except Exception as e: print(e.__class__ + ": " + e)

            await asyncio.sleep(1)
    try:
        server_thread = threading.Thread(target=start_http, args=(PORT,), daemon=True)
        server_thread.daemon = True
        server_thread.start()
        Bungee_process = asyncio.create_task(run_Bungee())
        for server in __servers__:
            asyncio.create_task(run_server(server))

        #consoleloop = asyncio.create_task(console_log())
        exitloop = asyncio.create_task(exit_self())
        await asyncio.wait_for(Bungee_process, timeout=None)
        #consoleloop.cancel()
        await before_exit()
    except RuntimeError:
        print(f"{Fore.LIGHTRED_EX}Close the Spigot Servers before exit.{Fore.RESET}\nDon't kill me, your servers world don't be saved.")


@client.event
async def on_message(message: discord.Message):
    role = client.get_guild(1127590026281230356).get_role(1127590580910829608)
    allowed_user = False
    try:
        global console_channel_id
        global need_parmission_command_list
        if message.channel.id != console_channel_id or role not in message.author.roles or message.content[0] == ".":
            return
        for command in need_parmission_command_list:
            if command in message.content:
                _l = [client.get_emoji(1128343327264231525), client.get_emoji(1128664486044250204)]
                for emoji in _l:
                    await message.add_reaction(emoji)
                    await asyncio.sleep(1)
                await message.delete()
                return
        allowed_user = True
        server_address = globIP
        server_pass = "Coturnix"
        server_port = 25575
        command = message.content
        with MCRcon(server_address, server_pass, server_port) as mcr:
            log = mcr.command(command)
            with open("./logs/latest.log", "a", encoding="Shift_JIS") as f:
                nick = message.author.nick
                if not nick: nick = message.author.global_name
                r = f"+ [Discord: {message.channel.guild.name}/#{message.channel.name}]: {command} from {message.channel.name} by @{nick}"
                f.write(f"{r}\n{log}\n")
            await message.delete()
    except Exception as e:
        if allowed_user:
            try:
                with MCRcon("localhost", server_pass, server_port) as mcr:
                    log = "+ " + mcr.command(command)
                    with open("./logs/latest.log", "a", encoding="Shift_JIS") as f:
                        nick = message.author.nick
                        if not nick: nick = message.author.global_name
                        r = f"+ [Discord: {message.channel.guild.name}/#{message.channel.name}]: {command} from {message.channel.name} by @{nick}"
                        f.write(f"{r}\n{log}\n")
                    await message.delete()
            except Exception as e:print(e)


@client.tree.command()
async def cmd(interaction: Interaction, command: str):
    """ run command and responses with command returns """

    print(f"{current_time()}{Fore.YELLOW}/cmd command={command}{Fore.RESET} by {Fore.GREEN}{interaction.user.global_name}{Fore.RESET}")

    server_address = globIP
    server_pass = "Coturnix"
    server_port = 25575

    role = client.get_guild(1127590026281230356).get_role(1127590580910829608)
    if interaction.guild.id != 1127590026281230356 or role not in interaction.user.roles:
        await interaction.response.send_message(f"```diff\n+ returns\n- [Coturnix] something went wrong.\n```", ephemeral=True)
        return
    
    try:
        with MCRcon(server_address, server_pass, server_port) as mcr:
            log = mcr.command(command)
            await interaction.response.send_message(f"```diff\n+ returns\n{log_into_diff_decorator(log=log)}\n```")
    except Exception as e:
        try:
            with MCRcon("localhost", server_pass, server_port) as mcr:
                log = mcr.command(command)
                await interaction.response.send_message(f"```diff\n+ returns\n{log_into_diff_decorator(log=log)}\n```")
        except Exception as e:
            await interaction.response.send_message(f"```diff\n+ returns\n{log_into_diff_decorator(log=log)}\n```")


@client.tree.command()
async def uploadfile(interaction: Interaction, message_id: str, folderpath_to_upload: str):
    """ upload file to MIT server (supports all file type)

    message_id: :class:`str`
        message id of a message with a file attached
    folderpath_to_upload: :class:`str`
        example: ./datapacks/ >>> last slash is required
    """

    print(f"{current_time()}{Fore.YELLOW}/setup content={message_id}{Fore.RESET} by {Fore.GREEN}{interaction.user.global_name}{Fore.RESET}")

    role = client.get_guild(1127590026281230356).get_role(1127590580910829608)
    if interaction.guild.id != 1127590026281230356 or role not in interaction.user.roles:
        await interaction.response.send_message(f"```diff\n+ returns\n- [Coturnix] something went wrong.\n```", ephemeral=True)
        return

    try:
        message = await interaction.channel.fetch_message(int(message_id))
        file = message.attachments[0]
        filename = file.filename
        fp = folderpath_to_upload + filename
        await file.save(fp)
        if filename.endswith(".zip"):
            with zipfile.ZipFile(fp, 'r') as zip_ref:
                fp_extractall = fp.replace(".zip", "")
                try:
                    with open(fp_extractall):
                        os.remove(fp_extractall)
                except Exception:...
                zip_ref.extractall(fp_extractall)
            os.remove(fp)
        await interaction.response.send_message(f"Succesfully uploaded to `{fp_extractall}`")
    except Exception:
        await interaction.response.send_message("`invailed message format/path`")



@client.tree.command()
async def setup(interaction: Interaction, content: str):
    """ is temporary available """

    print(f"{current_time()}{Fore.YELLOW}/setup content={content}{Fore.RESET} by {Fore.GREEN}{interaction.user.global_name}{Fore.RESET}")

    role = client.get_guild(1127590026281230356).get_role(1127590580910829608)
    if interaction.guild.id != 1127590026281230356 or role not in interaction.user.roles:
        await interaction.response.send_message(f"```diff\n+ return\n- [Coturnix] something went wrong.\n```", ephemeral=True)
        return

    await interaction.channel.send(content)
    await interaction.response.send_message(f"+", ephemeral=True)



if __name__ == "__main__":
    client.run(token)
