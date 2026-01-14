from django.contrib import admin

from .models import *
from accounts.models import User, UserRole

class ExerciseAdmin(admin.ModelAdmin):
    list_display = ["id", "created_by", "name", "is_public", "created_date"]

class WorkoutPlanExercisesAdmin(admin.ModelAdmin):
    list_display = ['id', 'workout_plan', 'exercise', 'duration', 'sets']
    list_filter = ['exercise', 'workout_plan']
    search_fields = ['exercise']
    sortable_by = ['workout_plan']

@admin.register(WorkoutPlan)
class WorkoutPlanAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "expert", "title", "created_date"]
    sortable_by = ["-user"]
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "user":
            kwargs["queryset"] = User.objects.filter(role=UserRole.CLIENT)

        if db_field.name == "expert":
            kwargs["queryset"] = User.objects.filter(role=UserRole.EXPERT)

        return super().formfield_for_foreignkey(db_field, request, **kwargs)


admin.site.register(WorkoutPlanExercise, WorkoutPlanExercisesAdmin)
admin.site.register(Exercise, ExerciseAdmin)
