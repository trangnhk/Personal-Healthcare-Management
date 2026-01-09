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
            ("expert_a", "a@gmail.com", UserRole.EXPERT, "https://res.cloudinary.com/dxfbpkmen/image/upload/v1767724201/qtjhorrvgixmawngfish.png"),
            ("expert_b", "b@gmail.com", UserRole.EXPERT, "https://res.cloudinary.com/dxfbpkmen/image/upload/v1767724175/fypjdjcqoc8bdipz06xs.png"),
            ("client_a", "clienta@gmail.com", UserRole.CLIENT, "https://res.cloudinary.com/dxfbpkmen/image/upload/v1767724233/zpsoy23zoigyw7hkajae.png"),
            ("client_b", "clientb@gmail.com", UserRole.CLIENT, "https://res.cloudinary.com/dxfbpkmen/image/upload/v1767724261/v7uuu4ok1rrj32v5vjax.png"),
            ("client_c", "clientc@gmail.com", UserRole.CLIENT, "https://res.cloudinary.com/dxfbpkmen/image/upload/v1767724201/qtjhorrvgixmawngfish.png"),
        ]

        for username, email, role, avatar in users:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={"email": email, "role": role, "avatar": avatar}
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
            # format: (name, calories, muscle_group, description[, image])
            ("Push Up", 8, "Chest",
             "Classic push-up to strengthen chest, shoulders, and triceps.",
             "https://res.cloudinary.com/dxfbpkmen/image/upload/v1767962997/1-tap-dui-shutterstock-7679_x1bllb.jpg"),
            ("Wide Push Up", 10, "Chest",
             "Push-up variation with wide hand placement for chest focus.",
             "https://res.cloudinary.com/dxfbpkmen/image/upload/v1767963440/download_igggz3.jpg"),
            ("Incline Push Up", 12, "Chest",
             "Push-ups with hands on elevated surface to reduce difficulty and target upper chest.",
             "https://res.cloudinary.com/dxfbpkmen/image/upload/v1767963440/download_igggz3.jpg"),

            ("Squat", 10, "Legs",
             "Basic squat to strengthen thighs, glutes, and core.",
             "https://res.cloudinary.com/dxfbpkmen/image/upload/v1767963495/download_ttvogx.png"),
            ("Jump Squat", 12, "Legs",
             "Explosive squat jump to build leg power and cardio endurance.",
             "https://res.cloudinary.com/dxfbpkmen/image/upload/v1767963538/download_1_pwacpz.jpg"),
            ("Lunges", 10, "Legs",
             "Step forward into a lunge to work quads, glutes, and balance."),

            ("Plank", 30, "Core",
             "Hold a stable plank to strengthen the entire core.",
             "https://res.cloudinary.com/dxfbpkmen/image/upload/v1767963694/low-plank-hold-b8a63da1ef844f00b6f6a21141ba1d87_fch8qu.jpg"),
            ("Crunch", 15, "Core",
             "Classic ab crunch to target upper abdominal muscles."),
            ("Leg Raise", 12, "Core",
             "Lift legs while lying down to engage lower abs.",
             "https://res.cloudinary.com/dxfbpkmen/image/upload/v1767963723/maxresdefault_p6cenm.jpg"),

            ("Jumping Jack", 20, "Full Body",
             "Full-body cardio exercise to increase heart rate and warm up muscles."),
            ("Burpee", 12, "Full Body",
             "Combines squat, push-up, and jump for full-body strength and cardio."),

            ("Mountain Climber", 20, "Cardio",
             "Dynamic plank movement to improve core strength and cardiovascular fitness.",
             "https://res.cloudinary.com/dxfbpkmen/image/upload/v1767963775/Mountain-Climber-with-Bosu-Ball_jyari9.jpg"),
            ("High Knees", 25, "Cardio",
             "Run in place lifting knees high to boost cardio and leg strength."),
            ("Butt Kicks", 25, "Cardio",
             "Run in place kicking heels to glutes, improving cardio and hamstring flexibility."),
        ]

        for item in public_exercises:
            # Nếu tuple có 5 phần: name, cal, group, description, image
            # Nếu tuple có 4 phần: image = None
            if len(item) == 5:
                name, cal, group, description, image = item
            else:
                name, cal, group, description = item
                image = None

            defaults = {
                "calories_per_minute": cal,
                "muscle_group": group,
                "is_public": True,
                "description": description
            }

            if image is not None:
                defaults["image"] = image

            Exercise.objects.get_or_create(name=name, defaults=defaults)

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
