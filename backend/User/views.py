from django.db import connection
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.hashers import check_password
from django.contrib.auth import login, logout
from django.contrib.sessions.models import Session
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .serializers import StudentSerializer, TeacherSerializer, UserSerializer, ContentCreatorSerializer
from .models import Student, Teacher, User, Specialization, ContentCreator
import jwt, datetime

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
            payload = {
                'id': user.user_name,
                'type': user.user_type,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow()
            }
            token = jwt.encode(payload, 'secret', algorithm='HS256')
            response = Response()
            response.set_cookie(key='jwt', value=token, httponly=True)
            response.data = {
                'jwt': token
            }
            return response
        else:
            return Response({'message': 'Invalid Credentials'}, status=status.HTTP_404_NOT_FOUND)

class UserLogout(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response

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
        print(request.data)
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            student = serializer.save()
            payload = {
                'id': student.user_name,
                'type': 'S',
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow()
            }
            token = jwt.encode(payload, 'secret', algorithm='HS256')
            response = Response()
            response.set_cookie(key='jwt', value=token, httponly=True)
            response.data = {
                'jwt': token
            }
            return response
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TeacherRegister(APIView):
    def post(self, request):
        print(request.data)
        serializer = TeacherSerializer(data=request.data)
        if serializer.is_valid():
            teacher = serializer.save()
            payload = {
                'id': teacher.user_name,
                'type': 'T',
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow()
            }
            token = jwt.encode(payload, 'secret', algorithm='HS256')
            response = Response()
            response.set_cookie(key='jwt', value=token, httponly=True)
            response.data = {
                'jwt': token
            }
            return response
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')

        try:
            user = User.objects.get(user_name=user_id)
        except User.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ContentCreatorLogin(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            content_creator = ContentCreator.objects.get(user_name=username)
        except ContentCreator.DoesNotExist:
            return Response({'message': 'Invalid Credentials'}, status=status.HTTP_404_NOT_FOUND)

        if password == content_creator.password:
            # Correctly combine the message and the serialized data into one response
            response_data = {'message': 'Login Successfully', **ContentCreatorSerializer(content_creator).data}
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid Credentials'}, status=status.HTTP_404_NOT_FOUND)

class ContentCreatorRegister(APIView):
    def post(self, request):
        print(request.data)
        serializer = ContentCreatorSerializer(data=request.data)
        if serializer.is_valid():
            content_creator = serializer.save()
            payload = {
                'id': content_creator.user_name,
                'type': 'C',
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow()
            }
            token = jwt.encode(payload, 'secret', algorithm='HS256')
            response = Response()
            response.set_cookie(key='jwt', value=token, httponly=True)
            response.data = {
                'jwt': token
            }
            return response
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetUser(APIView):
    def get(self, request):
        user_id = request.query_params.get('username')
        try:
            user = User.objects.get(user_name=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UpdateUser(APIView):
    def put(self, request):
        user_id = request.data.get('username')
        if user_id is None:
            return Response({"error": "Username parameter is missing"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(user_name=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=404)
