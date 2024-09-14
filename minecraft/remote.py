import requests
import discord

from discord import app_commands, Client, Interaction, Intents


with open(".minecraft/bot_token.txt") as r:
    token = r.read()

class Coturnix(Client):
    def __init__(self, *, intents: Intents):
        super().__init__(intents=intents)
        self.tree = app_commands.CommandTree(self)

    async def setup_hook(self) -> None:
        await self.tree.sync()


client = Coturnix(intents=Intents.all())


@client.event
async def on_ready():
    print("ready")
    
@client.tree.command()
async def cmd(interaction: Interaction, command: str): ...

@client.tree.command()
async def uploadfile(interaction: Interaction, message_id: str, folderpath_to_upload: str): ...

@client.tree.command()
async def setup(interaction: Interaction, content: str): ...


if __name__ == "__main__":
    client.run(token)
