from django.urls import path

from .views import CreatePost, GetPosts, CreateComment, GetComments, CreateLike, GetLikes

urlpatterns = [
    path('create/post/', CreatePost.as_view(), name='create_post'),
    path('get/post/', GetPosts.as_view(), name='get_post'),
    path('create/comment/', CreateComment.as_view(), name='create_comment'),
    path('get/comment/', GetComments.as_view(), name='get_comment'),
    path('create/like/', CreateLike.as_view(), name='create_like'),
    path('get/like/', GetLikes.as_view(), name='get_like'),
]
