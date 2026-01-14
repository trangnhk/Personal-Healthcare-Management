from django.db.models import Q
from rest_framework import viewsets, generics, status, parsers, permissions, filters
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import ExerciseSerializer, WorkoutPlanExerciseSerializer, WorkoutPlanSerializer
from .models import Exercise, WorkoutPlanExercise, WorkoutPlan

from healthapp import perms
from .perms import IsWorkoutPlanCreator, IsExerciseCreator, IsWorkoutPlanMember
# IsWorkoutPlanExerciseCreator
from .paginators import ExerciseCursorPagination, WorkoutPlanCursoPagination, WorkoutPlanExercisePagination


class ExerciseViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.DestroyAPIView, generics.UpdateAPIView, generics.RetrieveAPIView):
    serializer_class = ExerciseSerializer
    http_method_names = ["get", "post", "patch", "delete"]
    pagination_class = ExerciseCursorPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        if self.action in ["partial_update", "destroy"]:
            return [IsExerciseCreator()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user

        if user.is_authenticated:
            return Exercise.objects.filter(
                Q(is_public=True) | Q(created_by=user)
            ).order_by("-created_date")

        return Exercise.objects.filter(is_public=True).order_by("-created_date", "-id")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        exercise = serializer.save()

        return Response(ExerciseSerializer(exercise, context={"request": request}).data, status=status.HTTP_201_CREATED)

class WorkoutPlanViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.UpdateAPIView):
    serializer_class = WorkoutPlanSerializer
    # permission_classes = [perms.IsOwner, IsCreator]
    http_method_names = ["get", "post", "patch"]
    pagination_class = WorkoutPlanCursoPagination
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action == "partial_update":
            return [IsWorkoutPlanCreator()]
        return [permissions.IsAuthenticated()]
    def get_queryset(self):
        user = self.request.user

        return WorkoutPlan.objects.filter(Q(user=user) | Q(expert=user)).order_by("-created_date", "-id")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        workout_plan = serializer.save()

        return Response(WorkoutPlanSerializer(workout_plan).data, status=status.HTTP_201_CREATED)

class WorkoutPlanExerciseViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    serializer_class = WorkoutPlanExerciseSerializer
    http_method_names = ["get", "post"]
    permission_classes = [IsWorkoutPlanMember]
    parser_classes = [MultiPartParser, FormParser]
    pagination_class = WorkoutPlanExercisePagination

    def get_workout_plan(self):
        return get_object_or_404(WorkoutPlan, pk=self.kwargs["workout_plan_pk"])

    def get_queryset(self):
        plan = self.get_workout_plan()
        return WorkoutPlanExercise.objects.filter(workout_plan=plan)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["workout_plan"] = self.get_workout_plan()
        return context

    def list(self, request, *args, **kwargs):
        print(self.kwargs)
        return super().list(request, *args, **kwargs)



