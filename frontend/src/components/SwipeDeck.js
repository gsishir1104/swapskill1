import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import TinderCard from 'react-tinder-card';
import ProfileCard from './ProfileCard';
import { suggestions, createSwipe } from '../api';
export default function SwipeDeck() {
    const [candidates, setCandidates] = useState([]);
    const [message, setMessage] = useState('');
    useEffect(() => {
        (async () => {
            const r = await suggestions();
            setCandidates(r.data);
        })();
    }, []);
    async function onSwipe(dir, u) {
        const r = await createSwipe({ target_id: u.id, direction: dir, context: {} });
        if (dir === 'right' && r.data.matched)
            setMessage(`🎉 It's a match with ${u.full_name || u.username}!`);
        else
            setMessage(dir === 'right' ? `👍 Liked ${u.full_name || u.username}` : `👋 Passed on ${u.full_name || u.username}`);
        setCandidates(prev => prev.filter(c => c.id !== u.id));
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: "deck", children: [candidates.length === 0 && _jsx("div", { children: "No more suggestions." }), candidates.map(u => (_jsx("div", { className: "swipeable", children: _jsxs(TinderCard, { onSwipe: (d) => onSwipe(d, u), preventSwipe: ['up', 'down'], children: [_jsx(ProfileCard, { u: u }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }, children: [_jsx("button", { className: "btn danger", onClick: () => onSwipe('left', u), children: "Pass" }), _jsx("button", { className: "btn primary", onClick: () => onSwipe('right', u), children: "Like" })] })] }) }, u.id)))] }), message && _jsx("p", { style: { marginTop: 12 }, children: message })] }));
}
//# sourceMappingURL=SwipeDeck.js.map