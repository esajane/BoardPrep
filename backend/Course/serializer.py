from rest_framework import serializers
from bs4 import BeautifulSoup
from django.conf import settings
from Course.models import Course, Syllabus, Lesson, Page, FileUpload


class CourseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id', 'course_title', 'short_description', 'image']


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = "__all__"


class LessonSerializer(serializers.ModelSerializer):
    pages = PageSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        content = data.get('content')

        if content:
            soup = BeautifulSoup(content, 'html.parser')
            images = soup.find_all('img')
            for img in images:
                if img['src'].startswith('/'):
                    img['src'] = settings.SITE_URL + img['src']

            data['content'] = str(soup)

        return data


# If using a FileUpload model
class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUpload
        fields = ['file', 'uploaded_at']


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
