from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rag.functionality.embedding import split_text_into_chunks, embedding
# Create your views here.

@api_view(["POST",])
def file(request):
    content = request.data.get("content", "")
    chunks = split_text_into_chunks(content)
    embedding(chunks)

    return Response({"message": "PDF send!", "length": len(content)}, status=status.HTTP_200_OK)
