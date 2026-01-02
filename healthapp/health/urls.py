from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import HealthMetricViewSet

router = DefaultRouter()
router.register(r'healthmetrics', HealthMetricViewSet, basename='healthmetric')

urlpatterns = [
    path('', include(router.urls))
]