from rest_framework import viewsets
from .models import MockTest, MockQuestions, MockTestScores
from Mocktest.serializer import MockTestSerializer, MockQuestionsSerializer, MockTestScoresSerializer

# Create your views here.
class MockTestViewSet(viewsets.ModelViewSet):
    queryset = MockTest.objects.all()
    serializer_class = MockTestSerializer

class MockQuestionsViewSet(viewsets.ModelViewSet):
    queryset = MockQuestions.objects.all()
    serializer_class = MockQuestionsSerializer

class MockTestScoresViewSet(viewsets.ModelViewSet):
    queryset = MockTestScores.objects.all()
    serializer_class = MockTestScoresSerializer