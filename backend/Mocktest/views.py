from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.db.models import Count, Case, When, Value, F
from django.db.models.functions import Coalesce
from django.db.models import Q
from .models import MockTest, MockQuestions, MockTestScores
from User.models import Student, Teacher, User
from Mocktest.serializer import MockTestSerializer, MockQuestionsSerializer, MockTestScoresSerializer

class MockTestViewSet(viewsets.ModelViewSet):
    queryset = MockTest.objects.none()
    serializer_class = MockTestSerializer

    def get_queryset(self):
        queryset = MockTest.objects.all()
        classID = self.request.query_params.get('classID')
        courseID = self.request.query_params.get('courseID')

        if classID:
            queryset = queryset.filter(classID=classID)
        if courseID:
            queryset = queryset.filter(courseID=courseID)
        # try:
        #     classID = str(classID)
        # except:
        #     return queryset.none()
        return queryset

class MockQuestionsViewSet(viewsets.ModelViewSet):
    queryset = MockQuestions.objects.none()
    serializer_class = MockQuestionsSerializer

    def get_queryset(self):
        queryset = MockQuestions.objects.all()
        mocktest_id = self.request.query_params.get('mocktest_id')
        question_id = self.request.query_params.get('question_id')

        if question_id:
            queryset = queryset.filter(id=question_id)
        if mocktest_id:
            queryset = queryset.filter(mocktest=mocktest_id)
        # try:
        #     mocktest_id = int(mocktest_id)
        # except:
        #     return queryset.none()
        return queryset

class MockTestScoresViewSet(viewsets.ModelViewSet):
    queryset = MockTestScores.objects.all()
    serializer_class = MockTestScoresSerializer

    def get_queryset(self):
        queryset = MockTestScores.objects.all()
        student_id = self.request.query_params.get('student_id')
        mocktest_id = self.request.query_params.get('mocktest_id')

        if student_id:
            queryset = queryset.filter(student__user_name=student_id)
        if mocktest_id:
            queryset = queryset.filter(mocktest_id=mocktest_id)

        queryset = queryset.annotate(
            easy_count=Count('mocktest_id__mockquestions__id',
                             filter=Q(mocktest_id__mockquestions__difficulty__name='Easy')),
            medium_count=Count('mocktest_id__mockquestions__id',
                               filter=Q(mocktest_id__mockquestions__difficulty__name='Medium')),
            hard_count=Count('mocktest_id__mockquestions__id',
                             filter=Q(mocktest_id__mockquestions__difficulty__name='Hard')),
            easy_correct=Count('mocktest_id__mockquestions__id',
                               filter=Q(mocktest_id__mockquestions__difficulty__name='Easy',
                                        mocktest_id__mockquestions__correctAnswer=F('score'))),
            medium_correct=Count('mocktest_id__mockquestions__id',
                                 filter=Q(mocktest_id__mockquestions__difficulty__name='Medium',
                                          mocktest_id__mockquestions__correctAnswer=F('score'))),
            hard_correct=Count('mocktest_id__mockquestions__id',
                               filter=Q(mocktest_id__mockquestions__difficulty__name='Hard',
                                        mocktest_id__mockquestions__correctAnswer=F('score'))),
            subjects_count=Count('mocktest_id__mockquestions__subject', distinct=True)
        )
        # try:
        #     student_id = int(student_id)
        # except:
        #     return queryset.none()
        return queryset

@api_view(['POST'])
def submit_mocktest(request, mocktest_id):
    try:
        user_name = request.data.get('user_name')
        if not user_name:
            return Response({'error': 'User name not provided.'}, status=400)

        user = get_object_or_404(User, user_name=user_name)
        student = get_object_or_404(Student, user_name=user.user_name)
        mocktest = get_object_or_404(MockTest, pk=mocktest_id)
        mocktest_name = mocktest.mocktestName
        answers = request.data.get('answers')

        correct_answers = MockQuestions.objects.filter(mocktest=mocktest).values_list('id', 'correctAnswer')
        correct_answers_dict = {str(question_id): correct for question_id, correct in correct_answers}

        score = sum(answer == correct_answers_dict.get(str(question_id)) for question_id, answer in answers.items())
        total_questions = len(correct_answers)

        MockTestScores.objects.update_or_create(
            mocktest_id=mocktest,
            student=student,
            defaults={
                'score': score,
                'totalQuestions': total_questions,
                'mocktestDateTaken': timezone.now()
            }
        )

        response_data = {
            'score': score,
            'total_questions': total_questions,
            'mocktestName': mocktest_name,
            'studentName': f"{user.first_name} {user.last_name}",
            'mocktestDateTaken': timezone.now().strftime('%B %d, %Y'),
            'message': 'Mock test submitted successfully'
        }

        return Response(response_data, status=status.HTTP_201_CREATED)

    except MockTest.DoesNotExist:
        return Response({'error': 'No MockTest matches the given query.'}, status=404)
    except Student.DoesNotExist:
        return Response({'error': 'Student does not exist.'}, status=404)
    except Exception as e:
        print(f"Error: {e}")
        print(f"Request data: {request.data}")
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
def get_mocktest_by_course(request, course_id):
    try:
        print(f"Received course ID: {course_id}")

        mocktest = MockTest.objects.get(course=course_id)
        return JsonResponse({'mocktest_id': mocktest.mocktestID})
    except MockTest.DoesNotExist:
        return Response({'error': 'No MockTest found for the given course.'}, status=404)
    except Exception as e:
        print(f"Error: {e}")
        print(f"Request data: {request.data}")
        raise ValidationError({'error': str(e)})