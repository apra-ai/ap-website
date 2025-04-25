from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rag.functionality.embedding import split_text_into_chunks, embedding, similarity_search, load_db
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
    similaritys = similarity_search(vectore_store, query, 2)
    for similarity in similaritys:
        print(similarity[0].page_content, similarity[1])
    return Response({}, status=status.HTTP_200_OK)