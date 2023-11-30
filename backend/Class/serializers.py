from rest_framework import serializers

from .models import Class, Post, Comment

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = '__all__'
        extra_kwargs = {
            'classCode': {'required': False, 'read_only': True},
            'students': {'required': False}
        }
    
    def create(self, validated_data):
        students = validated_data.pop('students', [])
        new_class = Class.objects.create(**validated_data)
        for student in students:
            new_class.students.add(student)
        return new_class
    
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'