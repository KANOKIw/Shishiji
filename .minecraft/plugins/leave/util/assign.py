import requests

from typing import *

class Suffix:
    """Suffix of string"""

def fetch_url(
        url: str,
        *,
        isBytes: bool | None = True,
        extension: str | None = Suffix,
        path: str | None = "new",
        encoding: str | None = None,
        chunk_size: int | None = 8192
    ) -> List[bytes]:
    r"""Get content from `url` and save image or file which was fetched in `url`.
    Binary data is required.

    Parameters
    -----
    url: `str`
        The file location which you want to save
    extension: `str`
        File extension which will be saved.
        if `None`, will get the suffix of the url.
    path: `str`
        File path where you want to save to.
        if `None`, will be replaced to "new".
    chunk_size: `int`
        Chunk size of the data per read.
        Default is 8KB.
    
    Returns
    -----
    List[bytes] which is read per `chunk size`.

    Raises
    -----
    requests.exceptions.RequestException: Raises if the responce code doen't match `200`."""

    if isBytes and encoding:
        raise ValueError("binary mode doesn't take an encoding argument")

    res = requests.get(url, stream=True)
    path = path.replace("\\", "/").replace(r"\\", "/")
    chunks = []
    if extension == Suffix:
        extension = url[-url[::-1].find("."):]
    
    if res.status_code == 200:
        with open(rf".\\{path}{f'.{extension}' if '.' not in [char for char in path[-path[::-1].find('/'):]] else ''}", "wb" if isBytes else "w", encoding=encoding) as f:
            for ch in res.iter_content(chunk_size=chunk_size):
                f.write(ch)
                chunks.append(ch)
            else:
                return chunks
    else:
        raise requests.exceptions.RequestException(f"Failed to get responce from {url} with status code {res.status_code}")


if __name__ == "__main__":
    data = fetch_url("https://www.gstatic.com/youtube/img/promos/growth/eecc5b7c6d53a016ea79f28105d8ebac4f1215664e93580b11af2873b39c2f92_122x56.webp", extension=".png", path="yt_s")
