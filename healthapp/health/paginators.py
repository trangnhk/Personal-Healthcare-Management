from rest_framework.pagination import CursorPagination

class HealthDiaryCursorPagination(CursorPagination):
    page_size = 5
    ordering = ('-created_date', 'id')