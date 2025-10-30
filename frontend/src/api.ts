import axios from "axios";

// ✅ Use environment variable or fallback to local Django API
const BASE_URL = import.meta.env.VITE_API || "http://127.0.0.1:8000/api";

// Create axios instance
const api = axios.create({ baseURL: BASE_URL });

// ✅ Automatically attach JWT to requests
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("access");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// ---------- AUTH ----------
export async function login(email: string, password: string) {
  try {
    return await api.post("/token/", { username: email, password });
  } catch {
    return await api.post("/token/", {
      username: email.split("@")[0],
      password,
    });
  }
}

export const refresh = () =>
  api.post("/token/refresh/", { refresh: localStorage.getItem("refresh") });

export const register = (payload: {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
}) => api.post("/register/", payload);

// ---------- PROFILE ----------
export const me = () => api.get("/me/profile/");

// ---------- SKILLS ----------
export const getSkills = () => api.get("/skills/"); // list all global skills
export const createSkill = (payload: { name: string }) =>
  api.post("/skills/", payload); // create a new skill

export const listUserSkills = () => api.get("/user-skills/"); // get logged-in user's skills
export const addUserSkill = (payload: any) => api.post("/user-skills/", payload); // link skill to user
export const deleteUserSkill = (id: string) =>
  api.delete(`/user-skills/${id}/`); // remove skill from user

// ---------- SWIPE / MATCHES / CREDITS ----------
export const suggestions = () => api.get("/suggestions/");
export const createSwipe = (body: any) => api.post("/swipes/create_swipe/", body);
export const listMatches = () => api.get("/matches/");
export const listCreditTxns = () => api.get("/credit-txns/");

export default api;
