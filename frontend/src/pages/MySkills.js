import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useMemo, useState } from "react";
import { getSkills, createSkill, listUserSkills, addUserSkill, deleteUserSkill, } from "../api";
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
export default function MySkills() {
    const [allSkills, setAllSkills] = useState([]);
    const [userSkills, setUserSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");
    // form state
    const [skillQuery, setSkillQuery] = useState("");
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [role, setRole] = useState("learn");
    const [level, setLevel] = useState(LEVELS[0]);
    const filtered = useMemo(() => {
        const q = skillQuery.trim().toLowerCase();
        if (!q)
            return allSkills;
        return allSkills.filter((s) => s.name.toLowerCase().includes(q));
    }, [skillQuery, allSkills]);
    async function load() {
        setLoading(true);
        try {
            const [skillsRes, myRes] = await Promise.all([getSkills(), listUserSkills()]);
            setAllSkills(skillsRes.data);
            setUserSkills(myRes.data);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        load();
    }, []);
    // helper: resolve a skill id from what's typed/selected
    function resolveSkillId(typed, selected, all) {
        if (selected?.id)
            return selected.id;
        const hit = all.find((s) => s.name.trim().toLowerCase() === typed.trim().toLowerCase());
        return hit?.id || null;
    }
    async function onAdd(e) {
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
        }
        catch (err) {
            console.error(err);
            const data = err?.response?.data;
            const detail = data?.detail ||
                data?.role?.[0] ||
                data?.skill_id?.[0] ||
                data?.non_field_errors?.[0] ||
                "Failed to add skill.";
            setMsg(`❌ ${detail}`);
        }
    }
    async function onRemove(id) {
        setMsg("");
        try {
            await deleteUserSkill(id);
            setUserSkills((prev) => prev.filter((u) => u.id !== id));
        }
        catch (e) {
            console.error(e);
            setMsg("❌ Remove failed.");
        }
    }
    return (_jsxs("div", { className: "container", style: { maxWidth: 840 }, children: [_jsx("h2", { children: "My Skills" }), _jsxs("form", { className: "card row", onSubmit: onAdd, children: [_jsx("label", { className: "text-sm", children: "Skill" }), _jsx("input", { className: "input", placeholder: "Search or type a new skill (e.g., Python)", value: skillQuery, onChange: (e) => {
                            setSkillQuery(e.target.value);
                            setSelectedSkill(null);
                        }, list: "skill-datalist" }), _jsx("datalist", { id: "skill-datalist", children: filtered.map((s) => (_jsx("option", { value: s.name, onClick: () => {
                                setSelectedSkill(s);
                                setSkillQuery(s.name);
                            } }, s.id))) }), _jsxs("div", { className: "row", style: { gap: 12 }, children: [_jsxs("select", { className: "input", value: role, onChange: (e) => setRole(e.target.value), children: [_jsx("option", { value: "learn", children: "Learn" }), _jsx("option", { value: "teach", children: "Teach" })] }), _jsx("select", { className: "input", value: level, onChange: (e) => setLevel(e.target.value), children: LEVELS.map((l) => (_jsx("option", { value: l, children: l }, l))) }), _jsx("button", { className: "btn primary", type: "submit", children: "Add" })] }), msg && _jsx("p", { style: { marginTop: 8 }, children: msg })] }), _jsxs("div", { className: "card", style: { marginTop: 16 }, children: [_jsx("h3", { children: "Your current skills" }), loading ? (_jsx("p", { children: "Loading\u2026" })) : userSkills.length === 0 ? (_jsx("p", { children: "No skills yet. Add some above to get suggestions." })) : (_jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Skill" }), _jsx("th", { children: "Role" }), _jsx("th", { children: "Level" }), _jsx("th", {})] }) }), _jsx("tbody", { children: userSkills.map((u) => (_jsxs("tr", { children: [_jsx("td", { children: u.skill?.name }), _jsx("td", { style: { textTransform: "capitalize" }, children: u.role }), _jsx("td", { children: u.level }), _jsx("td", { children: _jsx("button", { className: "btn", onClick: () => onRemove(u.id), children: "Remove" }) })] }, u.id))) })] }))] })] }));
}
//# sourceMappingURL=MySkills.js.map