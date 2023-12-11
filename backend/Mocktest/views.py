import os, environ
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
from User.models import Student, Teacher, User, Specialization
from Mocktest.serializer import MockTestSerializer, MockQuestionsSerializer, MockTestScoresSerializer
from openai import OpenAI



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
        env = environ.Env(
            DEBUG=(bool, False)
        )
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        environ.Env.read_env(os.path.join(BASE_DIR, '.env'))
        client = OpenAI(
            api_key=env('OPENAI_API_KEY'),
        )


        user_name = request.data.get('user_name')
        if not user_name:
            return Response({'error': 'User name not provided.'}, status=400)

        user = get_object_or_404(User, user_name=user_name)
        student = get_object_or_404(Student, user_name=user.user_name)
        mocktest = get_object_or_404(MockTest, pk=mocktest_id)
        mocktest_name = mocktest.mocktestName
        answers = request.data.get('answers')
        specialization_name = student.specialization.name
        student_name = student.first_name + " " + student.last_name

        correct_answers = MockQuestions.objects.filter(mocktest=mocktest).values_list('id', 'correctAnswer')
        correct_answers_dict = {str(question_id): correct for question_id, correct in correct_answers}

        score = sum(answer == correct_answers_dict.get(str(question_id)) for question_id, answer in answers.items())
        total_questions = len(correct_answers)

        correct_answers_list = []
        wrong_answers_list = []

        for question_id, submitted_answer in answers.items():
            correct_answer = correct_answers_dict.get(str(question_id))
            question_text = MockQuestions.objects.get(id=question_id).question
            subject_text = MockQuestions.objects.get(id=question_id).subject

            if submitted_answer == correct_answer:
                correct_answers_list.append({"question": question_text, "submittedAnswer": submitted_answer,"correctAnswer": correct_answer, "subject": subject_text})
            else:
                wrong_answers_list.append({"question": question_text, "submittedAnswer": submitted_answer, "correctAnswer": correct_answer, "subject": subject_text})

        if correct_answers_list.__len__() > 0:
            correct_answers_paragraph = "Here are the questions where I got the correct answer:\n"
        else:
            correct_answers_paragraph = "I got all the questions wrong.\n"
        for item in correct_answers_list:
            correct_answers_paragraph += f"Question: {item['question']} - Submitted Answer: {item['submittedAnswer']}, Subject: {item['subject']}\n"

        if wrong_answers_list.__len__() > 0:
            wrong_answers_paragraph = "Here are the questions where I got the wrong answer:\n"
        else:
            wrong_answers_paragraph = "I got all the questions correct.\n"
        for item in wrong_answers_list:
            wrong_answers_paragraph += f"Question: {item['question']} - Submitted Answer: {item['submittedAnswer']}, Correct Answer: {item['correctAnswer']}, Subject: {item['subject']}\n"

        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are Preppy, BoardPrep's Engineering Assistant and an excellent and critical engineer, tasked with providing constructive feedback on mock test performances of your students. In giving a feedback, you don't thank the student for sharing the details, instead you congratulate the student first for finishing the mock test, then you provide your feedbacks. After providing your feedbacks, you then put your signature at the end of your response"},
                {"role": "user", "content": f"I am {student_name}, a {specialization_name} major, and here are the details of my test. {correct_answers_paragraph}\n\n{wrong_answers_paragraph}\n\nBased on these results, can you provide some feedback and suggestions for improvement, like what subjects to focus on, which field i excel, and some strategies? Address me directly, and don't put any placeholders as this will be displayed directly in unformatted text form."}
            ]
        )

        feedback = completion.choices[0].message.content

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