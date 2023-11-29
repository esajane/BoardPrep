from rest_framework import serializers
from Course.models import Course, Syllabus, Lesson, Page, Paragraph

class CourseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id', 'course_title', 'short_description', 'image']

class ParagraphSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paragraph
        fields = '__all__'

class PageSerializer(serializers.ModelSerializer):
    paragraphs = ParagraphSerializer(many=True, read_only=True)
    class Meta:
        model = Page
        fields = '__all__'


class LessonSerializer(serializers.ModelSerializer):
    pages = PageSerializer(many=True, read_only=True)
    class Meta:
        model = Lesson
        fields = '__all__'


class SyllabusSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Syllabus
        fields = '__all__'
class CourseDetailSerializer(serializers.ModelSerializer):
    syllabus = SyllabusSerializer(read_only=True)
    class Meta:
        model = Course
        fields = '__all__'

