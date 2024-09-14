import pyautogui as ag
import time
import keyboard
import random
import pyperclip as clipboard
import json
import asyncio
import re

from typing import *
from googletrans import Translator


def ElapsedTime(view: int=2):
    def wrapper(func: function):
        def _wrapper(*args, **kwargs):
            start = time.time()
            result = func(*args, **kwargs)
            end = time.time()
            print(f"Function '{func.__name__}' took {(end-start)*1000:.{view}f} milliseconds to execute.")
            return result
        return _wrapper
    return wrapper


class Coro: ...
class Loop: ...


class Event:
    cable = True
    translator = Translator()
    messages = [
        "example"
    ]


    def __init__(self) -> None:
        keyboard.add_hotkey("F12", Event.cancel)
        for path in ["./sushis.json", "./sentences.json"]:
            with open(path, encoding="utf-8") as f:
                js = json.load(f)
                try:
                    js = js[:2000]
                except IndexError:...
                self.messages.extend(js)


    def call(self) -> Loop:
        while True:
            # call
            self._run(ag.leftClick, 3400, 40)
            time.sleep(1.5)
            # study
            self._run(self.send, self.messages, c=random.randint(1, 4))
            time.sleep(2.0)
            # disconnect
            self._run(ag.leftClick, 3180, 220)
            time.sleep(0.3)
    
    
    def spam(self, slp: int | None = 1) -> Loop:
        while True:
            self._run(self.send, self.messages, c=2, cd=1.3)
            time.sleep(slp)


    async def _call(self) -> Loop:
        while True:
            # call
            await self._run_(ag.leftClick, 3400, 40)
            await asyncio.sleep(1.5)
            # study
            await self._run_(self.send, self.messages, c=random.randint(1, 4))
            await asyncio.sleep(2.0)
            # disconnect
            await self._run_(ag.leftClick, 3180, 220)
            await asyncio.sleep(0.3)
    
    
    async def _spam(self, slp: int | None = 1) -> Loop:
        while True:
            await self._run_(self.send, self.messages, c=2, cd=1.3)
            await asyncio.sleep(slp)


    async def delete(self) -> Loop:
        while True:
            await self._run_(
                lambda: (
                    keyboard.press("shift"), ag.moveTo(3455, 894), ag.leftClick(),
                    keyboard.press("shift"), ag.moveTo(3455, 849), ag.leftClick()
                )
            )
            await asyncio.sleep(0.5)


    @classmethod
    def cancel(cls) -> None:
        cls.cable = not cls.cable
        print(f"Macro was {'continued' if cls.cable else 'paused'}")


    @classmethod
    def _run(
            cls, function, *args, **kwargs
        ) -> None:
        if cls.cable:
            function(*args, **kwargs)
        else:
            keyboard.wait("F12")
            function(*args, **kwargs)

    
    @classmethod
    async def _run_(
            cls, function: function, *args, **kwargs
        ) -> None:
        if cls.cable:
            function(*args, **kwargs)
        else:
            keyboard.wait("F12")
            function(*args, **kwargs)


    @staticmethod
    def send(
            candidates: list,
            *,
            c: int | None = 1,
            cd: float | None = 0
        ) -> None:
        for _ in range(0, c):
            while True:
                k = candidates[random.randint(0, len(candidates)-1)]
                if not Event.isJa(k):
                    break
            k += f"\n   `翻訳: {Event.translator.translate(k, 'ja', 'en').text}`"
            Event._copy_paste(k)
            ag.press("Enter")
            time.sleep(cd)


    @staticmethod
    def _copy_paste(content: str) -> None:
        clipboard.copy(content)
        ag.hotkey("ctrl", "v")


    @staticmethod
    def isJa(string: str) -> bool:
        return bool(re.search("[ぁ-んァ-ン一-龥]", string))


    @staticmethod
    def isJa(string: str) -> bool:
        for char in string:
            if 0x3000 <= ord(char) <= 0x9FFF:
                return True
        return False
    

    @staticmethod
    def isFullyJa(string: str) -> bool:
        return all([bool(re.search(r"[ぁ-んァ-ン一-龥]", char)) for char in string])
    

    @staticmethod
    def isFullyJa(string: str) -> bool:
        return all([0x3000 <= ord(char) <= 0x9FFF for char in string])



if __name__ == "__main__":
    event = Event()
    Event.cable = False
    asyncio.run(event.delete())
