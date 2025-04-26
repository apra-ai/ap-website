from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rag.functionality.embedding import split_text_into_chunks, embedding, similarity_search, load_db
from transformers import pipeline
# Create your views here.

@api_view(["POST",])
def file(request):
    content = request.data.get("content", "")
    file_name = request.data.get("file_name", "")
    chunks = split_text_into_chunks(content)
    embedding(chunks)

    return Response({"message": "PDF send!", "length": len(content)}, status=status.HTTP_200_OK)

@api_view(["POST",])
def check_similarity(request):
    query = request.data.get("query", "")
    #query = "Whats the Semester of Alexander?"
    vectore_store = load_db()
    similaritys = similarity_search(vectore_store, query, 1)
    # for similarity in similaritys:
    #     print(similarity[0].page_content, similarity[1])

    # load model
    qa_model = pipeline('question-answering', model='distilbert-base-cased-distilled-squad')

    # generate answer
    result = qa_model(question=query, context=similaritys[0][0].page_content)
    print("Query:", query)
    print("Context:", similaritys[0][0].page_content)
    print("------------------------")
    print("Answer:", result['answer'])

    return Response({"message": result['answer']}, status=status.HTTP_200_OK)