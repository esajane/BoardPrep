from rest_framework import serializers
from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin
from .models import Class, Post, Comment, JoinRequest, Activity, Submission, Attachment
from Course.models import Course

from User.models import Teacher, Student
from User.serializers import StudentSerializer


class ClassSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    image = serializers.SerializerMethodField()
    teacher_name = serializers.SerializerMethodField()
    hasMocktest = serializers.SerializerMethodField()
    class Meta:
        model = Class
        fields = '__all__'
        extra_kwargs = {
            'classCode': {'required': False, 'read_only': True},
            'students': {'required': False}
        }
    
    def create(self, validated_data):
        validated_data.pop('students', None)
        new_class = Class.objects.create(**validated_data)
        return new_class
    
    def get_image(self, obj):
        return obj.course.image.url if obj.course.image else None
    
    def get_teacher_name(self, obj):
        return f'{obj.teacher.first_name} {obj.teacher.last_name}' if obj.teacher else None

    def get_hasMocktest(self, obj):
        return obj.has_mock_test()


class JoinRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = JoinRequest
        fields = '__all__'
    
class PostSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = '__all__'

    def get_teacher_name(self, obj):
        return f'{obj.teacher.first_name} {obj.teacher.last_name}' if obj.teacher else None

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    class Meta:
        model = Comment
        fields = '__all__'

    def get_user_name(self, obj):
        return f'{obj.user.first_name} {obj.user.last_name}' if obj.user else None

class ActivitySerializer(serializers.ModelSerializer):
    className = serializers.SerializerMethodField()
    attachments_details = serializers.SerializerMethodField()
    class Meta:
        model = Activity
        fields = '__all__'

    def get_className(self, obj):
        return obj.class_instance.className if obj.class_instance else None
    
    def get_attachments_details(self, obj):
        return AttachmentSerializer(obj.attachments.all(), many=True).data

class SubmissionSerializer(serializers.ModelSerializer):
    attachments_details = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Submission
        fields = '__all__'
    
    def get_attachments_details(self, obj):
        return AttachmentSerializer(obj.attachments.all(), many=True).data
    
    def get_student_name(self, obj):
        student = obj.student
        full_name = f"{student.first_name} {student.last_name}"
        return full_name

class AttachmentSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    favicon = serializers.SerializerMethodField()

    class Meta:
        model = Attachment
        fields = ['id', 'user', 'file', 'link', 'title', 'favicon']

    def get_title(self, obj):
        if obj.link:
            return get_site_info(obj.link)['title']
        if obj.file:
            return get_filename_from_path(obj.file.name)
        return None

    def get_favicon(self, obj):
        if obj.link:
            return get_site_info(obj.link)['favicon']
        return None
    
def get_site_info(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    title = soup.find('title').text if soup.find('title') else 'No title found'
    favicon = soup.find('link', rel='icon') or soup.find('link', rel='shortcut icon')
    favicon_url = urljoin(url, favicon['href']) if favicon and 'href' in favicon.attrs else 'No favicon found'

    return {'title': title, 'favicon': favicon_url}

def get_filename_from_path(path):
    return path.split('attachments/')[1]
