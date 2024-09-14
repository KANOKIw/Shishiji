import numpy as np
import pickle
import torch
import os
import json

from transformers import BertTokenizer, BertModel
from MCFormat import mc_formatTEXT


tokenizer = BertTokenizer.from_pretrained("bert-base-multilingual-cased")
model = BertModel.from_pretrained("bert-base-multilingual-cased")
doc_vectors = []
discs = []


def getMapObjects():
    mapobjects = []
    mapobjcontents = {}
    files = os.listdir("./resources/map-objects/")

    with open("./.pickle/mapobjContents.json", "r", encoding="utf-8_sig") as f:
        mapobjcontents = json.loads(f.read())

    for fn in files:
        if fn.endswith("static"): continue
        objdat = { }
        with open("./resources/map-objects/"+fn, "r", encoding="utf-8_sig") as f:
            objdat = json.loads(f.read())
            if len(str(objdat)) < 20: continue

        if mapobjcontents.get(objdat["discriminator"], None):
            objdat["article"]["content"] = mapobjcontents[objdat["discriminator"]]
        mapobjects.append({ "disc": objdat["discriminator"], "data": objdat })
    return mapobjects


def encode_(*string):
    combined_text = " ".join(string)
    inputs = tokenizer(combined_text, return_tensors="pt", truncation=False, padding=False)
    input_ids = inputs["input_ids"]

    chunk_size = 512
    num_chunks = (input_ids.size(1) + chunk_size - 1) // chunk_size
    chunks = [input_ids[:, i*chunk_size:(i+1)*chunk_size] for i in range(num_chunks)]

    embeddings = []
    for chunk in chunks:
        with torch.no_grad():
            outputs = model(chunk)
        embeddings.append(outputs.last_hidden_state)

    combined_embedding = torch.cat(embeddings, dim=1)
    return combined_embedding.mean(dim=1).numpy()


def toJsonFile(picklefp: str, outfp: str):
    with open(picklefp, "rb") as f:
        content_vectors, discs = pickle.load(f)

    doc_vectors_list = content_vectors.tolist()

    data = {
        "vectors": doc_vectors_list,
        "discs": discs
    }

    with open(outfp, "w") as f:
        json.dump(data, f)


def main():
    for entry in getMapObjects():
        discs.append(entry["disc"])
        rldata = entry["data"]
        vector_dat = [
            rldata["article"]["content"],
            rldata["article"]["title"],
            rldata["article"]["core_grade"],
            rldata["article"]["venue"],
            rldata["object"]["floor"],
        ]
        doc_vectors.append(encode_(*vector_dat).flatten())


    with open("./.pickle/mapObjEmbeddings.pkl", "wb") as f:
        pickle.dump((np.array(doc_vectors), discs), f)

    toJsonFile("./.pickle/mapObjEmbeddings.pkl", "./.pickle/mapObjEmbeddings.json")
    

main()
