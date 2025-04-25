from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
# Create your views here.

@api_view(["POST",])
def file(request):
    content = request.data.get("content", "")
    print("Empfangenes PDF:", content[:200])  # Nur ein Teil zum Testen
    return Response({"message": "PDF send!", "length": len(content)}, status=status.HTTP_200_OK)