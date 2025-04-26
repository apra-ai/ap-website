from django.urls import re_path
from . import views

urlpatterns = [
    re_path(r"file/", views.file),
    re_path(r"query/", views.check_similarity)
]