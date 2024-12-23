"""
Running on search.shishijifes.com
"""
import torch
import MeCab
import numpy as np
import pickle
import os
import json
import sqlite3
import jaconv
import ssl
import pandas as pd

from MCFormat import mc_formatTEXT
from transformers import BertModel, BertTokenizer, GPT2Tokenizer
from flashtext import KeywordProcessor
from flask import Flask, request, jsonify
from flask_cors import CORS


articles = []
app = Flask(__name__)
conn = sqlite3.connect("./.db/wnjpn.db", check_same_thread=False)
qee = 'SELECT synset,lemma FROM sense,word USING (wordid) WHERE sense.lang="jpn"'
sense_word = pd.read_sql(qee, conn)
synlink_query = "SELECT synset1 AS synset, synset2 AS related_synset, link FROM synlink"
synlink = pd.read_sql(synlink_query, conn)
CORS(app)


class SearchEngine:
    def __init__(self, articles: list[str]=None, embeddings_file: str=None):
        self.tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
        self.model = BertModel.from_pretrained("bert-base-uncased")
        self.keyword_processor = KeywordProcessor()
        self.tagger = MeCab.Tagger()
        
        if embeddings_file:
            self.load_embeddings(embeddings_file)
        elif articles:
            self.articles = articles
            self.article_embeddings = self.compute_embeddings(articles)
            self.save_embeddings("./.pickle/mapObjEmbeddings.pkl")
        else:
            raise ValueError("Either articles or embeddings_file must be provided.")
    

    def compute_embeddings(self, articles: list[str]):
        embeddings = []
        for article in articles:
            self.keyword_processor.add_keyword(article["name"])
            tokens = self.tokenizer(article["article"], return_tensors="pt", truncation=True, padding=True, max_length=512, clean_up_tokenization_spaces=True)
            with torch.no_grad():
                output = self.model(**tokens)
            embeddings.append(output.last_hidden_state.mean(dim=1).squeeze().numpy())
        return embeddings


    def save_embeddings(self, file_path: str):
        with open(file_path, "wb") as f:
            pickle.dump((self.articles, self.article_embeddings), f)
    

    def load_embeddings(self, file_path: str):
        with open(file_path, "rb") as f:
            self.articles, self.article_embeddings = pickle.load(f)
            for article in self.articles:
                self.keyword_processor.add_keyword(article["name"])

    
    def get_query_embedding(self, query):
        query_tokens = self.tokenizer(query, return_tensors="pt", truncation=True, padding=True, max_length=512, clean_up_tokenization_spaces=True)
        with torch.no_grad():
            query_embedding = self.model(**query_tokens).last_hidden_state.mean(dim=1).squeeze().numpy()
        return query_embedding
    

    def calculate_similarity(self, query_embedding):
        similarities = [0.5 * (np.dot(query_embedding, article_emb) / (np.linalg.norm(query_embedding) * np.linalg.norm(article_emb))) for article_emb in self.article_embeddings]
        return similarities


    def get_synonyms(self, word):
        synsets = sense_word.loc[sense_word.lemma == word, "synset"]

        synset_words = set(sense_word.loc[sense_word.synset.isin(synsets), "lemma"])

        if word in synset_words:
            synset_words.remove(word)

        return list(synset_words)
    

    def get_related_words(self, word):
        related_words = set()

        synsets = sense_word[sense_word['lemma'] == word]['synset']
        synset_words = set(sense_word[sense_word['synset'].isin(synsets)]['lemma'])

        related_words.update(synset_words)
        
        for synset in synsets:
            hypernyms = synlink[(synlink['synset'] == synset) & (synlink['link'] == 'hype')]['related_synset']
            hypernym_words = set(sense_word[sense_word['synset'].isin(hypernyms)]['lemma'])
            related_words.update(hypernym_words)

            hyponyms = synlink[(synlink['synset'] == synset) & (synlink['link'] == 'hypo')]['related_synset']
            hyponym_words = set(sense_word[sense_word['synset'].isin(hyponyms)]['lemma'])
            related_words.update(hyponym_words)
        
        if word in related_words:
            related_words.remove(word)
        
        return list(related_words)
    

    def hiragana_to_kanji(self, word):
        node = self.tagger.parseToNode(word)
        kanji_candidates = set()

        while node:
            if node.feature.split(",")[0] != "BOS/EOS":
                kanji_word = node.surface
                kanji_candidates.add(kanji_word)
            node = node.next

        return kanji_candidates
    

    def search(self, query):
        query_embedding = self.get_query_embedding(query)
        similarities = self.calculate_similarity(query_embedding)

        keywords_found = self.keyword_processor.extract_keywords(query)
        node = self.tagger.parseToNode(query)
        mecab_keywords = []
        while node:
            if node.feature.split(",")[0] != "BOS/EOS":
                mecab_keywords.append(node.surface)
            node = node.next

        related_keywords = set()
        for keyword in mecab_keywords:
            related_keywords.update(self.get_related_words(keyword))

        all_search_keywords = set(mecab_keywords) | set(related_keywords)
        
        results = []
        for i, article in enumerate(self.articles):
            score = similarities[i]
            has_non_vector_score = False
            for keyword in keywords_found:
                if keyword in article["name"]:
                    score += 1
                    has_non_vector_score = True
            for keyword in all_search_keywords:
                if keyword in article["article"] or keyword in article["name"]:
                    score += 0.1
                    has_non_vector_score = True
            
            if len(query) <= 5:
                for char in query:
                    if char in article["article"] or char in article["name"]:
                        score += 0.1
                        has_non_vector_score = True
                        
            if has_non_vector_score:
                results.append((article["name"], score))
        
        results = sorted(results, key=lambda x: x[1], reverse=True)
        return [result[0] for result in results]



