from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import HealthMetricViewSet, HealthDiaryViewSet, ReminderViewSet

router = DefaultRouter()
router.register(r'healthmetrics', HealthMetricViewSet, basename='healthmetric')
router.register(r'healthdiaries', HealthDiaryViewSet, basename='healthdiary')
router.register(r'reminders', ReminderViewSet, basename='reminder')

urlpatterns = [
    path('', include(router.urls))
]