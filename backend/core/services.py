from django.db import transaction
from django.db.models import Q
from .models import Swipe, Match, User, Skill, UserSkill, CreditTxn

# Toggle: If True, any right-swipe instantly creates a Match (demo mode)
FORCE_INSTANT_MATCH = True


@transaction.atomic
def record_swipe(swiper: User, target: User, direction: str, context: dict):
    """Record a swipe and optionally create a match."""
    s = Swipe.objects.create(swiper=swiper, target=target, direction=direction, context=context or {})

    # Only care about right swipes
    if direction != "right":
        return {"swipe_id": str(s.id), "matched": False}

    # Mutual like mode (default) vs instant match mode
    if not FORCE_INSTANT_MATCH:
        mutual = Swipe.objects.filter(swiper=target, target=swiper, direction="right").exists()
        if not mutual:
            return {"swipe_id": str(s.id), "matched": False}

    # ✅ Check for an existing match regardless of order
    existing = Match.objects.filter(
        Q(user_a=swiper, user_b=target) | Q(user_a=target, user_b=swiper)
    ).first()
    if existing:
        return {"swipe_id": str(s.id), "matched": True, "match_id": str(existing.id)}

    # Infer compatible teaching/learning skills
    skill_a = infer_teach_skill(swiper, target)
    skill_b = infer_teach_skill(target, swiper)

    # Create a new Match
    m = Match.objects.create(
        user_a=swiper,
        user_b=target,
        skill_a_teaches=skill_a,
        skill_b_teaches=skill_b,
        status="active",
    )

    return {
        "swipe_id": str(s.id),
        "matched": True,
        "match_id": str(m.id),
        "instant": FORCE_INSTANT_MATCH,
    }


def infer_teach_skill(teacher: User, other: User) -> Skill | None:
    """Find a skill the teacher can teach that the other wants to learn."""
    teach = UserSkill.objects.filter(user=teacher, role="teach").values_list("skill_id", flat=True)
    learn = set(UserSkill.objects.filter(user=other, role="learn").values_list("skill_id", flat=True))
    for sid in teach:
        if sid in learn:
            return Skill.objects.get(id=sid)
    # fallback: any teaching skill
    first = UserSkill.objects.filter(user=teacher, role="teach").values_list("skill", flat=True).first()
    if first:
        return Skill.objects.get(id=first)
    return None


@transaction.atomic
def settle_session_credit(session, teacher: User, learner: User):
    """Adjust credits when a learning session completes."""
    teacher.credits += 1
    learner.credits -= 1
    teacher.save(update_fields=["credits"])
    learner.save(update_fields=["credits"])
    CreditTxn.objects.create(user=teacher, delta=+1, reason="teach", related_id=session.id)
    CreditTxn.objects.create(user=learner, delta=-1, reason="learn", related_id=session.id)

    # ADDED CODE 

    # Writing method to match users based on desired skills and skillset someone else possesses
def find_matching_users(user: User):
    # ID of skills the users wants to learn
    learn_skill_ids = list(
        UserSkill.objects.filter(user=user, role="learn").values_list("skill_id", flat =True)
    ) 
    # Compiling users who teaches the skills
    matches = User.objects.exclude(id=user.id) \
                          .filter(userskill__role="teach", userskill__skill_id__in=learn_skill_ids) \
                         .distinct()
    # Print to console for debugging
    print(f"User {user.username} wants to learn skills IDs: {learn_skill_ids}")
    print("Matching users:")
    for match in matches:
        print(f"- {match.username}")
    
    return matches

    

