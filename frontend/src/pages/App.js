import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import { useAuth } from "../auth";
import { suggestions, createSwipe, listMatches } from "../api";
import { motion, AnimatePresence } from "framer-motion";
const DUMMY = [
    { username: "alex", full_name: "Alex Kim", bio: "Loves React & chess." },
    { username: "nina", full_name: "Nina T.", bio: "UX + piano lessons." },
    { username: "omar", full_name: "Omar H.", bio: "Cloud + cooking." },
    { username: "li", full_name: "Li Wei", bio: "ML + badminton." },
];
function assignAvatars(list) {
    return list.map((u, i) => ({
        ...u,
        avatar: `https://i.pravatar.cc/320?img=${(i % 70) + 1}`,
    }));
}
export default function App() {
    const { user } = useAuth();
    const [cards, setCards] = useState([]);
    const [idx, setIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState([]);
    const current = cards[idx % (cards.length || 1)];
    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                const res = await suggestions();
                const apiCards = (res.data || []).map((u, i) => ({
                    id: u.id,
                    username: u.username,
                    full_name: u.full_name,
                    bio: u.bio,
                    avatar: `https://i.pravatar.cc/320?img=${(i % 70) + 1}`,
                }));
                if (mounted) {
                    setCards(apiCards.length ? apiCards : assignAvatars(DUMMY));
                }
            }
            catch {
                setCards(assignAvatars(DUMMY));
            }
            finally {
                setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);
    async function refreshMatches() {
        const res = await listMatches();
        setMatches(res.data || []);
    }
    const onSwipe = async (dir) => {
        if (!cards.length)
            return;
        const card = current;
        if (card?.id && dir === "right") {
            try {
                const { data } = await createSwipe({
                    target_id: card.id,
                    direction: dir,
                    context: { source: "app" },
                });
                if (data?.match_created) {
                    await refreshMatches(); // ✅ instantly update local matches
                    window.__matchToast = `🎉 Matched with ${card.full_name || card.username}!`;
                    setTimeout(() => (window.__matchToast = ""), 3000);
                }
            }
            catch (e) {
                console.error("Swipe failed", e);
            }
        }
        setIdx((i) => i + 1);
    };
    if (!user)
        return null;
    return (_jsx("div", { style: {
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "#0b1220",
        }, children: _jsxs("div", { className: "card", style: { width: 360, textAlign: "center" }, children: [_jsxs("div", { style: { marginBottom: 12 }, children: ["Hello, ", _jsx("strong", { children: user.full_name || user.username }), " \u2014 credits:", " ", _jsx("strong", { children: user.credits })] }), loading ? (_jsx("p", { children: "Loading..." })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "deck", children: _jsx(AnimatePresence, { children: current && (_jsxs(motion.div, { className: "card card-profile", initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -40 }, transition: { type: "spring", stiffness: 260, damping: 25 }, style: {
                                        background: "#111827",
                                        border: "1px solid var(--border)",
                                        borderRadius: 20,
                                        color: "#fff",
                                        padding: 20,
                                    }, children: [_jsx("img", { src: current.avatar, alt: current.username, style: {
                                                width: "100%",
                                                height: 240,
                                                borderRadius: 16,
                                                objectFit: "cover",
                                                marginBottom: 12,
                                            } }), _jsx("h2", { children: current.full_name || current.username }), _jsxs("p", { className: "small", children: ["@", current.username] }), _jsx("p", { children: current.bio || "No bio yet." })] }, `${current.username}-${idx}`)) }) }), _jsxs("div", { className: "row", style: { gridTemplateColumns: "1fr 1fr", marginTop: 16 }, children: [_jsx("button", { className: "btn danger", onClick: () => onSwipe("left"), children: "Pass" }), _jsx("button", { className: "btn primary", onClick: () => onSwipe("right"), children: "Like" })] }), !!window.__matchToast && (_jsx("p", { style: { marginTop: 10, color: "#a7f3d0" }, children: window.__matchToast }))] })), matches.length > 0 && (_jsxs("div", { style: { marginTop: 20 }, children: [_jsx("h3", { children: "\uD83D\uDC96 Your Matches" }), _jsx("ul", { style: { listStyle: "none", padding: 0 }, children: matches.map((m) => {
                                const other = m.user_a?.username === user.username ? m.user_b : m.user_a;
                                return (_jsx("li", { style: { marginBottom: 6 }, children: other?.full_name || other?.username }, m.id));
                            }) })] }))] }) }));
}
//# sourceMappingURL=App.js.map