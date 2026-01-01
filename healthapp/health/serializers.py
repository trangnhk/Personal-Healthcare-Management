from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import *
class HealthMetricSerializer(ModelSerializer):
    class Meta:
        model = HealthMetric
        fields = [
            "id",
            "water_intake",
            "steps",
            "heart_rate",
            "calories",
            "recorded_at"
        ]
        read_only_fields = ["id", "recorded_at"]

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user

        return HealthMetric.objects.create(user=user, **validated_data)

class HealthDiarySerializer(ModelSerializer):
    class Meta:
        model = HealthDiary
        fields = [
            "id",
            "content",
            "workout_plan",
            "created_date"
        ]

        read_only_fields = ["id", "created_date"]

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user

        return HealthDiary.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        request = self.context.get("request")

        # Not allowed update another user
        if request and request.user != instance:
            raise ValidationError({"error": "YOU CANNOT UPDATE ANOTHER USER!"})

        new_content = validated_data.pop("content", None)

        