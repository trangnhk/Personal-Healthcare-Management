from rest_framework.pagination import CursorPagination

class ChattingCursorPagination(CursorPagination):
    page_size = 3
    ordering = '-sent_at'