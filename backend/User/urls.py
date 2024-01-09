from django.urls import path
from .views import StudentLogin, TeacherLogin, StudentRegister, TeacherRegister, UserLogin, UserLogout, UserView, ContentCreatorLogin, ContentCreatorRegister, GetUser, UpdateUser

urlpatterns = [
    path('login/user/', UserLogin.as_view(), name='user_login'),
    path('login/student/', StudentLogin.as_view(), name='student_login'),
    path('login/teacher/', TeacherLogin.as_view(), name='teacher_login'),
    path('login/content-creator/', ContentCreatorLogin.as_view(), name='content_creator_login'),
    path('register/student/', StudentRegister.as_view(), name='student_register'),
    path('register/teacher/', TeacherRegister.as_view(), name='teacher_register'),
    path('register/content-creator/', ContentCreatorRegister.as_view(), name='content_creator_register'),
    path('logout/', UserLogout.as_view(), name='user_logout'),
    path('user/', UserView.as_view(), name='user_view'),
    path('get/user/', GetUser.as_view(), name='user_view'),
    path('update/user/', UpdateUser.as_view(), name='user_update'),
]