import time
import pyautogui


click_interval = 5

try:
    while True:
        pyautogui.click()
        
        time.sleep(click_interval)
except KeyboardInterrupt:
    pass
