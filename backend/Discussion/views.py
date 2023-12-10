from django.shortcuts import render
from .serializers import PostSerializer, CommentSerializer, LikeSerializer
from .models import Post, Comment, Like
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status, permissions

class CreatePost(APIView):
    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=404)

class GetPosts(APIView):
    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=200)

class CreateComment(APIView):
    def post(self, request):
        print(request.data)
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        print(serializer.errors)
        return Response(serializer.errors, status=404)

class GetComments(APIView):
    def get(self, request):
        post_id = request.query_params.get('post')
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        comments = Comment.objects.filter(post=post)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CreateLike(APIView):
    def post(self, request):
        serializer = LikeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        print(serializer.errors)
        return Response(serializer.errors, status=404)

class GetLikes(APIView):
    def get(self, request):
        post_id = request.query_params.get('post')
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        likes = Like.objects.filter(post=post)
        serializer = LikeSerializer(likes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)