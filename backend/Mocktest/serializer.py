from rest_framework import serializers
from Mocktest.models import MockTest, MockQuestions, MockTestScores

class MockTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockTest
        fields = '__all__'

class MockQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockQuestions
        fields = '__all__'

class MockTestScoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockTestScores
        fields = '__all__'