from rest_framework import serializers

from .models import Student, Teacher, User, Specialization, ContentCreator

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ('registration_date', 'last_login')

class StudentSerializer(UserSerializer):
    institution_id = serializers.PrimaryKeyRelatedField(read_only=True)
    subscription = serializers.PrimaryKeyRelatedField(read_only=True)
    specialization_name = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ['user_name', 'password', 'first_name', 'last_name', 'email', 'registration_date', 'last_login', 'specialization', 'institution_id', 'subscription', 'specialization_name', 'is_premium']
        read_only_fields = ('registration_date', 'last_login')

    def get_specialization_name(self, obj):
        return obj.specialization.name if obj.specialization else None

class TeacherSerializer(UserSerializer):
    institution_id = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Teacher
        fields = ['user_name', 'password', 'first_name', 'last_name', 'email', 'registration_date', 'last_login', 'specialization', 'institution_id', 'is_premium']
        read_only_fields = ('registration_date', 'last_login')

class ContentCreatorSerializer(UserSerializer):
    institution_id = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = ContentCreator
        fields = ['user_name', 'password', 'first_name', 'last_name', 'email', 'registration_date', 'last_login', 'specialization', 'institution_id', 'is_premium']
        read_only_fields = ('registration_date', 'last_login')
