from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Class, JoinRequest, Post, Comment
from .serializers import ClassSerializer, PostSerializer, CommentSerializer, JoinRequestSerializer

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
    serializer_class = PostSerializer

    def get_queryset(self):
        queryset = Post.objects.all()
        class_id = self.request.query_params.get('class_id')
        try:
            class_id = int(class_id)
        except:
            return queryset.none()
        return queryset.filter(class_instance_id=class_id)
    
    def destroy(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({'message': 'Post Not Found!'}, status=status.HTTP_400_BAD_REQUEST)

        #if request.user.id != post.teacher_id:
        #    return Response({'message': 'Unauthorized!'}, status=status.HTTP_401_UNAUTHORIZED)

        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer

    def get_queryset(self):
        queryset = Comment.objects.all()
        post_id = self.request.query_params.get('post_id')
        try:
            post_id = int(post_id)
        except:
            return queryset.none()
        return queryset.filter(post_id=post_id)
    
    def destroy(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            comment = Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            return Response({'message': 'Comment Not Found!'}, status=status.HTTP_400_BAD_REQUEST)

        #if request.user.id != comment.teacher_id:
        #    return Response({'message': 'Unauthorized!'}, status=status.HTTP_401_UNAUTHORIZED)

        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class JoinRequestViewSet(viewsets.ModelViewSet):
    serializer_class = JoinRequestSerializer

    def get_queryset(self):
        queryset = JoinRequest.objects.all()
        class_id = self.request.query_params.get('class_id')
        try:
            class_id = int(class_id)
        except:
            return queryset.none()
        return queryset.filter(class_instance=class_id, is_accepted=False)