from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static
from Course.views import CourseListViewSet, CourseDetailViewSet, SyllabusViewSet, LessonViewSet, PageViewSet, ParagraphViewSet
from Mocktest.views import MockTestViewSet, MockQuestionsViewSet, MockTestScoresViewSet, submit_mocktest
from Class.views import ClassViewSet, PostViewSet, CommentViewSet, JoinRequestViewSet, ActivityViewSet, SubmissionViewSet, AttachmentViewSet
from User.views import StudentViewSet, TeacherViewSet

router = routers.DefaultRouter()
router.register(r'courses', CourseListViewSet)
router.register(r'course/details', CourseDetailViewSet)
router.register(r'syllabi', SyllabusViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'pages', PageViewSet)
router.register(r'paragraphs', ParagraphViewSet)
router.register(r'classes', ClassViewSet)
router.register(r'posts', PostViewSet, basename='posts')
router.register(r'mocktest', MockTestViewSet, basename='mocktest')
router.register(r'questions', MockQuestionsViewSet, basename='questions')
router.register(r'comments', CommentViewSet, basename='comments')
router.register(r'scores', MockTestScoresViewSet)
router.register(r'student', StudentViewSet)
router.register(r'teacher', TeacherViewSet)
router.register(r'join-requests', JoinRequestViewSet, basename='join-requests')
router.register(r'activities', ActivityViewSet, basename='activities')
router.register(r'submissions', SubmissionViewSet, basename='submissions')
router.register(r'attachments', AttachmentViewSet)

#pagkuha og indibidwal nga mga kurso

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('', include('User.urls')),
    path('mocktest/<int:mocktest_id>/submit/', submit_mocktest, name='submit-mocktest'),
    re_path(r'^syllabi/(?P<course_id>[^/.]+)/$', SyllabusViewSet.as_view({'get': 'by_course'})),
    re_path(r'^lessons/(?P<course_id>[^/.]+)/$', LessonViewSet.as_view({'get': 'by_course'})),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)