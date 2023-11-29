from django.db import models

# Create your models here.
class MockTest(models.Model):
    course = models.ForeignKey('Course.Course', on_delete=models.CASCADE, blank=True, null=True)
    mocktestID = models.BigAutoField(primary_key=True)
    mocktestName = models.CharField(max_length=200)
    mocktestDescription = models.TextField()
    mocktestDateCreated = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.mocktestName

class MockQuestions(models.Model):
    mocktest = models.ForeignKey(MockTest, on_delete=models.CASCADE)
    question = models.TextField(max_length=512)
    choiceA = models.CharField(max_length=255, verbose_name="A")
    choiceB = models.CharField(max_length=255, verbose_name="B")
    choiceC = models.CharField(max_length=255, verbose_name="C")
    choiceD = models.CharField(max_length=255, verbose_name="D")
    subject = models.CharField(max_length=255)
    correctAnswer = models.CharField(max_length=1, choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')], verbose_name="Correct Answer")

    def __str__(self):
        return f"{self.question} - {self.subject}"

class MockTestScores(models.Model):
    mocktestScoreID = models.BigAutoField(primary_key=True)
    mocktestId = models.ForeignKey('MockTest', on_delete=models.CASCADE)
    student = models.ForeignKey('User.Student', on_delete=models.CASCADE)
    score = models.FloatField(null=False)
    mocktestDateTaken = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ['mocktestId', 'student']

    def __str__(self):
        return f"{self.studentID} - {self.mocktestId}"