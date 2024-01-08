from django.db import models

class MockTest(models.Model):
    classID = models.ForeignKey('Class.Class', on_delete=models.CASCADE, blank=True, null=True)
    course = models.ForeignKey('Course.Course', on_delete=models.CASCADE, blank=True, null=True)
    mocktestID = models.BigAutoField(primary_key=True)
    mocktestName = models.CharField(max_length=200)
    mocktestDescription = models.TextField()
    mocktestDateCreated = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.mocktestName

class MockQuestions(models.Model):
    mocktest = models.ForeignKey(MockTest, on_delete=models.CASCADE, related_name='mockquestions')
    question = models.TextField(max_length=512)
    choiceA = models.CharField(max_length=255, verbose_name="A")
    choiceB = models.CharField(max_length=255, verbose_name="B")
    choiceC = models.CharField(max_length=255, verbose_name="C")
    choiceD = models.CharField(max_length=255, verbose_name="D")
    subject = models.CharField(max_length=255)
    difficulty = models.ForeignKey('Difficulty', on_delete=models.CASCADE)
    correctAnswer = models.CharField(max_length=255, verbose_name="Correct Answer")

    def __str__(self):
        return f"{self.question} - {self.subject}"

class Difficulty(models.Model):
    CHOICES = [
        ('1', 'Easy'),
        ('2', 'Medium'),
        ('3', 'Hard'),
    ]
    name = models.CharField(max_length=255, choices=CHOICES, unique=True)

    def __str__(self):
        return self.name

class MockTestScores(models.Model):
    mocktestScoreID = models.BigAutoField(primary_key=True)
    mocktest_id = models.ForeignKey('MockTest', on_delete=models.CASCADE, related_name='mocktest_scores')
    student = models.ForeignKey('User.Student', on_delete=models.CASCADE, related_name='student_scores')
    score = models.FloatField(null=False)
    feedback = models.TextField(null=False)
    mocktestDateTaken = models.DateField(auto_now_add=True)
    totalQuestions = models.IntegerField(default=0)
    correct_questions = models.ManyToManyField(
        'MockQuestions',
        through='CorrectQuestions',
        related_name='correct_in_tests'
    )

    class Meta:
        unique_together = ['mocktest_id', 'student']

    def __str__(self):
        return f"{self.student} - {self.mocktest_id}"
    
class CorrectQuestions(models.Model):
    mocktest_score = models.ForeignKey(MockTestScores, on_delete=models.CASCADE)
    mockquestion = models.ForeignKey(MockQuestions, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('mocktest_score', 'mockquestion')

    def __str__(self):
        return f"{self.mocktest_score} - {self.mockquestion}"