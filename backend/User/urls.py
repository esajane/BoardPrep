from django.urls import path
from .views import StudentLogin, TeacherLogin, StudentRegister, TeacherRegister, UserLogin

urlpatterns = [
    path('login/user/', UserLogin.as_view(), name='user_login'),
    path('login/student/', StudentLogin.as_view(), name='student_login'),
    path('login/teacher/', TeacherLogin.as_view(), name='teacher_login'),
    path('register/student/', StudentRegister.as_view(), name='student_login'),
    path('register/teacher/', TeacherRegister.as_view(), name='teacher_login'),
]