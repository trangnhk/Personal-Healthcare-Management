from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ExerciseViewSet, WorkoutPlanViewSet
router = DefaultRouter()
router.register(r'exercises', ExerciseViewSet, basename='exercise')
router.register(r'workoutplans', WorkoutPlanViewSet, basename='workoutplan')

urlpatterns = [
    path('', include(router.urls))
]