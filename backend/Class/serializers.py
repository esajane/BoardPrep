from rest_framework import serializers

from .models import Class, Post, Comment, JoinRequest, Activity, Submission, Attachment
from Course.models import Course

from User.models import Teacher


class ClassSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
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
    
class JoinRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = JoinRequest
        fields = '__all__'
    
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class ActivitySerializer(serializers.ModelSerializer):
    className = serializers.SerializerMethodField()
    class Meta:
        model = Activity
        fields = '__all__'

    def get_className(self, obj):
        return obj.class_instance.className if obj.class_instance else None

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = '__all__'

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = '__all__'