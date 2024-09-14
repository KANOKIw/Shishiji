import requests
from bs4 import BeautifulSoup


with open("./cana.html", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")


def download_image(url, save_path):
    try:
        cookies = {
            "_days_session": "31a3300bb980c4725a10e9a33b56b1f5",
            "uid": "oPvkLGWGozSdrvidBdhkAg",
            "_ga": "GA1.1.433441499.1703322420",
            "mode": "detail",
            "__gads": "ID=087ac95d68866c9b:T=1703322420:RT=1703324805:S=ALNI_MaEpKRuJWz_yaEDvvwBvzhCdCZyYA",
            "__gpi": "UID=00000cbe8040436f:T=1703322421:RT=1703324805:S=ALNI_Mauixchs0Crrw21GiTTbZucmMxHNA",
            "_ga_EKXF6SP7QS": "GS1.1.1703324805.2.0.1703324976.0.0.0"
        }
        res = requests.get(url, stream=True, cookies=cookies)
        res.raise_for_status()

        with open(save_path, "wb") as f:
            for ch in res.iter_content(chunk_size=8192):
                f.write(ch)
    except Exception:...


imgs = []
for img in soup.find_all("img"):
    src = img.get("src")

    if not "user_img" in str(img) or not src:
        continue
    
    imgs.append(src[-src[::-1].find("/"):-src[::-1].find("?")-1])
        
for i in range(len(imgs)):
    fn = imgs[i]
    download_image(f"https://30d.jp/stgakuen/13/photo/{i+1}/download", "./albums/grenlion/"+fn)

