from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import *
from accounts.models import UserRole


class HealthMetricSerializer(ModelSerializer):
    class Meta:
        model = HealthMetric
        fields = [
            "id",
            "workout_plan",
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
            "created_date",
            "image"
        ]

        read_only_fields = ["id", "created_date"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.image:
            data["image"] = instance.image.url

        return data




    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user

        return HealthDiary.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        request = self.context.get("request")

        # Not allowed update another user
        if request and request.user != instance.user:
            raise ValidationError({"error": "YOU CANNOT UPDATE ANOTHER USER!"})

        allowed_fields = {"content", "workout_plan"}
        if set(validated_data.keys()) - allowed_fields:
            raise ValidationError({"error": "ONLY CONTENT CAN BE UPDATED"})

        return super().update(instance, validated_data)

class ReminderSerializer(ModelSerializer):
    class Meta:
        model = Reminder
        fields = [
            "id",
            "workout_plan",
            "message",
            "remind_at",
            "is_done",
        ]
        read_only_fields = ["id", "is_done"]

    def validate_remind_at(self, value):
        if value < timezone.now() and value.__eq__(timezone.now()):
            raise ValidationError("REMIND TIME MUST BE IN THE FUTURE")
        return value

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user

        if user.role != UserRole.CLIENT:
            raise ValidationError({"error": "ONLY CLIENT CAN CREATE REMINDER"})

        return Reminder.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):

        allowed_fields = {"message", "remind_at", "workout_plan"}
        if set(validated_data.keys()) - allowed_fields:
            raise ValidationError({"error": "THIS FIELD CANNOT BE UPDATED"})

        return super().update(instance, validated_data)

