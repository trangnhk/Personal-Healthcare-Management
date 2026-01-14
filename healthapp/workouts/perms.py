from rest_framework.permissions import IsAuthenticated

class IsExerciseCreator(IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return obj.created_by == request.user

class IsWorkoutPlanCreator(IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        if obj.expert is not None:
            return obj.expert == request.user

        return obj.user == request.user

class IsWorkoutPlanMember(IsAuthenticated):
    def has_permission(self, request, view):
        plan = view.get_workout_plan()
        return request.user in [plan.user, plan.expert]