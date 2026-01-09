from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import *

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User

    list_display = ['id', 'username', 'email', 'role', 'is_active']
    search_fields = ['username', 'email']
    list_filter = ['role', 'is_active']

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Thông tin cá nhân', {
            'fields': ('first_name', 'last_name', 'email', 'dob', 'gender', 'avatar')
        }),
        ('Phân quyền', {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser')
        }),
    )


    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role'),
        }),
    )

    ordering = ['id']

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

# admin.site.register(User, UserAdmin)
# admin.site.register(ClientProfile, ClientProfileAdmin)
# admin.site.register(ExpertProfile, ExpertProfileAdmin)
admin.site.register(ExpertClientAssignment)
admin.site.register(Chatting, ChattingAdmin)
