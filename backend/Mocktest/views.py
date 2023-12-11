import os
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import MockTest, MockQuestions, MockTestScores
from User.models import Student, Teacher, User
from Mocktest.serializer import MockTestSerializer, MockQuestionsSerializer, MockTestScoresSerializer
from openai import OpenAI

class MockTestViewSet(viewsets.ModelViewSet):
    queryset = MockTest.objects.none()
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
    queryset = MockQuestions.objects.none()
    serializer_class = MockQuestionsSerializer

    def get_queryset(self):
        queryset = MockQuestions.objects.all()
        mocktest_id = self.request.query_params.get('mocktest_id')

        if not mocktest_id or mocktest_id == 'undefined':
            return MockQuestions.objects.none()
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
        mocktest_id = self.request.query_params.get('mocktest_id')
        if student_id:
            queryset = queryset.filter(student__user_name=student_id)
        if mocktest_id:
            queryset = queryset.filter(mocktest_id=mocktest_id)
        # try:
        #     student_id = int(student_id)
        # except:
        #     return queryset.none()
        return queryset

@api_view(['POST'])
def submit_mocktest(request, mocktest_id):
    try:
        client = OpenAI()
        client = OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY"),
        )

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

        correct_answers_list = []
        wrong_answers_list = []

        for question_id, submitted_answer in answers.items():
            correct_answer = correct_answers_dict.get(str(question_id))
            question_text = MockQuestions.objects.get(id=question_id).question

            if submitted_answer == correct_answer:
                correct_answers_list.append({"question": question_text, "submittedAnswer": submitted_answer,"correctAnswer": correct_answer})
            else:
                wrong_answers_list.append({"question": question_text, "submittedAnswer": submitted_answer, "correctAnswer": correct_answer})

        correct_answers_paragraph = "Here are the questions where the user got the correct answer:\n"
        for item in correct_answers_list:
            correct_answers_paragraph += f"Question: {item['question']} - Submitted Answer: {item['submittedAnswer']}\n"

        wrong_answers_paragraph = "Here are the questions where the user got the wrong answer:\n"
        for item in wrong_answers_list:
            wrong_answers_paragraph += f"Question: {item['question']} - Submitted Answer: {item['submittedAnswer']}, Correct Answer: {item['correctAnswer']}\n"

        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an excellent engineer, tasked with providing constructive feedback on mock test performances."},
                {"role": "user", "content": f"{correct_answers_paragraph}\n\n{wrong_answers_paragraph}\n\nBased on this, can you provide some feedback and suggestions for improvement, like what subjects to focus on, which field i excel, and some strategies?"}
            ]
        )

        feedback = completion.choices[0].message

        MockTestScores.objects.update_or_create(
            mocktest_id=mocktest,
            student=student,
            defaults={
                'score': score,
                'totalQuestions': total_questions,
                'mocktestDateTaken': timezone.now(),
                'feedback': feedback
            }
        )

        response_data = {
            'score': score,
            'total_questions': total_questions,
            'feedback': feedback,
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