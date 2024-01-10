from django.db import models
from django_ckeditor_5.fields import CKEditor5Field

class Course(models.Model):
    course_id = models.CharField(max_length=10, primary_key=True)
    course_title = models.CharField(max_length=200)
    short_description = models.CharField(max_length=500)
    long_description = models.TextField()
    image = models.ImageField(upload_to='images/', default='default.png')
    is_published = models.BooleanField(default=False)  # New field

    def __str__(self):
        return self.course_title

    def has_mock_test(self):
        return self.mocktest_set.exists()

class Syllabus(models.Model):
    course = models.OneToOneField(Course, on_delete=models.CASCADE, related_name='syllabus')
    syllabus_id = models.CharField(max_length=10, primary_key=True)

    def __str__(self):
        return f"Syllabus for {self.course.course_title}"

class Lesson(models.Model):
    syllabus = models.ForeignKey(Syllabus, on_delete=models.CASCADE, related_name='lessons')
    lesson_id = models.CharField(max_length=10, primary_key=True)
    lesson_title = models.CharField(max_length=200)
    order = models.IntegerField(help_text="Order of the lesson in the syllabus")

    def __str__(self):
        return f"{self.lesson_title} - {self.syllabus.course.course_title}"

class Page(models.Model):
    syllabus = models.ForeignKey(Syllabus, on_delete=models.CASCADE, related_name='pages_by_syllabus')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='pages')
    page_number = models.IntegerField(help_text="Page number within the lesson")
    content = CKEditor5Field('Content', config_name='extends')

    class Meta:
        ordering = ['page_number']
        unique_together = ('lesson', 'page_number')

    def __str__(self):
        return f"Page {self.page_number} - {self.lesson.lesson_title}"

class FileUpload(models.Model):
    file = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

