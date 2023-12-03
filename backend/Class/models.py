import uuid
from django.db import models
from django.utils import timezone
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
    id = models.AutoField(primary_key=True)
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)

    def __str__(self):
        return self.content
    
class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.content
    
class Attachment(models.Model):
    id = models.AutoField(primary_key=True)
    file = models.FileField(upload_to='attachments/', blank=True, null=True)
    link = models.URLField(blank=True)
    
    def __str__(self):
        return self.file.name if self.file else self.link
    
class Activity(models.Model):
    id = models.AutoField(primary_key=True)
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    start_date = models.DateTimeField()
    due_date = models.DateTimeField()
    attachments = models.ManyToManyField(Attachment, related_name='activities', blank=True)
    status_choices = [
        ('Not Started', 'Not Started'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]
    status = models.CharField(max_length=20, choices=status_choices, default='Not Started')
    points = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(editable=False)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.pk:
            current_date = timezone.now()
            current_date = current_date.replace(hour=current_date.hour + 8)
            self.created_at = current_date
        if self.created_at >= self.start_date:
            raise ValueError("Not a valid start date")
        if self.start_date >= self.due_date:
            raise ValueError("Start date must be earlier than due date")
        
        super(Activity, self).save(*args, **kwargs)
    
class Submission(models.Model):
    id = models.AutoField(primary_key=True)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    submission_text = models.TextField(blank=True)
    submission_date = models.DateTimeField(auto_now_add=True)
    attachments = models.ManyToManyField('Attachment', related_name='submissions', blank=True)

    def __str__(self):
        return f"Submission by {self.student} for {self.activity}"
    

    
