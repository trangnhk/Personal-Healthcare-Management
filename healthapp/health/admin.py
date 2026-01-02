from django.contrib import admin

from .models import *

class HealthDiaryAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'workout_plan', 'created_date']
    search_fields = ['id', 'user', 'workout_plan']

class HealthMetricAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'workout_plan', 'water_intake', 'steps', 'calories', 'recorded_at']
    search_fields = ['id', 'user', 'workout_plan']


admin.site.register(HealthDiary, HealthDiaryAdmin)
admin.site.register(HealthMetric, HealthMetricAdmin)
admin.site.register(Reminder)
