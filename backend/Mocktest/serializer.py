from rest_framework import serializers
from Mocktest.models import MockTest, MockQuestions, MockTestScores, Difficulty


class DifficultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Difficulty
        fields = '__all__'


class MockQuestionsSerializer(serializers.ModelSerializer):
    difficulty = serializers.PrimaryKeyRelatedField(queryset=Difficulty.objects.all())
    class Meta:
        model = MockQuestions
        fields = '__all__'


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
    feedback = serializers.CharField(read_only=True)
    subjects = serializers.CharField(read_only=True)
    subjects_correct = serializers.CharField(read_only=True)
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
                  'subjects_count',
                  'feedback',
                  'subjects',
                  'subjects_correct'
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
        representation['feedback'] = instance.feedback
        return representation

    def get_studentName(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"

