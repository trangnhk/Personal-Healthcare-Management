from rest_framework import viewsets, generics, status, parsers, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import User, UserRole, Chatting
from .serializers import RegisterSerializer, UserPublicSerializer, ClientDetailSerializer, \
    UserSerializer, ChattingSerializer, ExpertDetailSerializer, CurrentUserSerializer
from healthapp import perms
from .paginators import ChattingCursorPagination

class UserViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.UpdateAPIView, generics.ListAPIView):
    queryset = User.objects.filter(is_active=True)
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    # permission_classes = [perms.IsOwner]
    http_method_names = ["get", "post", "patch"]

    # permission
    def get_permissions(self):
        if self.action in ["create", "experts", "expert_detail"]:
            return [permissions.AllowAny()]

        if self.action in ["current_user", "partial_update"]:
            return  [permissions.IsAuthenticated()]

        return [permissions.IsAdminUser()]

    # serializer
    def get_serializer_class(self):
        if self.action.__eq__("create"):
            return RegisterSerializer

        if self.action.__eq__("experts"):
            return UserPublicSerializer

        if self.action.__eq__("expert_detail"):
            return ExpertDetailSerializer

        return UserSerializer

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(
            UserPublicSerializer(user).data,
            status=status.HTTP_201_CREATED
        )
    @action(methods=["get"], detail=False, url_path="current-user")
    def current_user(self, request):
        serializer = CurrentUserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["get"], detail=False, url_path="experts")
    def experts(self, request):
        experts = User.objects.filter(role=UserRole.EXPERT, is_active=True)

        serializer = UserPublicSerializer(experts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["get"], detail=True, url_path="expert-detail")
    def expert_detail(self, request, pk=None):
        try:
            expert = User.objects.get(pk=pk, role=UserRole.EXPERT, is_active=True)
        except User.DoesNotExist:
            return Response({"error": "EXPERT NOT FOUND"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ExpertDetailSerializer(expert)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ChatViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView):
    permission_classes = [perms.IsOwner]
    serializer_class = ChattingSerializer
    pagination_class = ChattingCursorPagination

    def list(self, request, *args, **kwargs):
        user = request.user

        chats = Chatting.objects.filter(sender=user) | Chatting.objects.filter(receiver=user)

        chats = chats.select_related("sender", "receiver").order_by("-sent_at")

        serializer = self.get_serializer(chats, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = ChattingSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        chat = serializer.save()

        return Response(ChattingSerializer(chat).data, status=status.HTTP_201_CREATED)

    @action(methods=["get"], detail=False, url_path=r"with/(?P<user_id>[^/.]+)")
    def chat_with_user(self, request, user_id=None):
        user = request.user

        try:
            other_user = User.objects.get(pk=user_id, is_active=True)
        except User.DoesNotExist:
            return Response({"error": "EXPERT NOT FOUND"}, status=status.HTTP_404_NOT_FOUND)

        chats = Chatting.objects.filter(sender=user, receiver=other_user) | Chatting.objects.filter(sender=other_user, receiver=user)
        chats = chats.select_related("sender", "receiver").order_by("sent_at")

        serializer = ChattingSerializer(chats, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)