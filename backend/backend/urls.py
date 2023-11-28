from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static

from Course.views import CourseListViewSet, CourseDetailViewSet, SyllabusViewSet, LessonViewSet

router = routers.DefaultRouter()
router.register(r'courses', CourseListViewSet)
router.register(r'course/details', CourseDetailViewSet)
router.register(r'syllabi', SyllabusViewSet)
router.register(r'lessons', LessonViewSet)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
