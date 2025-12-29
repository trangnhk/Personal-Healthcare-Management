from django.db import models
from django.conf import settings
from accounts.models import UserRole
from workouts.models import WorkoutPlan
from ckeditor.fields import RichTextField


class HealthMetric(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="health_metrics")
    workout_plan = models.ForeignKey(WorkoutPlan, on_delete=models.SET_NULL, null=True, blank=True,
                                     related_name="metrics")

    water_intake = models.FloatField(default=0.0)
    steps = models.IntegerField(default=0)
    heart_rate = models.IntegerField(null=True, blank=True)
    calories = models.FloatField(default=0.0)

    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.recorded_at}"


class HealthDiary(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="diaries")
    workout_plan = models.ForeignKey(WorkoutPlan, on_delete=models.SET_NULL, null=True, blank=True, related_name="plan_diaries")

    content = RichTextField()
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.created_date}"

class Reminder(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reminders", limit_choices_to={'role':UserRole.CLIENT})
    workout_plan = models.ForeignKey(WorkoutPlan, on_delete=models.SET_NULL, null=True, blank=True, related_name="plan_reminders")

    message = models.CharField(max_length=255)
    remind_at = models.DateTimeField()
    is_done = models.BooleanField(default=False)

    def __str__(self):
        return self.message

