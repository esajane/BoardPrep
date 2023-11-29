from rest_framework import serializers, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Class

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['classId', 'className', 'classDescription', 'course', 'teacher']
    
    def create(self, validated_data):
        students = validated_data.pop('students')
        new_class = Class.objects.create(**validated_data)
        for student in students:
            new_class.students.add(student)
        return new_class
    
    @action(detail=True, methods=['post'], url_path='join-class')
    def join_class(self, request, pk=None):
        class_instance = self.get_object()
        join_code = request.data.get('join_code')

        if class_instance.join_code == join_code:
            # Here you can create a 'join request' instead of directly adding the student
            # For simplicity, we're directly adding the student
            class_instance.students.add(request.user) 
            return Response(status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid join code'}, status=status.HTTP_400_BAD_REQUEST)