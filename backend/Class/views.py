from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Class, JoinRequest, Post, Comment
from .serializers import ClassSerializer, PostSerializer, CommentSerializer

# Create your views here.
class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

    @action(detail=True, methods=['post'], url_path='accept-join-request')
    def accept_join_request(self, request, pk=None):
        join_request_id = request.data.get('join_request_id')
        try:
            join_request = JoinRequest.objects.get(id=join_request_id, class_instance_id=pk, is_accepted=False)
            join_request.is_accepted = True
            join_request.save()

            join_request.class_instance.students.add(join_request.student)

            return Response({'message': 'Join request accepted'}, status=status.HTTP_200_OK)
        except JoinRequest.DoesNotExist:
            return Response({'message': 'Invalid join request'}, status=status.HTTP_400_BAD_REQUEST)
        
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer