import string
import random
import threading
import httpx
import json

from typing import *


spam_url = "https://dev.kanokiw.com/api/test/spam"
responses: Sequence[Dict[str, str]] = []


def randomstr(length):
    chars = string.ascii_letters + string.digits
    rs = ''.join(random.choice(chars) for _ in range(length))
    return rs


def do_request():
    global responses
    randomstrs = [randomstr(32) for _ in range(200)]
    data = {}

    for i in range(1, len(randomstrs), 2):
        data[randomstrs[i]] = randomstrs[i-1]

    print(data)
    with httpx.Client() as client:
        res = client.post(
            spam_url, json=data, headers={ "method": "python" }
        )
        responses.append(res.json())
        with open(r".\\response.json", "w") as f:
            json.dump(responses, f, indent=4)


def main():
    threads = [ lambda: threading.Thread(target=do_request).start() for _ in range(10_000) ]

    for thread in threads:
        thread()

    for thread in threads:
        if hasattr(thread, "join"):
            thread.join()


if __name__ == "__main__":
    main()
