from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from .models import *
from accounts.models import UserRole
from accounts.serializers import UserPublicSerializer


class ExerciseSerializer(ModelSerializer):
    created_by = UserPublicSerializer()
    class Meta:
        model = Exercise
        fields = '__all__'
        read_only_fields = ["id", "created_date", "created_by"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.image:
            data["image"] = instance.image.url

        return data

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user

        return Exercise.objects.create(created_by=user, **validated_data)

    def update(self, instance, validated_data):
        # request = self.context.get("request")
        # user = request.user

        # if instance.created_by != user:
        #     raise ValidationError({"error": "YOU CAN ONLY UPDATE YOUR OWN EXERCISE"})

        allowed_fields = {"name", "muscle_group", "description", "calories_per_minute", "is_public"}
        if set(validated_data.keys()) - allowed_fields:
            raise ValidationError({"error": "THIS FIELDS CANNOT BE UPDATED"})

        return super().update(instance, validated_data)

class WorkoutPlanSerializer(ModelSerializer):
    class Meta:
        model = WorkoutPlan
        fields = [
            "id",
            "user",
            "expert",
            "title",
            "created_date"
        ]
        read_only_fields = ["id", "created_date"]

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user

        expert = None
        if user.role == UserRole.EXPERT:
            expert = user

        return WorkoutPlan.objects.create(user=user, expert=expert, **validated_data)

    def update(self, instance, validated_data):
        # request = self.context.get("request")
        # user = request.user
        # expert = instance.expert
        #
        # print(f"USER: {user} - EXPERT: {expert}")
        #
        # if expert and not user.__eq__(expert):
        #     raise ValidationError({"error": "THIS WORKOUT PLAN IS CREATED BY EXPERT! ONLY EXPERT CAN UPDATE"})
        # # if instance.user != user:
        # #         raise ValidationError({"error": "YOU CAN ONLY UPDATE YOUR OWN WORKOUT PLAN"})
        # if instance.user.__eq__(user) or expert.__eq__(user):
        allowed_fields = {"title"}
        if set(validated_data.keys()) - allowed_fields:
            raise ValidationError({"error": "THIS FIELDS CANNOT BE UPDATED"})

        return super().update(instance, validated_data)


class WorkoutPlanExerciseSerializer(ModelSerializer):
    workout_plan = serializers.StringRelatedField()
    exercise = serializers.StringRelatedField()

    exercise_id = serializers.PrimaryKeyRelatedField(
        queryset=Exercise.objects.all(),
        source="exercise"
    )
    class Meta:
        model = WorkoutPlanExercise
        fields = [
            "id",
            "workout_plan",
            "exercise",
            "exercise_id",
            "duration",
            "sets",
            "reps",
            "rest_seconds"
        ]
        read_only_fields = ["id", "workout_plan", "exercise"]
        extra_kwargs = {
            'exercise_id': {
                'write_only': True
            }
        }

    def validate_exercise_id(self, exercise):
        request = self.context["request"]
        workout_plan = self.context["workout_plan"]
        user = request.user

        # Exercise PUBLIC
        if exercise.is_public:
            return exercise

        # Exercise created by CURRENT USER
        if exercise.created_by == user:
            return exercise


        if (
                workout_plan.expert
                and exercise.created_by == workout_plan.expert
                and user == workout_plan.user
        ):
            return exercise

        raise ValidationError("YOU DO NOT HAVE PERMISSION TO USE THIS EXERCISE")
    def create(self, validated_data):
        request = self.context.get("request")
        workout_plan = self.context.get("workout_plan")
        user = request.user

        if user != workout_plan.user and user != workout_plan.expert:
            raise ValidationError({"error": "YOU CANNOT MODIFY THIS WORKOUT PLAN"})

        return WorkoutPlanExercise.objects.create(workout_plan=workout_plan, **validated_data)


