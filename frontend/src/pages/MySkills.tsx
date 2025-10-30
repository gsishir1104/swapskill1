import React, { useEffect, useMemo, useState } from "react";
import {
  getSkills,
  createSkill,
  listUserSkills,
  addUserSkill,
  deleteUserSkill,
} from "../api";

type Skill = { id: string; name: string };
type UserSkill = {
  id: string;
  role: "teach" | "learn";
  level: string;
  skill: Skill;
};

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function MySkills() {
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // form state
  const [skillQuery, setSkillQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [role, setRole] = useState<"teach" | "learn">("learn");
  const [level, setLevel] = useState(LEVELS[0]);

  const filtered = useMemo(() => {
    const q = skillQuery.trim().toLowerCase();
    if (!q) return allSkills;
    return allSkills.filter((s) => s.name.toLowerCase().includes(q));
  }, [skillQuery, allSkills]);

  async function load() {
    setLoading(true);
    try {
      const [skillsRes, myRes] = await Promise.all([getSkills(), listUserSkills()]);
      setAllSkills(skillsRes.data);
      setUserSkills(myRes.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // helper: resolve a skill id from what's typed/selected
  function resolveSkillId(typed: string, selected: Skill | null, all: Skill[]) {
    if (selected?.id) return selected.id;
    const hit = all.find(
      (s) => s.name.trim().toLowerCase() === typed.trim().toLowerCase()
    );
    return hit?.id || null;
  }

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    try {
      const typed = skillQuery.trim();
      let skillId = resolveSkillId(typed, selectedSkill, allSkills);

      // create the skill only if none matched by name
      if (!skillId) {
        if (!typed) {
          setMsg("Enter a skill name.");
          return;
        }
        const created = await createSkill({ name: typed });
        skillId = created.data.id;
        setAllSkills((prev) => [...prev, created.data]);
      }

      // always send role lowercased to satisfy model choices
      await addUserSkill({
        skill_id: skillId,
        role: role.toLowerCase(),
        level: level.trim(),
      });

      setMsg("✅ Added!");
      setSkillQuery("");
      setSelectedSkill(null);
      setRole("learn");
      setLevel(LEVELS[0]);
      await load();
    } catch (err: any) {
      console.error(err);
      const data = err?.response?.data;
      const detail =
        data?.detail ||
        data?.role?.[0] ||
        data?.skill_id?.[0] ||
        data?.non_field_errors?.[0] ||
        "Failed to add skill.";
      setMsg(`❌ ${detail}`);
    }
  }

  async function onRemove(id: string) {
    setMsg("");
    try {
      await deleteUserSkill(id);
      setUserSkills((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      console.error(e);
      setMsg("❌ Remove failed.");
    }
  }

  return (
    <div className="container" style={{ maxWidth: 840 }}>
      <h2>My Skills</h2>

      <form className="card row" onSubmit={onAdd}>
        <label className="text-sm">Skill</label>
        <input
          className="input"
          placeholder="Search or type a new skill (e.g., Python)"
          value={skillQuery}
          onChange={(e) => {
            setSkillQuery(e.target.value);
            setSelectedSkill(null);
          }}
          list="skill-datalist"
        />
        <datalist id="skill-datalist">
          {filtered.map((s) => (
            <option
              key={s.id}
              value={s.name}
              onClick={() => {
                setSelectedSkill(s);
                setSkillQuery(s.name);
              }}
            />
          ))}
        </datalist>

        <div className="row" style={{ gap: 12 }}>
          <select
            className="input"
            value={role}
            onChange={(e) => setRole(e.target.value as "teach" | "learn")}
          >
            <option value="learn">Learn</option>
            <option value="teach">Teach</option>
          </select>

          <select
            className="input"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <button className="btn primary" type="submit">
            Add
          </button>
        </div>

        {msg && <p style={{ marginTop: 8 }}>{msg}</p>}
      </form>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Your current skills</h3>
        {loading ? (
          <p>Loading…</p>
        ) : userSkills.length === 0 ? (
          <p>No skills yet. Add some above to get suggestions.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Skill</th>
                <th>Role</th>
                <th>Level</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {userSkills.map((u) => (
                <tr key={u.id}>
                  <td>{u.skill?.name}</td>
                  <td style={{ textTransform: "capitalize" }}>{u.role}</td>
                  <td>{u.level}</td>
                  <td>
                    <button className="btn" onClick={() => onRemove(u.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
