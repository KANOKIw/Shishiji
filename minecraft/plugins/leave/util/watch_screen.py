"""Watch Fortnite update"""
import time
import keyboard
import pyautogui as ag
import datetime
import playsound
import asyncio
import threading
import pygame

from colorama import Fore
from PIL import ImageGrab


previous_colors = []

def get_colors_for_region(top_left, bottom_right):
    screenshot = ImageGrab.grab(bbox=(top_left[0], top_left[1], bottom_right[0], bottom_right[1]))
    screenshot.save(f"./.screenshots/Latest.png")
    return list(screenshot.getdata())

def colors_changed(new_colors, previous_colors):
    if len(new_colors) != len(previous_colors):
        return True

    for new_color, prev_color in zip(new_colors, previous_colors):
        if new_color != prev_color:
            return True

    return False


if __name__ == "__main__":
    print("Point position 1 and press F12")
    keyboard.wait("F12")
    pos = ag.position()
    top_left = [pos.x, pos.y]
    print("Point position 2 and press F12")
    keyboard.wait("F12")
    pos = ag.position()
    bottom_right = [pos.x, pos.y]
    if top_left[0] > bottom_right[0]:
        top_left[0], bottom_right[0] = bottom_right[0], top_left[0]
    if top_left[1] > bottom_right[1]:
        top_left[1], bottom_right[1] = bottom_right[1], top_left[1]
    print(f"{Fore.GREEN}Detection started.{Fore.RESET}")
    while True:
        new_colors = get_colors_for_region(top_left, bottom_right)

        if colors_changed(new_colors, previous_colors) and previous_colors != []:
            print(f"{Fore.RED}Fortnite moved.{Fore.RESET}")
            pygame.init()
            pygame.mixer.init()
            pygame.mixer.music.load("./sounds/notify.mp3")
            pygame.mixer.music.play()

        previous_colors = new_colors
        time.sleep(1)
