from rest_framework import serializers
from Course.models import Course, Syllabus, Lesson

class CourseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id', 'course_title', 'short_description','image']

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['title', 'content', 'order']

class SyllabusSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Syllabus
        fields = ['overview', 'lessons']

class CourseDetailSerializer(serializers.ModelSerializer):
    syllabus = SyllabusSerializer(read_only=True)
    class Meta:
        model = Course
        fields = '__all__'

