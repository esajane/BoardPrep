from rest_framework import serializers
from Mocktest.models import MockTest, MockQuestions, MockTestScores

class MockQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockQuestions
        fields = '__all__'

class MockTestSerializer(serializers.ModelSerializer):
    question = MockQuestionsSerializer(many=True, read_only=True, source='mockquestions_set')
    class Meta:
        model = MockTest
        fields = '__all__'

class MockTestScoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockTestScores
        fields = '__all__'
