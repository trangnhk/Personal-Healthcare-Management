from datetime import timedelta, datetime

from django.db.models import Sum
from django.utils.timezone import now
from rest_framework import viewsets, generics, status, parsers, permissions
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .serializers import HealthMetricSerializer, HealthDiarySerializer, ReminderSerializer
from .models import HealthMetric, HealthDiary, Reminder
from workouts.models import WorkoutPlan

from healthapp import perms


class HealthMetricViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.RetrieveAPIView,
                          generics.UpdateAPIView):
    serializer_class = HealthMetricSerializer
    permission_classes = [perms.IsOwner]
    http_method_names = ["get", "post", "patch", "delete"]

    def get_queryset(self):
        user = self.request.user

        return HealthMetric.objects.filter(user=user, is_deleted=False).select_related("workout_plan").order_by("-recorded_at")

    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data, context={"request": request})
    #     serializer.is_valid(raise_exception=True)
    #
    #     metric = serializer.save()
    #
    #     return Response(self.get_serializer(metric).data, status=status.HTTP_201_CREATED)

    # def update(self, request, *args, **kwargs):
    #     metric = self.get_object()
    #
    #     if metric.user != request.user:
    #         return ValidationError({"error": "YOU CANNOT UPDATE THIS METRIC"})
    #
    #     return super().update(request, *args, **kwargs)

    @action(methods=["post"], detail=True, url_path="soft_delete")
    def soft_delete(self, request):
        metric = self.get_object()

        # if metric.user != request.user:
        #     return ValidationError({"error": "YOU CANNOT DELETE THIS METRIC"})

        metric.soft_delete()

        return Response({"message": "HEALTH METRIC IS DELETED"}, status=status.HTTP_200_OK)

    @action(methods=["get"], detail=False, url_path="stats/weekly")
    def weekly_stats(self, request):
        start_date = now() - timedelta(days=7)

        query_set = self.get_queryset().filter(recorded_at__gte=start_date)

        data = query_set.aggregate(total_steps=Sum("steps"), total_calories=Sum("calories"), total_water=Sum("water_intake"))

        return Response(data, status=status.HTTP_200_OK)

    @action(methods=["get"], detail=False, url_path="stats/monthly")
    def monthly_stats(self, request):
        start_date = now() - timedelta(days=30)

        query_set = self.get_queryset().filter(recorded_at__gte=start_date)

        data = query_set.aggregate(total_steps=Sum("steps"), total_calories=Sum("calories"),
                                   total_water=Sum("water_intake"))

        return Response(data, status=status.HTTP_200_OK)

class HealthDiaryViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.DestroyAPIView, generics.UpdateAPIView):
    serializer_class = HealthDiarySerializer
    permission_classes = [perms.IsOwner]
    http_method_names = ["get", "post", "patch", "delete"]

    def get_queryset(self):
        user = self.request.user

        return HealthDiary.objects.filter(user=user).select_related("workout_plan").order_by("-created_date")

    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data, context={"request": request})
    #     serializer.is_valid(raise_exception=True)
    #
    #     diary = serializer.save()
    #
    #     return Response(self.get_serializer(diary).data, status=status.HTTP_201_CREATED)
    #
    # def destroy(self, request, *args, **kwargs):
    #     diary = self.get_object()
    #
    #
    #     diary.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)

    # def update(self, request, *args, **kwargs):
    #     diary = self.get_object()
    #
    #     if diary.user != request.user:
    #         raise ValidationError({"error": "YOU CANNOT UPDATE THIS DIARY"})
    #
    #     return super().update(request, *args, **kwargs)

    @action(methods=["get"], detail=False, url_path="by-date")
    def get_diary_by_date(self, request):
        user = self.request.user

        date_str = request.query_params.get("date")
        if not date_str:
            raise ValidationError({"date": "YOU NEED TO PROVIDE DATE"})

        try:
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            raise ValidationError({"date": "INVALID DATE FORMAT"})

        diaries = HealthDiary.objects.filter(user=user, created_date__date=date).select_related("workout_plan").order_by("created_date")

        serializer = self.get_serializer(diaries, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["get"], detail=False, url_path="by-workout")
    def get_diary_by_workout(self, request):
        user = request.user
        workout_plan_id = request.query_params.get("workout_plan")

        print(workout_plan_id)
        print("Current user:", request.user, request.user.id)

        if not workout_plan_id:
            raise ValidationError({"workout_plan": "YOU NEED TO PROVIDE WORKOUT PLAN"})

        try:
            workout_plan = WorkoutPlan.objects.get(id=workout_plan_id)
            print(workout_plan)
        except WorkoutPlan.DoesNotExist:
            raise ValidationError({"workout_plan": "INVALID WORKOUT PLAN"})

        diaries = (
            HealthDiary.objects
            .filter(user=user, workout_plan_id=workout_plan_id)
            .select_related("workout_plan")
            .order_by("-created_date")
        )
        if not diaries.exists():
            raise ValidationError({"workout_plan": "NO DIARY FOUND FOR THIS WORKOUT PLAN"})

        serializer = self.get_serializer(diaries, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class ReminderViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    serializer_class = ReminderSerializer
    permission_classes = [perms.IsOwner]
    http_method_names = ["get", "post", "patch", "delete"]

    def get_queryset(self):
        user = self.request.user

        return Reminder.objects.filter(user=user).select_related("workout_plan").order_by("remind_at")

    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data, context={"request": request})
    #     serializer.is_valid(raise_exception=True)
    #
    #     reminder = serializer.save()
    #
    #     return Response(self.get_serializer(reminder).data, status=status.HTTP_201_CREATED)


    @action(methods=["post"], detail=True, url_path="set_done")
    def set_done_reminder(self, request, pk=None):
        reminder = self.get_object()

        if reminder.is_done:
            return Response({"message": "REMINDER HAS ALREADY DONE"}, status=status.HTTP_400_BAD_REQUEST)

        reminder.set_done()

        return Response({"message": "THIS REMINDER IS SET DONE"}, status=status.HTTP_200_OK)



