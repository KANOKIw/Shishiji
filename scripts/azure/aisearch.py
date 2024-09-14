import os
import json
import openai
from azure.core.credentials import AzureKeyCredential  
from azure.search.documents import SearchClient
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.models import Vector
from azure.search.documents.indexes.models import (
    SearchIndex,
    SearchField,
    SearchFieldDataType,
    SimpleField,
    SearchableField,
    SearchIndex,
    SemanticConfiguration,
    PrioritizedFields,
    SemanticField,
    SearchField,
    SemanticSettings,
    VectorSearch,
    VectorSearchAlgorithmConfiguration,
)

search_endpoint = os.environ['SEARCH_ENDPOINT']
search_credential = AzureKeyCredential(os.environ['SEARCH_API_KEY'])
index_name = '<your-index-name>'
openai.api_type = 'azure'  
openai.api_key = os.getenv('OPENAI_API_KEY')  
openai.api_base = os.getenv('OPENAI_API_BASE')  
openai.api_version = '2023-05-15'

with open('<your-data-folder>/text-sample.json', 'r', encoding='utf-8') as file:
    documents = json.load(file)

def generate_embeddings(text):
    response = openai.Embedding.create(
        input=text,
        engine='<your-deployment-name>'
    )
    embeddings = response['data'][0]['embedding']
    return embeddings

for document in documents:
    title = document['title']
    content = document['content']
    title_embeddings = generate_embeddings(title)
    content_embeddings = generate_embeddings(content)
    document['titleVector'] = title_embeddings
    document['contentVector'] = content_embeddings


with open('<your-data-folder>/text-sample-with-vector.json', 'w') as f:
    json.dump(documents, f)
