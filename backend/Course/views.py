# views.py

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Course, Lesson, Syllabus, Page, FileUpload
from Course.serializer import CourseListSerializer, CourseDetailSerializer, SyllabusSerializer, LessonSerializer, FileUploadSerializer, PageSerializer
from django.shortcuts import render, redirect, get_object_or_404
from .forms import PageForm, PageEditForm
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
    queryset = Lesson.objects.all().prefetch_related('pages')
    serializer_class = LessonSerializer

    @action(detail=True, methods=['get'], url_path='pages')
    def get_lesson_pages(self, request, pk=None):
        lesson = self.get_object()  # This should fetch the lesson based on the provided lesson_id
        pages = Page.objects.filter(lesson=lesson)
        serializer = PageSerializer(pages, many=True)
        return Response(serializer.data)

    def by_syllabus(self, request, syllabus_id=None):
        queryset = self.get_queryset().filter(syllabus=syllabus_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer

    @action(detail=False, methods=['get'], url_path='(?P<lesson_id>[^/.]+)')
    def by_lesson(self, request, lesson_id=None):
        pages = self.queryset.filter(lesson_id=lesson_id)
        serializer = self.get_serializer(pages, many=True)
        return Response(serializer.data)


class FileUploadViewSet(viewsets.ModelViewSet):
    queryset = FileUpload.objects.all()
    serializer_class = FileUploadSerializer


def create_page(request):
    if request.method == 'POST':
        form = PageForm(request.POST)
        if form.is_valid():
            page = form.save(commit=False)  # Create the Page object but don't save it yet

            # Get the selected lesson
            selected_lesson = form.cleaned_data.get('existing_lesson')
            if selected_lesson:
                page.lesson = selected_lesson  # Set the Page's lesson based on the selected lesson

            # Get the selected syllabus
            selected_syllabus = form.cleaned_data.get('existing_syllabus')
            if selected_syllabus:
                page.syllabus = selected_syllabus  # Set the Page's syllabus based on the selected syllabus

            page.save()  # Save the Page instance with the selected lesson and syllabus
            return redirect('success_page')  # Redirect to a success page
    else:
        form = PageForm()

    return render(request, 'lesson_form.html', {'form': form})

def edit_page(request, page_id):
    page = get_object_or_404(Page, pk=page_id)
    if request.method == 'POST':
        form = PageEditForm(request.POST, instance=page)
        if form.is_valid():
            form.save()
            return redirect('success_page')  # Redirect to a success page
    else:
        form = PageEditForm(instance=page)

    return render(request, 'edit_page.html', {'form': form, 'page': page})


def success_view(request):
    # Your logic for the success page
    return HttpResponse("Lesson created successfully!")

def page_create_or_edit(request, lesson_id=None, page_number=None):
    if lesson_id:
        # Editing an existing page or creating a new page for a specific lesson
        lesson = get_object_or_404(Lesson, pk=lesson_id)

        if page_number:
            # Editing an existing page
            page = get_object_or_404(Page, lesson=lesson, page_number=page_number)
            if request.method == 'POST':
                form = PageEditForm(request.POST, instance=page)
                if form.is_valid():
                    form.save()
                    return redirect('success_page')  # Redirect to a success page
            else:
                form = PageEditForm(instance=page)
        else:
            # Creating a new page for a specific lesson
            if request.method == 'POST':
                form = PageForm(request.POST)
                if form.is_valid():
                    page = form.save(commit=False)
                    page.lesson = lesson
                    # If a specific syllabus is selected, set it
                    selected_syllabus = form.cleaned_data.get('existing_syllabus')
                    if selected_syllabus:
                        page.syllabus = selected_syllabus
                    page.save()
                    return redirect('success_page')  # Redirect to a success page
            else:
                form = PageForm()
    else:
        # Creating a new page without a specific lesson
        if request.method == 'POST':
            form = PageForm(request.POST)
            if form.is_valid():
                page = form.save(commit=False)
                # If a specific syllabus is selected, set it
                selected_lesson = form.cleaned_data.get('existing_lesson')
                if selected_lesson:
                    page.lesson = selected_lesson
                selected_syllabus = form.cleaned_data.get('existing_syllabus')
                if selected_syllabus:
                    page.syllabus = selected_syllabus
                page.save()
                return redirect('success_page')  # Redirect to a success page
        else:
            form = PageForm()

    return render(request, 'lesson_form.html', {'form': form, 'lesson_id': lesson_id, 'page_number': page_number})
