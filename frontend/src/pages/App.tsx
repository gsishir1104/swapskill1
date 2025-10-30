import React, { useEffect, useState } from "react";
import { useAuth } from "../auth";
import { suggestions, createSwipe, listMatches } from "../api";
import { motion, AnimatePresence } from "framer-motion";

type Card = {
  id?: string;
  username: string;
  full_name?: string;
  bio?: string;
  avatar?: string;
};

type Match = {
  id: string;
  user_a: any;
  user_b: any;
};

const DUMMY: Card[] = [
  { username: "alex", full_name: "Alex Kim", bio: "Loves React & chess." },
  { username: "nina", full_name: "Nina T.", bio: "UX + piano lessons." },
  { username: "omar", full_name: "Omar H.", bio: "Cloud + cooking." },
  { username: "li", full_name: "Li Wei", bio: "ML + badminton." },
];

function assignAvatars(list: Card[]) {
  return list.map((u, i) => ({
    ...u,
    avatar: `https://i.pravatar.cc/320?img=${(i % 70) + 1}`,
  }));
}

export default function App() {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const current = cards[idx % (cards.length || 1)];

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await suggestions();
        const apiCards: Card[] = (res.data || []).map((u: any, i: number) => ({
          id: u.id,
          username: u.username,
          full_name: u.full_name,
          bio: u.bio,
          avatar: `https://i.pravatar.cc/320?img=${(i % 70) + 1}`,
        }));
        if (mounted) {
          setCards(apiCards.length ? apiCards : assignAvatars(DUMMY));
        }
      } catch {
        setCards(assignAvatars(DUMMY));
      } finally {
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

  const onSwipe = async (dir: "left" | "right") => {
    if (!cards.length) return;
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
          (window as any).__matchToast = `🎉 Matched with ${card.full_name || card.username}!`;
          setTimeout(() => ((window as any).__matchToast = ""), 3000);
        }
      } catch (e) {
        console.error("Swipe failed", e);
      }
    }
    setIdx((i) => i + 1);
  };

  if (!user) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b1220",
      }}
    >
      <div className="card" style={{ width: 360, textAlign: "center" }}>
        <div style={{ marginBottom: 12 }}>
          Hello, <strong>{user.full_name || user.username}</strong> — credits:{" "}
          <strong>{user.credits}</strong>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="deck">
              <AnimatePresence>
                {current && (
                  <motion.div
                    key={`${current.username}-${idx}`}
                    className="card card-profile"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ type: "spring", stiffness: 260, damping: 25 }}
                    style={{
                      background: "#111827",
                      border: "1px solid var(--border)",
                      borderRadius: 20,
                      color: "#fff",
                      padding: 20,
                    }}
                  >
                    <img
                      src={current.avatar}
                      alt={current.username}
                      style={{
                        width: "100%",
                        height: 240,
                        borderRadius: 16,
                        objectFit: "cover",
                        marginBottom: 12,
                      }}
                    />
                    <h2>{current.full_name || current.username}</h2>
                    <p className="small">@{current.username}</p>
                    <p>{current.bio || "No bio yet."}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="row" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 16 }}>
              <button className="btn danger" onClick={() => onSwipe("left")}>
                Pass
              </button>
              <button className="btn primary" onClick={() => onSwipe("right")}>
                Like
              </button>
            </div>

            {!!(window as any).__matchToast && (
              <p style={{ marginTop: 10, color: "#a7f3d0" }}>{(window as any).__matchToast}</p>
            )}
          </>
        )}

        {matches.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h3>💖 Your Matches</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {matches.map((m) => {
                const other =
                  m.user_a?.username === user.username ? m.user_b : m.user_a;
                return (
                  <li key={m.id} style={{ marginBottom: 6 }}>
                    {other?.full_name || other?.username}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
