from django.shortcuts import render
from rest_framework import viewsets
from .models import Class
from .serializers import ClassSerializer

# Create your views here.
class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer