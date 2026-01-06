from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta

from accounts.models import (
    User, UserRole,
    ClientProfile, ExpertProfile,
    ExpertClientAssignment, Chatting
)

from workouts.models import Exercise, WorkoutPlan, WorkoutPlanExercise
from health.models import HealthMetric, HealthDiary, Reminder


class Command(BaseCommand):
    help = "Seed initial data for Personal Healthcare Management project"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Start seeding data..."))

        self.create_users()
        self.create_profiles()
        self.create_assignments()
        self.create_chats()
        self.create_exercises()
        self.create_workout_plans()
        self.create_health_data()

        self.stdout.write(self.style.SUCCESS("Seeding completed successfully!"))

    # =====================================================
    # USERS
    # =====================================================
    def create_users(self):
        self.stdout.write("👤 Creating users...")

        users = [
            ("expert_a", "a@gmail.com", UserRole.EXPERT),
            ("expert_b", "b@gmail.com", UserRole.EXPERT),
            ("client_a", "clienta@gmail.com", UserRole.CLIENT),
            ("client_b", "clientb@gmail.com", UserRole.CLIENT),
            ("client_c", "clientc@gmail.com", UserRole.CLIENT),
        ]

        for username, email, role in users:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={"email": email, "role": role}
            )
            if created:
                user.set_password("123")
                user.save()

    # =====================================================
    # PROFILES
    # =====================================================
    def create_profiles(self):
        self.stdout.write("Creating profiles...")

        expert_a = User.objects.get(username="expert_a")
        expert_b = User.objects.get(username="expert_b")

        ExpertProfile.objects.get_or_create(
            user=expert_a,
            defaults={"experience": 5, "bio": "Fitness expert chuyên tăng cơ"}
        )

        ExpertProfile.objects.get_or_create(
            user=expert_b,
            defaults={"experience": 3, "bio": "Chuyên gia giảm cân và cardio"}
        )

        client_profiles = [
            ("client_a", 170, 65, "Tăng cơ, tập gym 4 buổi/tuần"),
            ("client_b", 160, 72, "Giảm cân, cải thiện sức bền"),
            ("client_c", 175, 80, "Tự tập, theo dõi sức khỏe"),
        ]

        for username, h, w, goal in client_profiles:
            user = User.objects.get(username=username)
            ClientProfile.objects.get_or_create(
                user=user,
                defaults={"height": h, "weight": w, "health_goal": goal}
            )

    # =====================================================
    # EXPERT - CLIENT ASSIGNMENT
    # =====================================================
    def create_assignments(self):
        self.stdout.write("Creating expert-client assignments...")

        expert_a = User.objects.get(username="expert_a")
        expert_b = User.objects.get(username="expert_b")
        client_a = User.objects.get(username="client_a")
        client_b = User.objects.get(username="client_b")

        ExpertClientAssignment.objects.get_or_create(expert=expert_a, client=client_a)
        ExpertClientAssignment.objects.get_or_create(expert=expert_a, client=client_b)
        ExpertClientAssignment.objects.get_or_create(expert=expert_b, client=client_b)

    # =====================================================
    # CHAT
    # =====================================================
    def create_chats(self):
        self.stdout.write("Creating chat history...")

        def create_chat(client, expert):
            messages = [
                (client, expert, "Chào anh, em muốn hỏi về lịch tập"),
                (expert, client, "Chào em, mục tiêu của em là gì?"),
                (client, expert, "Em muốn tăng cơ và cải thiện thể lực"),
                (expert, client, "Anh sẽ lên kế hoạch tập cho em nhé"),
                (client, expert, "Dạ em cảm ơn anh"),
            ]

            for sender, receiver, content in messages:
                Chatting.objects.get_or_create(
                    sender=sender,
                    receiver=receiver,
                    content=content
                )

        create_chat(User.objects.get(username="client_a"), User.objects.get(username="expert_a"))
        create_chat(User.objects.get(username="client_b"), User.objects.get(username="expert_b"))
        create_chat(User.objects.get(username="client_b"), User.objects.get(username="expert_a"))

    # =====================================================
    # EXERCISES + WORKOUT PLANS
    # =====================================================
    def create_exercises(self):
        self.stdout.write("Creating exercises...")

        public_exercises = [
            ("Push Up", 8, "Chest"),
            ("Squat", 9, "Legs"),
            ("Jumping Jack", 10, "Full Body"),
            ("Burpee", 12, "Full Body"),
        ]

        for name, cal, group in public_exercises:
            Exercise.objects.get_or_create(
                name=name,
                defaults={"calories_per_minute": cal, "muscle_group": group, "is_public": True}
            )

    def create_workout_plans(self):
        self.stdout.write("Creating workout plans...")

        client_a = User.objects.get(username="client_a")
        expert_a = User.objects.get(username="expert_a")

        plan, _ = WorkoutPlan.objects.get_or_create(
            user=client_a,
            expert=expert_a,
            title="Client A - Strength Plan"
        )

        push_up = Exercise.objects.get(name="Push Up")

        WorkoutPlanExercise.objects.get_or_create(
            workout_plan=plan,
            exercise=push_up,
            defaults={"duration": 10, "sets": 3, "reps": 15}
        )

    # =====================================================
    # HEALTH DATA
    # =====================================================
    def create_health_data(self):
        self.stdout.write("Creating health data...")

        client_a = User.objects.get(username="client_a")
        plan = WorkoutPlan.objects.get(title="Client A - Strength Plan")
        now = timezone.now()

        HealthMetric.objects.get_or_create(
            user=client_a,
            workout_plan=plan,
            defaults={
                "water_intake": 2.5,
                "steps": 8500,
                "heart_rate": 72,
                "calories": 450
            }
        )

        HealthDiary.objects.get_or_create(
            user=client_a,
            workout_plan=plan,
            defaults={"content": "<p>Hôm nay tập rất ổn</p>"}
        )

        Reminder.objects.get_or_create(
            user=client_a,
            workout_plan=plan,
            defaults={
                "message": "Uống nước sau khi tập",
                "remind_at": now + timedelta(hours=2)
            }
        )
