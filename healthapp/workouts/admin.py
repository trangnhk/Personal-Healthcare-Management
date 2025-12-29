from django.contrib import admin

from .models import *

class WorkoutPlanExercisesAdmin(admin.ModelAdmin):
    list_display = ['id', 'workout_plan', 'exercise', 'duration', 'sets']
    list_filter = ['exercise', 'workout_plan']
    search_fields = ['exercise']
    sortable_by = ['workout_plan']

admin.site.register(WorkoutPlan)
admin.site.register(WorkoutPlanExercise, WorkoutPlanExercisesAdmin)
admin.site.register(Exercise)
