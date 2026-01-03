from rest_framework.permissions import IsAuthenticated

class IsOwner(IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj) and obj.user == request.user