
# SwapSkill Backend (Django + DRF + SQLite + JWT)

## Setup
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
# seed some skills
python manage.py shell <<'PY'
from core.models import Skill, User, UserSkill
from django.contrib.auth.hashers import make_password
# skills
names = ["Python","Data Science","Guitar","Spanish","Cooking"]
for n in names: Skill.objects.get_or_create(name=n)
# users
admin = User.objects.create(username="admin", email="admin@example.com", role="admin", credits=10, reputation=10, password=make_password("admin123"))
user = User.objects.create(username="kalyani", email="user@example.com", role="user", credits=3, reputation=5, password=make_password("user123"))
# link skills
from core.models import Skill
py = Skill.objects.get(name="Python"); gu = Skill.objects.get(name="Guitar"); sp = Skill.objects.get(name="Spanish"); ds = Skill.objects.get(name="Data Science")
UserSkill.objects.create(user=user, skill=py, role='teach', level='Advanced')
UserSkill.objects.create(user=user, skill=gu, role='learn', level='Beginner')
print("Seeded.")
PY
python manage.py runserver 8000
```

## Key Endpoints
- `POST /api/token/`  → {access, refresh}
- `GET /api/me/profile/` → current user
- `GET/POST /api/skills/`
- `GET/POST /api/user-skills/`
- `GET /api/suggestions/` → people who teach what you want to learn
- `POST /api/swipes/create_swipe/` → {target_id, direction:'right'|'left', context?} → mutual match creates `Match`
- `GET /api/matches/`
- `POST /api/sessions/` → creates session and **settles credits (+1/-1)** in MVP
- `GET /api/credit-txns/` → your credit history

CORS is enabled for local dev.
