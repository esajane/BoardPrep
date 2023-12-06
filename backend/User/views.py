from django.shortcuts import render, get_object_or_404
from django.contrib.auth.hashers import check_password
from django.contrib.auth import login, logout
from django.contrib.sessions.models import Session
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from .serializers import StudentSerializer, TeacherSerializer, UserSerializer
from .models import Student, Teacher, User, Specialization

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)  # Successful creation
        return Response(serializer.errors, status=400)

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)  # Successful creation
        return Response(serializer.errors, status=400)

class UserLogin(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            user = User.objects.get(user_name=username)
        except User.DoesNotExist:
            return Response({'message': 'Invalid Credentials'}, status=status.HTTP_404_NOT_FOUND)

        if password == user.password:
            response_data = {'message': 'Login Successfully', **UserSerializer(user).data}
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid Credentials'}, status=status.HTTP_404_NOT_FOUND)

class StudentLogin(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            student = Student.objects.get(user_name=username)
        except Student.DoesNotExist:
            return Response({'message': 'Invalid Credentials'}, status=status.HTTP_404_NOT_FOUND)

        if password == student.password:
            response_data = {'message': 'Login Successfully', **StudentSerializer(student).data}
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid Credentials'}, status=status.HTTP_404_NOT_FOUND)

class TeacherLogin(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            teacher = Teacher.objects.get(user_name=username)
        except Teacher.DoesNotExist:
            return Response({'message': 'Invalid Credentials'}, status=status.HTTP_404_NOT_FOUND)

        if password == teacher.password:
            # Correctly combine the message and the serialized data into one response
            response_data = {'message': 'Login Successfully', **TeacherSerializer(teacher).data}
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid Credentials'}, status=status.HTTP_404_NOT_FOUND)

class StudentRegister(APIView):
    def post(self, request):
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TeacherRegister(APIView):
    def post(self, request):
        serializer = TeacherSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogout:
    pass