from django.db import models
from django.contrib.auth.models import  AbstractUser
from cloudinary.models import CloudinaryField

# USER
class Gender(models.TextChoices):
    MALE = 'Male'
    FEMALE = 'Female'


class UserRole(models.TextChoices):
    CLIENT = 'client', 'Client'
    EXPERT = 'expert', 'Expert'
    ADMIN = 'admin', 'Admin'

AbstractUser.username.field.error_messages['unique'] = 'Tên đăng nhập đã tồn tại!'
class User(AbstractUser):
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.CLIENT)

    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=10,
        choices=Gender.choices,
        null=True,
        blank=True
    )
    avatar = CloudinaryField(null=True, blank=True)

    # client - expert: ManyToMany
    experts = models.ManyToManyField('self',
                                     through="ExpertClientAssignment",
                                     symmetrical=False,
                                     related_name="clients")  # 'self' -> vì client và expert đều là user

    def __str__(self):
        return f"{self.username} ({self.role})"


class ExpertClientAssignment(models.Model):
    expert = models.ForeignKey(User, on_delete=models.CASCADE, related_name="expert_assignment",
                               limit_choices_to={'role': UserRole.EXPERT})
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name="client_assignment",
                               limit_choices_to={'role': UserRole.CLIENT})
    created_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('expert', 'client')

    def __str__(self):
        return f"{self.expert.username} - {self.client.username}"


class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')

    height = models.FloatField(help_text="Height (cm)")
    weight = models.FloatField(help_text="Weight (kg)")
    health_goal = models.TextField(max_length=500, help_text="GIVE A SPECIFICALLY SIMPLE GOAL")

    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name()}'s healthcare profile"

    def bmi(self):
        return round(self.weight / ((self.height / 100) ** 2), 2)


class ExpertProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='expert_profile')

    experience = models.FloatField(help_text="Years of experience", default=0.0)
    rating = models.FloatField(default=5.0, editable=False)
    bio = models.TextField(blank=True, help_text="Short description about expert")

    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Expert: {self.user.get_full_name()} profile"

class Chatting (models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_message")
    content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['sent_at']

    def __str__(self):
        return f"{self.sender} to {self.receiver} at {self.sent_at}"
