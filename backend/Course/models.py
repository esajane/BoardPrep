from django.db import models

class Course(models.Model):
    course_id = models.CharField(max_length=10, primary_key=True)
    course_title = models.CharField(max_length=200)
    short_description = models.CharField(max_length=500)
    long_description = models.TextField()
    image = models.ImageField(upload_to='images/', default='default.png')

    def __str__(self):
        return self.course_title

class Syllabus(models.Model):
    course = models.OneToOneField(Course, on_delete=models.CASCADE, related_name='syllabus')
    description = models.TextField()

    def __str__(self):
        return f"Syllabus for {self.course.course_title}"

class Lesson(models.Model):
    syllabus = models.ForeignKey(Syllabus, on_delete=models.CASCADE, related_name='lessons')
    lesson_title = models.CharField(max_length=200)
    order = models.IntegerField(help_text="Order of the lesson in the syllabus")

    def __str__(self):
        return f"{self.lesson_title} - {self.syllabus.course.course_title}"

class Page(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='pages')
    page_number = models.IntegerField(help_text="Page number in the lesson")

    def __str__(self):
        return f"Page {self.page_number} - {self.lesson.lesson_title}"

class Paragraph(models.Model):
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='paragraphs')
    text = models.TextField()
    order = models.IntegerField(help_text="Order of the paragraph on the page")

    def __str__(self):
        return f"Paragraph {self.order} - Page {self.page.page_number}"
