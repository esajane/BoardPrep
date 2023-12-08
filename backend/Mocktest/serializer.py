from rest_framework import serializers
from Mocktest.models import MockTest, MockQuestions, MockTestScores, Difficulty

class MockQuestionsSerializer(serializers.ModelSerializer):
    difficulty = serializers.SerializerMethodField()
    class Meta:
        model = MockQuestions
        fields = '__all__'

    def get_difficulty(self, obj):
        difficulty = Difficulty.objects.get(id=obj.difficulty_id)
        return difficulty.name

class MockTestSerializer(serializers.ModelSerializer):
    question = MockQuestionsSerializer(many=True, read_only=True, source='mockquestions_set')
    class Meta:
        model = MockTest
        fields = '__all__'

class MockTestScoresSerializer(serializers.ModelSerializer):
    studentName = serializers.SerializerMethodField()
    class Meta:
        model = MockTestScores
        fields = ('mocktestScoreID',
                  'mocktest_id',
                  'student',
                  'score',
                  'mocktestDateTaken',
                  'totalQuestions',
                  'studentName'
                  )

    def to_representation(self, instance):
        representation = super(MockTestScoresSerializer, self).to_representation(instance)
        representation['mocktestName'] = instance.mocktest_id.mocktestName if instance.mocktest_id else None
        representation['mocktestDescription'] = instance.mocktest_id.mocktestDescription if instance.mocktest_id else None
        return representation

    def get_studentName(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"
