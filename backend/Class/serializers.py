from rest_framework import serializers

from .models import Class

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['classId', 'className', 'classDescription', 'course', 'teacher']
    
    def create(self, validated_data):
        students = validated_data.pop('students', [])
        new_class = Class.objects.create(**validated_data)
        for student in students:
            new_class.students.add(student)
        return new_class