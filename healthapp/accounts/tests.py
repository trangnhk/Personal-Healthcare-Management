from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.exceptions import ValidationError

from .models import User, UserRole, ClientProfile, ExpertProfile

User = get_user_model()

class UserModelTest(TestCase):
    def test_create_client_user(self):
        user = User.objects.create_user(username="client_test", password="123")
        self.assertEqual(user.role, UserRole.CLIENT)
        self.assertTrue(user.check_password("123"))

    def test_create_expert_user(self):
        user = User.objects.create_user(username="expert_test", password="123", role=UserRole.EXPERT)
        self.assertEquals(user.role, UserRole.EXPERT)
        self.assertTrue(user.check_password("123"))

class ProfileTest(TestCase):
    def setUp(self):
        self.client_user = User.objects.create_user(
            username="client_1",
            password="123",
            role=UserRole.CLIENT
        )

        self.expert_user = User.objects.create_user(
            username="expert_1",
            password="123",
            role=UserRole.EXPERT
        )

    def test_client_cannot_create_expert_profile(self):
        profile = ExpertProfile(
            user=self.client_user,
            experience=2,
            bio="Test profile"
        )

        with self.assertRaises(ValidationError):
            profile.full_clean()

    def test_create_client_profile_twice(self):
        ClientProfile.objects.create(
            user=self.client_user,
            height=170,
            weight=60,
            health_goal="Fit"
        )
        with self.assertRaises(Exception):
            ClientProfile.objects.create(
                user=self.client_user,
                height=175,
                weight=65,
                health_goal="Lose weight"
            )

