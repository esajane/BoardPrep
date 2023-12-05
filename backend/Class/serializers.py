from rest_framework import serializers

from .models import Class, Post, Comment, JoinRequest, Activity, Submission, Attachment
from Course.models import Course

from User.models import Teacher


class ClassSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    image = serializers.SerializerMethodField()
    teacher_name = serializers.SerializerMethodField()
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
    class Meta:
        model = Submission
        fields = '__all__'

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = '__all__'