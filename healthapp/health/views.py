from datetime import timedelta

from django.db.models import Sum
from django.utils.timezone import now
from rest_framework import viewsets, generics, status, parsers, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import HealthMetricSerializer, HealthDiarySerializer
from .models import HealthMetric, HealthDiary


class HealthMetricViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.RetrieveAPIView,
                          generics.UpdateAPIView):
    serializer_class = HealthMetricSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.resquest.user

        return HealthMetric.objects.filter(user=user, is_deleted=False).select_related("workout_plan").order_by("-recorded_at")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        metric = serializer.save()

        return Response(self.get_serializer(metric).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        metric = self.get_object()

        if metric.user != request.user:
            return Response({"error": "YOU CANNOT UPDATE THIS METRIC"}, status=status.HTTP_403_FORBIDDEN)

        return super().update(request, *args, **kwargs)

    @action(methods=["post"], detail=True, url_path="soft_delete")
    def soft_delete(self, request, pk=None):
        metric = self.get_object()

        if metric.user != request.user:
            return Response({"error": "YOU CANNOT DELETE THIS METRIC"}, status=status.HTTP_403_FORBIDDEN)

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

# class HealthDiaryViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.RetrieveAPIView, generics.ListAPIView, generics.DestroyAPIView):
#     serializer_class = HealthDiarySerializer
#     permission_classes = [permissions.IsAuthenticated]







