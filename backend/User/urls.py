from django.urls import path
from .views import StudentLogin, TeacherLogin

urlpatterns = [
    path('login/student/', StudentLogin.as_view(), name='student_login'),
    path('login/teacher/', TeacherLogin.as_view(), name='teacher_login'),
]