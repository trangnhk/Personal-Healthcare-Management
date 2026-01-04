from rest_framework.permissions import IsAuthenticated

class IsWorkoutPlanCreator(IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        if obj.expert is not None:
            return obj.expert == request.user

        return super().has_object_permission(request, view, obj) and obj.user == request.user