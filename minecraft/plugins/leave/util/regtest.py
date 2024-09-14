import re

from inspect import cleandoc
from colorama import Fore
from minecraft.plugins.leave.util.fetch import fetch_url


class Main:
    def __init__(self, text: str) -> None:
        self.text = text
    
    def parseLINK(self, text: str=None) -> str:
        if text:
            self.text = text
        regex = r"https?://[a-zA-Z0-9:#$&%()!?.=/\-\,\+\*\{}~\^\[\]]+"
        all = re.findall(regex, self.text)
        _url = []
        for url in all:
            if not url in _url:
                _url.append(url)
                self.text = self.text.replace(url, f"{Fore.LIGHTCYAN_EX}{url}{Fore.RESET}")
        return self.text
    
    def parsePATH_absolute(self, text: str=None) -> str:
        if text:
            self.text = text
        regex = r"C:/[a-zA-Z0-9:#$&%()!?.=/\-\,\+\{}~\^\[\]\\|]+"
        all = re.findall(regex, self.text)
        _path = []
        for path in all:
            if not path in _path:
                _path.append(path)
                self.text = self.text.replace(path, f"{Fore.YELLOW}{path}{Fore.RESET}")
        return self.text


if __name__ == '__main__':
    main = Main(cleandoc("""
                    https://www.google.com/search?q=speedtest&oq=spe&aqs=chrome.1.69i65j69i59j69i57j0i512j0i433i512j69i60l3.3776j0j4&sourceid=chrome&ie=UTF-8 www
                    https://www.youtube.com/watch?v=TrY6MA267sU&list=PL2XEHSyhzMWwFGAp9SgyLzr4waSda7wyv&index=1
                    C:/Users/KUMAN/AppData/Local/Programs/Python/=\Pyt|hon311/python.exe
                """))
    res = main.parsePATH_absolute(main.parseLINK())
    print(res)
