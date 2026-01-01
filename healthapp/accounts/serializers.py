from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import *

class UserPublicSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "avatar"]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.avatar:
            data["avatar"] = instance.avatar.url

        return data

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "password",
            "email",
            "role",
            "gender",
            "avatar"
        ]
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }
        read_only_fields = ["username", "role"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.avatar:
            data["avatar"] = instance.avatar.url

        return data

    def update(self, instance, validated_data):
        request = self.context.get("request")

        # Not allowed update another user
        if request and request.user != instance:
            raise ValidationError({"error": "YOU CANNOT UPDATE ANOTHER USER!"})

        # update password
        new_password = validated_data.pop("password", None)

        if new_password:
            old_password = request.data.get("old_password")

            if not old_password:
                raise ValidationError({"old_password": "YOU NEED PROVIDE YOUR OLD PASSWORD!"})
            if not instance.check_password(old_password):
                raise ValidationError({"old_password": "YOUR OLD PASSWORD IS INCORRECT!"})

            instance.set_password(new_password)
            instance.save()

        # update other fields
        allowed_fields = {"first_name", "last_name", "email", "avatar"}

        if set(validated_data.keys()) - allowed_fields:
            raise ValidationError({"error": "THIS FIELD CANNOT BE UPDATED"})

        return super().update(instance, validated_data)

class RegisterSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ["username", "password", "email", "role"]
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data["role"]
        )

        return user



class ClientProfileSerializer(ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    bmi = serializers.SerializerMethodField()

    class Meta:
        model = ClientProfile
        fields = [
            "id",
            "user",
            "height",
            "weight",
            "health_goal",
            "bmi",
        ]

    def get_bmi(self, obj):
        return obj.bmi()

class ExpertProfileSerializer(ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ExpertProfile
        fields = [
            "id",
            "user",
            "experience",
            "rating",
            "bio"
        ]
        read_only_fields = ["rating"]

class ExpertClientSerializer(ModelSerializer):
    expert = serializers.StringRelatedField()
    client = serializers.StringRelatedField()

    class Meta:
        model = ExpertClientAssignment
        fields = [
            "id",
            "expert",
            "client",
            "created_date",
            "is_active"
        ]
        read_only_fields = fields

class ClientDetailSerializer(ModelSerializer):
    client_profile = ClientProfileSerializer()
    experts = UserPublicSerializer(many=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "client_profile",
            "experts"
        ]

class ChattingSerializer(ModelSerializer):
    sender = UserPublicSerializer(read_only=True)
    receiver = UserPublicSerializer(read_only=True)

    class Meta:
        model = Chatting
        fields = [
            "id",
            "sender",
            "receiver",
            "content",
            "sent_at"
        ]
        read_only_fields = ["id", "sender", "sent_at"]

    def create(self, validated_data):
        request = self.context.get("request")
        receiver_id = request.data.get("receiver_id")

        if not receiver_id:
            raise ValidationError({"receiver_id": "YOU NEED PROVIDE WHO IS RECEIVER"})

        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            raise ValidationError({"receiver_id": "INVALID USER"})

        return Chatting.objects.create(sender=request.user, receiver=receiver, content=validated_data['content'])

