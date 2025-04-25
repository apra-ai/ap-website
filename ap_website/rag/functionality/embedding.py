from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from langchain_qdrant import QdrantVectorStore
from langchain_huggingface import HuggingFaceEmbeddings

COLLECTION_NAME = "chunks"
MODEL_NAME = "all-mpnet-base-v2"
MODEL_KWARGS = {'device': 'cpu'}
ENCODE_KWARGS = {'normalize_embeddings': False}

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
    embedding_model = HuggingFaceEmbeddings(
        model_name=MODEL_NAME,
        model_kwargs=MODEL_KWARGS,
        encode_kwargs=ENCODE_KWARGS
    )
    print("setup HuggingFaceEmbeddings")
    client = QdrantClient(path="qdrant.db")
    print("setup QdrantClient")

    # Wenn die Collection bereits existiert, wird der Name überprüft
    existing_collections = client.get_collections().collections
    if any(collection.name == COLLECTION_NAME for collection in existing_collections):
        print(f"Collection '{COLLECTION_NAME}' existiert bereits. Sie wird gelöscht.")
        # Schritt 2: Löschen der Collection
        client.delete_collection(collection_name=COLLECTION_NAME)
    
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

def load_db():
    embedding_model = HuggingFaceEmbeddings(
        model_name=MODEL_NAME,
        model_kwargs=MODEL_KWARGS,
        encode_kwargs=ENCODE_KWARGS
    )
    print("setup HuggingFaceEmbeddings")
    client = QdrantClient(path="qdrant.db")
    print("setup QdrantClient")
    vectore_store = QdrantVectorStore(
        client = client,
        collection_name = COLLECTION_NAME,
        embedding = embedding_model 
    )
    print("setup QdrantVectorStore")

    return vectore_store

def similarity_search(vectore_store, text, number_results):
    similaritys = vectore_store.similarity_search_with_relevance_scores(text, k=number_results)
    print("similarity search")
    return similaritys