from django.db import models
from django.conf import settings

from accounts.models import UserRole


class Exercise(models.Model):
    name = models.CharField(max_length=200)
    calories_per_minute = models.FloatField(default=0)
    muscle_group = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class WorkoutPlan(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="workout_plans")
    expert = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_plans", limit_choices_to={'role': UserRole.EXPERT})
    title = models.CharField(max_length=200)
    created_date = models.DateTimeField(auto_now_add=True)

    # exercise - workoutplan: Many to Many
    exercises = models.ManyToManyField(Exercise, through="WorkoutPlanExercise", related_name="workout_plans")

    def __str__(self):
        return self.title

class WorkoutPlanExercise(models.Model):
    workout_plan = models.ForeignKey(WorkoutPlan, on_delete=models.CASCADE, related_name="plan_exercises")
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name="exercise_plans")

    duration = models.IntegerField(help_text="Duration in minutes")
    sets = models.IntegerField(default=1)
    reps = models.IntegerField(default=10)
    rest_seconds = models.IntegerField(default=60)

    class Meta:
        unique_together = ('workout_plan', 'exercise')

    def __str__(self):
        return f"{self.workout_plan.title} - {self.exercise.name}"


