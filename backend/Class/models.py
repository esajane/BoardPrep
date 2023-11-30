import uuid
from django.db import models
from User.models import Teacher, Student, User

# Create your models here.
class Class(models.Model):
    classId = models.AutoField(primary_key=True)
    classCode = models.CharField(max_length=100, unique=True)
    className = models.CharField(max_length=255)
    classDescription = models.TextField()
    course = models.ForeignKey('Course.Course', on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    students = models.ManyToManyField(Student, related_name='classes')

    def __str__(self):
        return self.className
    
    def save(self, *args, **kwargs):
        if not self.classCode:
            self.classCode = uuid.uuid4().hex[:6].upper()
            while Class.objects.filter(classCode=self.classCode).exists():
                self.classCode = uuid.uuid4().hex[:6].upper()
        super(Class, self).save(*args, **kwargs)
    
class JoinRequest(models.Model):
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    is_accepted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('class_instance', 'student')

class Post(models.Model):
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
    
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title