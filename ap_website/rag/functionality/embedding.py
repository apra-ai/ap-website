from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from langchain_qdrant import QdrantVectorStore
from langchain_huggingface import HuggingFaceEmbeddings

COLLECTION_NAME = "chunks"

def split_text_into_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=400,
        chunk_overlap=20,
        length_function=len,
        is_separator_regex=False,
    )
    chunks = text_splitter.create_documents([text])
    print("created Chunks")
    return chunks

def embedding(chunks):
    model_name = "all-mpnet-base-v2"
    model_kwargs = {'device': 'cpu'}
    encode_kwargs = {'normalize_embeddings': False}
    embedding_model = HuggingFaceEmbeddings(
        model_name=model_name,
        model_kwargs=model_kwargs,
        encode_kwargs=encode_kwargs
    )
    print("setup HuggingFaceEmbeddings")
    client = QdrantClient(path="qdrant.db")
    print("setup QdrantClient")
    client.create_collection(
        collection_name = COLLECTION_NAME,
        vectors_config = VectorParams(size=768, distance=Distance.COSINE)
    )
    print("setup QdrantClient collectio")
    vectore_store = QdrantVectorStore(
        client = client,
        collection_name = COLLECTION_NAME,
        embedding = embedding_model
    )
    print("setup QdrantVectorStore")
    #chunks into db
    texts = [d.page_content for d in chunks]
    #metadatas = [d.metadata for d in chunks]
    #vectore_store.add_texts(texts,metadatas=metadatas)
    vectore_store.add_texts(texts)
    print("store chunks in QdrantVectorStore")