def setArticle():
    text_articles = {}
    floor_cors = {
        "1F": "一階 1階 １階",
        "2F": "二階 2階 ２階",
        "3F": "三階 3階 ３階",
        "4F": "四階 4階 ４階",
        "B1": "地下一階 地下1階 地下１階"
    }
    with open("./.pickle/mapobjContents.json", "r", encoding="utf-8_sig") as f:
        text_articles = json.load(f)
    G = "./resources/map-objects/"
    fps = os.listdir("./resources/map-objects/")
    for fp in fps:
        if fp.endswith("static"): continue
        data = {}
        with open(G+fp, "r", encoding="utf-8_sig") as f:
            t = f.read()
            if len(t) < 20:
                continue
            data = json.loads(t)
        darticle = data["article"]
        contentTEXT = text_articles[data["discriminator"]]
        articles.append({
            "article": " ".join([
                contentTEXT,
                darticle["title"],
                darticle["subtitle"],
                darticle["venue"],
                data["object"]["floor"],
                floor_cors[data["object"]["floor"]],
                data["discriminator"]
            ]),
            "name": data["discriminator"]
        })
    SearchEngine(articles=articles)


def main():
    search_engine = SearchEngine(embeddings_file="./.pickle/mapObjEmbeddings.pkl")

    @app.route("/do", methods=["POST", "GET"])
    def search():
        query = request.json.get("query")
        results = search_engine.search(query)

        alqs = []
        with open("./.data/search/queries.json", "r", encoding="utf-8") as f:
            alqs = json.load(f)
        alqs.append(query)
        with open("./.data/search/queries.json", "w", encoding="utf-8") as f:
            json.dump(alqs, f, indent=4, ensure_ascii=False)

        return jsonify(results)

    context = ssl.SSLContext(ssl.PROTOCOL_TLS)
    context.load_cert_chain(certfile="./.cert/search/cert.pem", keyfile="./.cert/search/privkey.pem")
    
    #app.run(port=443, ssl_context=context, debug=False, host="160.251.211.131")
    
    app.run(host="0.0.0.0", port=5000)


if __name__ == "__main__":
    main()
