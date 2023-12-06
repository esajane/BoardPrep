# views.py

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Course, Lesson, Syllabus, FileUpload
from Course.serializer import CourseListSerializer, CourseDetailSerializer, SyllabusSerializer, LessonSerializer, FileUploadSerializer
from django.shortcuts import render, redirect
from .forms import LessonForm
from django.http import HttpResponse

class CourseListViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseListSerializer

class CourseDetailViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseDetailSerializer

class SyllabusViewSet(viewsets.ModelViewSet):
    queryset = Syllabus.objects.all()
    serializer_class = SyllabusSerializer
    @action(detail=False, methods=['get'], url_path='(?P<course_id>[^/.]+)')
    def by_course(self, request, course_id=None):
        queryset = self.get_queryset().filter(course=course_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer


    def by_syllabus(self, request, syllabus_id=None):
        queryset = self.get_queryset().filter(syllabus=syllabus_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

# If using a FileUpload model
class FileUploadViewSet(viewsets.ModelViewSet):
    queryset = FileUpload.objects.all()
    serializer_class = FileUploadSerializer

def create_lesson(request):
    if request.method == 'POST':
        form = LessonForm(request.POST)
        if form.is_valid():
            lesson = form.save(commit=False)  # Create the lesson object but don't save it yet
            existing_course = form.cleaned_data.get('existing_course')
            if existing_course:
                lesson.syllabus = existing_course.syllabus
            lesson.save()  # Save the lesson with the selected syllabus
            return redirect('success_page')  # Redirect to a success page
    else:
        form = LessonForm()

    return render(request, 'lesson_form.html', {'form': form})


def success_view(request):
    # Your logic for the success page
    return HttpResponse("Lesson created successfully!")