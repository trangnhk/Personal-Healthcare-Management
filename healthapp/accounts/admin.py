from django.contrib import admin

from .models import *

class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'role', 'dob', 'gender', 'avatar']
    search_fields = ['id', 'role']
    list_filter = ['role']

@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'height', 'weight', 'created_date']
    list_filter = ['created_date']
    search_fields = ['user__username']

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "user":
            kwargs["queryset"] = User.objects.filter(role=UserRole.CLIENT)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

@admin.register(ExpertProfile)
class ExpertProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'experience', 'rating', 'created_date']
    list_filter = ['created_date']
    search_fields = ['user__username']

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "user":
            kwargs["queryset"] = User.objects.filter(role=UserRole.EXPERT)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class ChattingAdmin(admin.ModelAdmin):
    list_display = ['id', 'sender', 'receiver', 'sent_at']
    search_fields = ['sender', 'receiver']
    list_filter = ['sent_at']

admin.site.site_header = "Hệ thống quản lý sức khỏe cá nhân"

admin.site.register(User, UserAdmin)
# admin.site.register(ClientProfile, ClientProfileAdmin)
# admin.site.register(ExpertProfile, ExpertProfileAdmin)
admin.site.register(ExpertClientAssignment)
admin.site.register(Chatting, ChattingAdmin)
