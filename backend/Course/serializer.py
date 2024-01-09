from rest_framework import serializers
from bs4 import BeautifulSoup
from django.conf import settings
from Course.models import Course, Syllabus, Lesson,  Page, FileUpload
from datetime import datetime
import time

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = "__all__"


class LessonSerializer(serializers.ModelSerializer):
    pages = PageSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = "__all__"
        read_only_fields = ('lesson_id',)  # Set lesson_id as read-only

    def create(self, validated_data):
        lesson_id = self.generate_lesson_id()
        order = validated_data.get('order')
        syllabus_id = validated_data.get('syllabus')

        # Check if any existing lesson has the same order
        existing_lesson = Lesson.objects.filter(syllabus=syllabus_id, order=order).first()

        if existing_lesson:
            # Increment the order of the existing lesson and any subsequent lessons
            lessons_to_update = Lesson.objects.filter(syllabus=syllabus_id, order__gte=order)
            for lesson in lessons_to_update:
                lesson.order += 1
                lesson.save()

        return Lesson.objects.create(lesson_id=lesson_id, **validated_data)

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

    @staticmethod
    def generate_lesson_id():
        # Using current time in milliseconds, converted to base 36
        timestamp = int(time.time() * 1000)
        lesson_id = base36_encode(timestamp)
        return lesson_id[:7]  # Truncate to 5 characters

def base36_encode(number):
    assert number >= 0, 'Positive integer required'
    if number == 0:
        return '0'
    base36 = ''
    while number != 0:
        number, i = divmod(number, 36)
        base36 = '0123456789abcdefghijklmnopqrstuvwxyz'[i] + base36
    return base36



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



class CourseListSerializer(serializers.ModelSerializer):
    hasMocktest = serializers.SerializerMethodField()
    syllabus = SyllabusSerializer(read_only=True)

    class Meta:
        model = Course
        fields = ['course_id', 'course_title', 'short_description', 'image', 'syllabus', 'is_published', 'hasMocktest']

    def create(self, validated_data):
        course = Course.objects.create(**validated_data)
        syllabus_id = generate_syllabus_id(course)  # Use the function
        Syllabus.objects.create(course=course, syllabus_id=syllabus_id)
        return course

    def get_hasMocktest(self, obj):
        return obj.hasMocktest


def generate_syllabus_id(course):
    # Example implementation
    timestamp = datetime.now().strftime("%H%M%S")  # HHMMSS format
    syllabus_id = (course.course_id[:4] + timestamp)[:10]  # Ensure it's only 10 characters
    return syllabus_id

class CourseDetailSerializer(serializers.ModelSerializer):
    syllabus = SyllabusSerializer(read_only=True)

    class Meta:
        model = Course
        fields = '__all__'

    def create(self, validated_data):
        course = Course.objects.create(**validated_data)
        syllabus_id = generate_syllabus_id(course)  # Use the function
        Syllabus.objects.create(course=course, syllabus_id=syllabus_id)
        return course


