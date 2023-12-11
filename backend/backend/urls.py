from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static
from Course import views
from Course.views import CourseListViewSet, CourseDetailViewSet, SyllabusViewSet, LessonViewSet, FileUploadViewSet, PageViewSet
from Class.views import ClassViewSet, PostViewSet, CommentViewSet, JoinRequestViewSet, ActivityViewSet, SubmissionViewSet, AttachmentViewSet
from Mocktest.views import MockTestViewSet, MockQuestionsViewSet, MockTestScoresViewSet, submit_mocktest
from User.views import StudentViewSet, TeacherViewSet
from Course.views import success_view
from Course.views import page_create_or_edit

router = routers.DefaultRouter()
router.register(r'courses', CourseListViewSet, basename='course')
router.register(r'course/details', CourseDetailViewSet, basename='coursedetail')
router.register(r'syllabi', SyllabusViewSet, basename='syllabus')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'file-upload', FileUploadViewSet, basename='fileupload')
router.register(r'classes', ClassViewSet, basename='class')
# Other viewsets that need basename
router.register(r'posts', PostViewSet, basename='posts')
router.register(r'comments', CommentViewSet, basename='comments')
router.register(r'mocktest', MockTestViewSet, basename='mocktest')
router.register(r'questions', MockQuestionsViewSet, basename='questions')
router.register(r'scores', MockTestScoresViewSet, basename='scores')
router.register(r'student', StudentViewSet, basename='student')
router.register(r'teacher', TeacherViewSet, basename='teacher')
router.register(r'join-requests', JoinRequestViewSet, basename='join-requests')
router.register(r'activities', ActivityViewSet, basename='activities')
router.register(r'submissions', SubmissionViewSet, basename='submissions')
router.register(r'attachments', AttachmentViewSet)


#pagkuha og indibidwal nga mga kurso

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('lessons/by_syllabus/<str:syllabus_id>/', LessonViewSet.as_view({'get': 'by_syllabus'}), name='lessons-by-syllabus'),
    path("ckeditor5/", include('django_ckeditor_5.urls')),
    path('ckeditor/', include('ckeditor_uploader.urls')),
    path('success/', success_view, name='success_page'),
    path('', include('User.urls')),
    path('', include('Discussion.urls')),
    re_path(r'^syllabi/(?P<course_id>[^/.]+)/$', SyllabusViewSet.as_view({'get': 'by_course'})),
    #path('create-lesson/', views.create_lesson, name='create_lesson'),
    path('mocktest/<int:mocktest_id>/submit', submit_mocktest, name='submit_mocktest'),

    #path for payment and subscriptions
    path('', include('Subscription.urls')),

    path('create-page/', views.create_page, name='create_page'),
    path('lessons/<str:lesson_id>/pages/', LessonViewSet.as_view({'get': 'get_lesson_pages'}), name='lesson-pages'),
    path('pages/<str:lesson_id>/', PageViewSet.as_view({'get': 'by_lesson'}), name='pages-by-lesson'),
    path('lessons/page/new/', page_create_or_edit, name='create_page'),
    # URL pattern for editing an existing page
    path('lessons/<str:lesson_id>/page/<int:page_number>/edit/', page_create_or_edit, name='edit_page'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
