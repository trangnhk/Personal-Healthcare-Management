from django.db.models import Q
from rest_framework import viewsets, generics, status, parsers, permissions
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .serializers import ExerciseSerializer, WorkoutPlanExerciseSerializer, WorkoutPlanSerializer
from .models import Exercise, WorkoutPlanExercise, WorkoutPlan

from healthapp import perms
from .perms import IsWorkoutPlanCreator

class ExerciseViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.DestroyAPIView, generics.UpdateAPIView):
    # queryset = Exercise.object.filter(is_public=True)
    serializer_class = ExerciseSerializer
    # permission_classes = [perms.IsOwner]
    http_method_names = ["get", "post", "patch", "delete"]

    def get_permissions(self):
        if self.action == "list":
            return [permissions.AllowAny()]
        return [perms.IsOwner()]

    def get_queryset(self):
        user = self.request.user

        if user.is_authenticated:
            return Exercise.objects.filter(
                Q(is_public=True) | Q(created_by=user)
            ).order_by("-created_date")

        return Exercise.objects.filter(is_public=True).order_by("-created_date")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        exercise = serializer.save()

        return Response(self.get_serializer(exercise).data, status=status.HTTP_201_CREATED)

class WorkoutPlanViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.UpdateAPIView):
    serializer_class = WorkoutPlanSerializer
    # permission_classes = [perms.IsOwner, IsCreator]
    http_method_names = ["get", "post", "patch"]

    def get_permissions(self):
        if self.action == "partial_update":
            return [IsWorkoutPlanCreator()]
        return [perms.IsOwner()]
    def get_queryset(self):
        user = self.request.user

        return WorkoutPlan.objects.filter(Q(user=user) | Q(expert=user)).order_by("-created_date")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        workout_plan = serializer.save()

        return Response(self.get_serializer(workout_plan).data, status=status.HTTP_201_CREATED)



