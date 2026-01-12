from rest_framework.pagination import CursorPagination

class ExerciseCursorPagination(CursorPagination):
    ordering = '-created_date'

class WorkoutPlanCursoPagination(CursorPagination):
    page_size = 2
    ordering = ('-created_date', '-id')