import numpy as np
import pickle
import torch

from sklearn.metrics.pairwise import cosine_similarity
from transformers import BertTokenizer, BertModel
from BertVectorEncode import encode_


tokenizer = BertTokenizer.from_pretrained("bert-base-multilingual-cased")
model = BertModel.from_pretrained("bert-base-multilingual-cased")


with open("./.pickle/mapobject.pkl", "rb") as f:
    doc_vectors, ids = pickle.load(f)


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


def search(query):
    query_vector = encode_(query)
    cosine_similarities = cosine_similarity(doc_vectors, query_vector.reshape(1, -1))
    sorted_indices = np.argsort(cosine_similarities.flatten())[::-1]
    sorted_ids = [ids[i] for i in sorted_indices]
    return sorted_ids
