import json
import asyncio
import aiofiles


async def A():
    async with aiofiles.open("./.cache/OP/objects.json", encoding="UTF-8") as f:
        objectdata = json.loads(await f.read())

    for disc, data in objectdata.items():
        async with aiofiles.open(f"./resources/map-objects/{disc}.json", 'w', encoding="UTF-8") as f:
            await f.write(json.dumps(data, indent=4, ensure_ascii=False))


asyncio.run(A())
