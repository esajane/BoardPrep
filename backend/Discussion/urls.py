from django.urls import path

from .views import CreatePost

urlpatterns = [
    path('create/forum',CreatePost.as_view(), name='create_forum'),
]
