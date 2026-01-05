from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter

from .views import ExerciseViewSet, WorkoutPlanViewSet, WorkoutPlanExerciseViewSet
router = DefaultRouter()
router.register(r'exercises', ExerciseViewSet, basename='exercise')
router.register(r'workout-plans', WorkoutPlanViewSet, basename='workout-plan')

# nested: workout-plans/{id}/exercises --> List exercise in workout plan _ id
workout_plan_router = NestedDefaultRouter(router, r'workout-plans', lookup='workout_plan')
workout_plan_router.register(r'exercises', WorkoutPlanExerciseViewSet, basename='workout-plan-exercises')


urlpatterns = [
    path('', include(router.urls + workout_plan_router.urls))
]