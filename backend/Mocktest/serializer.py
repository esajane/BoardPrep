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
    easy_count = serializers.IntegerField(read_only=True)
    medium_count = serializers.IntegerField(read_only=True)
    hard_count = serializers.IntegerField(read_only=True)
    easy_correct = serializers.IntegerField(read_only=True)
    medium_correct = serializers.IntegerField(read_only=True)
    hard_correct = serializers.IntegerField(read_only=True)
    subjects_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = MockTestScores
        fields = ('mocktestScoreID',
                  'mocktest_id',
                  'student',
                  'score',
                  'mocktestDateTaken',
                  'totalQuestions',
                  'studentName',
                  'easy_count',
                  'medium_count',
                  'hard_count',
                  'easy_correct',
                  'medium_correct',
                  'hard_correct',
                  'subjects_count'
                  )

    def to_representation(self, instance):
        representation = super(MockTestScoresSerializer, self).to_representation(instance)
        representation['mocktestName'] = instance.mocktest_id.mocktestName if instance.mocktest_id else None
        representation['mocktestDescription'] = instance.mocktest_id.mocktestDescription if instance.mocktest_id else None
        representation['easy_count'] = instance.easy_count
        representation['medium_count'] = instance.medium_count
        representation['hard_count'] = instance.hard_count
        representation['easy_correct'] = instance.easy_correct
        representation['medium_correct'] = instance.medium_correct
        representation['hard_correct'] = instance.hard_correct
        representation['subjects_count'] = instance.subjects_count
        return representation

    def get_studentName(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"

