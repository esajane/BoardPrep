from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
from .models import MockTest, MockQuestions, MockTestScores
from User.models import Student, Teacher, User
from Mocktest.serializer import MockTestSerializer, MockQuestionsSerializer, MockTestScoresSerializer

# Create your views here.
class MockTestViewSet(viewsets.ModelViewSet):
    serializer_class = MockTestSerializer

    def get_queryset(self):
        queryset = MockTest.objects.all()
        course_id = self.request.query_params.get('course_id')
        # try:
        #     course_id = str(course_id)
        # except:
        #     return queryset.none()
        return queryset.filter(course_id=course_id)

class MockQuestionsViewSet(viewsets.ModelViewSet):
    serializer_class = MockQuestionsSerializer

    def get_queryset(self):
        queryset = MockQuestions.objects.all()
        mocktest_id = self.request.query_params.get('mocktest_id')
        # try:
        #     mocktest_id = int(mocktest_id)
        # except:
        #     return queryset.none()
        return queryset.filter(mocktest_id=mocktest_id)

class MockTestScoresViewSet(viewsets.ModelViewSet):
    queryset = MockTestScores.objects.all()
    serializer_class = MockTestScoresSerializer

    def get_queryset(self):
        queryset = MockTestScores.objects.all()
        student_id = self.request.query_params.get('student_id')
        # try:
        #     student_id = int(student_id)
        # except:
        #     return queryset.none()
        return queryset.filter(student_id=student_id)

@api_view(['POST'])
def submit_mocktest(request, mocktest_id):
    try:
        print(f"User ID: {request.user.id}")
        print(f"Authenticated: {request.user.is_authenticated}")
        print(f"Received mocktest_id: {mocktest_id}")

        student = Student.objects.get(user_name='student2')
        mocktest = get_object_or_404(MockTest, pk=mocktest_id)
        answers = request.data.get('answers')

        correct_answers = MockQuestions.objects.filter(
            mocktest=mocktest
        ).values_list('id', 'correctAnswer')
        correct_answers_dict = {str(question_id): correct for question_id, correct in correct_answers}

        score = 0
        for question_id, answer in answers.items():
            if answer == correct_answers_dict.get(question_id):
                score += 1

        total_questions = len(correct_answers)

        mocktest_score = MockTestScores.objects.create(
            mocktest_id=mocktest,
            student=student,
            score=score,
            totalQuestions=total_questions,
            mocktestDateTaken=timezone.now()
        )

        student_dict = model_to_dict(student, fields=['first_name', 'last_name'])
        student_name = f"{student_dict.get('first_name')} {student_dict.get('last_name')}"
        mocktest_instance = MockTest.objects.get(id=mocktest_id)
        mocktest_name = mocktest_instance.mocktestName

        response_data = {
            'score': score,
            'total_questions': total_questions,
            'mocktestName': mocktest_name,
            'studentName': student_name,
            'mocktestDateTaken': mocktest_score.mocktestDateTaken.strftime('%Y-%m-%d'),
            'message': 'Mock test submitted successfully'
        }

        return Response(response_data)
    except MockTest.DoesNotExist:
        return Response({'error': 'No MockTest matches the given query.'}, status=404)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist,'}, status=404)
    except Exception as e:
        print(f"Error: {e}")
        print(f"Request data: {request.data}")
        raise ValidationError({'error': str(e)})