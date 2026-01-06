from django.contrib import admin

from .models import *
from accounts.models import User, UserRole

@admin.register(HealthDiary)
class HealthDiaryAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'workout_plan', 'created_date', 'image']
    search_fields = ['id', 'user', 'workout_plan']

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "user":
            kwargs["queryset"] = User.objects.filter(role=UserRole.CLIENT)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class HealthMetricAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'workout_plan', 'water_intake', 'steps', 'calories', 'recorded_at']
    search_fields = ['id', 'user', 'workout_plan']

@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'workout_plan', 'message', 'remind_at', 'is_done']
    list_filter = ['user', 'workout_plan']
    search_fields = ['workout_plan', 'user']

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "user":
            kwargs["queryset"] = User.objects.filter(role=UserRole.CLIENT)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


# admin.site.register(HealthDiary, HealthDiaryAdmin)
admin.site.register(HealthMetric, HealthMetricAdmin)
# admin.site.register(Reminder, ReminderAdmin)
