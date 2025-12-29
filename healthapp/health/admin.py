from django.contrib import admin

from .models import *

admin.site.register(HealthDiary)
admin.site.register(HealthMetric)
admin.site.register(Reminder)
