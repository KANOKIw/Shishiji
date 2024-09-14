import pyautogui
import time


def scroll_wheel(*, steps=1, delay=0.1, scroll_up=True, trig=1):
    for _ in range(steps):
        pyautogui.scroll(trig if scroll_up else -trig)

scroll_wheel(steps=100*100, scroll_up=False, trig=250, delay=0.000001)
