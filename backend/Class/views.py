from django.shortcuts import render
from django.utils import timezone
from django.http import StreamingHttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Class, JoinRequest, Post, Comment, Activity, Submission, Attachment
from User.models import Student
from .serializers import ClassSerializer, PostSerializer, CommentSerializer, JoinRequestSerializer, ActivitySerializer, SubmissionSerializer, AttachmentSerializer

# Create your views here.
class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        teacher_id = self.request.query_params.get('teacher_id')
        student_id = self.request.query_params.get('student_id')

        if teacher_id is not None:
            try:
                queryset = queryset.filter(teacher=teacher_id)
            except ValueError:
                queryset = queryset.none()
        
        if student_id is not None:
            try:
                queryset = queryset.filter(students__user_name=student_id)
            except ValueError:
                queryset = queryset.none()

        return queryset

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

    def create(self, request, *args, **kwargs):
        class_code = request.data.get('class_code')
        student_id = request.data.get('student')

        try:
            class_instance = Class.objects.get(classCode=class_code)
            student = Student.objects.get(user_name=student_id)
        except (Class.DoesNotExist, Student.DoesNotExist):
            return Response({'error': 'Invalid class code or student ID'},
                            status=status.HTTP_400_BAD_REQUEST)

        join_request = JoinRequest.objects.create(
            class_instance=class_instance,
            student=student,
            is_accepted=False
        )
        
        serializer = self.get_serializer(join_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

    def update_activity_statuses(self, queryset):
        current_date = timezone.now()
        for activity in queryset:
            updated = False
            if current_date >= activity.due_date:
                activity.status = 'Completed'
                updated = True
            elif current_date >= activity.start_date:
                activity.status = 'In Progress'
                updated = True
            if updated:
                activity.save(update_fields=['status'])
    
    def get_queryset(self):
        queryset = super().get_queryset()
        class_id = self.request.query_params.get('class_id')
        if class_id is not None:
            try:
                class_id = int(class_id)
                queryset = queryset.filter(class_instance_id=class_id)
            except ValueError:
                queryset = queryset.none()
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        self.update_activity_statuses(queryset)
        return super(ActivityViewSet, self).list(request, *args, **kwargs)
    
class SubmissionViewSet(viewsets.ModelViewSet):
    serializer_class = SubmissionSerializer

    def get_queryset(self):
        queryset = Submission.objects.all()
        activity_id = self.request.query_params.get('activity_id')
        student_id = self.request.query_params.get('student_id')

        if activity_id:
            try:
                activity_id = int(activity_id)
                queryset = queryset.filter(activity_id=activity_id)
            except ValueError:
                queryset = queryset.none()

        if student_id:
            try:
                queryset = queryset.filter(student_id=student_id)
            except ValueError:
                queryset = queryset.none()

        return queryset

    
class AttachmentViewSet(viewsets.ModelViewSet):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        if instance.file:
            data = {
                'id': instance.id,
                'filename': instance.file.name,
                'path': instance.file.url,
                'user': instance.user.id
            }
        elif instance.link:
            data = {
                'id': instance.id,
                'title': serializer.data.get('title'),
                'favicon': serializer.data.get('favicon'),
                'url': instance.link,
                'user': instance.user.id
            }
        else:
            data = serializer.data

        return Response(data)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        attachment = self.get_object()
        if attachment.file:
            def file_iterator(file_name, chunk_size=8192):
                with open(file_name, 'rb') as file:
                    while True:
                        chunk = file.read(chunk_size)
                        if chunk:
                            yield chunk
                        else:
                            break
            response = StreamingHttpResponse(file_iterator(attachment.file.path))
            response['Content-Type'] = 'application/octet-stream'
            response['Content-Disposition'] = 'attachment; filename="{}"'.format(attachment.file.name)
            return response
        else:
            return Response({"error": "No file attached"}, status=status.HTTP_404_NOT_FOUND)