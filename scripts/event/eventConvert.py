import json
import math


EVENT_DESCRIPTION_MAP = {}

eveachdetailcsv = ""
with open("./scripts/event/read.csv", "r", encoding="utf-8") as f:
    eveachdetailcsv = f.read()

descriptioncsv = ""
with open("./scripts/event/desc.csv", "r", encoding="utf-8") as f:
    descriptioncsv = f.read()


def getAllCSVRecords(csv: str):
    recordstr = csv.split("\n")
    records = [record.split(",") for record in recordstr]
    for record in records: yield record


def setupDescMap():
    for record in getAllCSVRecords(descriptioncsv):
        if len(record) < 6: continue
        name = record[3]
        desc = record[5].replace("\"", "")
        EVENT_DESCRIPTION_MAP[name] = desc


def readBandData():
    saves = []

    for record in getAllCSVRecords(eveachdetailcsv):
        if len(record) < 7: continue
        name = record[1]
        desc = EVENT_DESCRIPTION_MAP.get(name, "名前ミスんなや")
        musics = record[2].split("、")
        takes = int(math.ceil(float(record[3])))
        starts = record[6][:-1]

        saves.append({
            "name": name,
            "description": desc,
            "musics": musics,
            "takes": takes,
            "starts": starts
        })

    return saves


def readDanceData():
    saves = []

    for record in getAllCSVRecords(eveachdetailcsv):
        if len(record) < 7 or "MC" in record[1]: continue
        name = record[1]
        desc = EVENT_DESCRIPTION_MAP.get(name, "名前ミスんなや")
        musics = record[2].split("、")
        takes = int(math.ceil(float(record[3])))
        starts = record[9][:-1]
        
        saves.append({
            "name": name,
            "description": desc,
            "musics": musics,
            "takes": takes,
            "starts": starts
        })

    return saves


def loadMainConfig():
    we_all = {}
    with open("./.data/event/all.json", "r", encoding="utf-8") as f:
        we_all = json.load(f)
    return we_all


def saveMainConfig(we_all):
    with open("./.data/event/all.json", "w", encoding="utf-8") as f:
        json.dump(we_all, f, indent=4, ensure_ascii=False)
    return we_all


def bandMain():
    we_all = loadMainConfig()
        
    banddata = readBandData()

    for o in banddata: we_all["band"]["day1"].append(o)

    saveMainConfig(we_all)


def danceMain():
    we_all = loadMainConfig()
        
    dancedata = readDanceData()

    for o in dancedata: we_all["dance"]["day2"].append(o)

    saveMainConfig(we_all)
    

def setVote():
    we_all = loadMainConfig()
    
    names: list[str] = []
    for evd in [*we_all["dance"]["day1"], *we_all["dance"]["day2"]]:
        names.append(evd["name"]) if evd["name"] not in names else None
    we_all["dance"]["vote"] = names

    saveMainConfig(we_all)


def setVote_MISC():
    we_all = loadMainConfig()
    
    names: list[str] = []
    for evd in [ 
        *we_all["misc"]["武道場"]["day1"],
        *we_all["misc"]["武道場"]["day2"],
        *we_all["misc"]["放光館"]["day1"],
        *we_all["misc"]["放光館"]["day2"],
        *we_all["misc"]["修道館ホール"]["day1"],
        *we_all["misc"]["修道館ホール"]["day2"],
        *we_all["misc"]["校舎前"]["day1"],
        *we_all["misc"]["校舎前"]["day2"],
        ]:
        names.append(evd["name"]) if evd["name"] not in names else None
    we_all["misc"]["vote"] = names
    
    saveMainConfig(we_all)


if __name__ == "__main__":
    setupDescMap()
    
    with open("./.data/event/desc.json", "w", encoding="utf-8") as f:
        json.dump(EVENT_DESCRIPTION_MAP, f, ensure_ascii=False, indent=4)
    
    setVote_MISC()
