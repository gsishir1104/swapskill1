
export type Role = 'user' | 'admin'
export type User = {
  id: string
  username: string
  email: string
  role: Role
  full_name?: string
  bio?: string
  timezone?: string
  reputation: number
  credits: number
}
export type Skill = { id: string; name: string; category?: string; level_hint?: string }
export type UserSkill = { id: string; user: string; skill: Skill; skill_id?: string; role: 'teach'|'learn'; level?: string }
export type Match = { id: string; user_a: string; user_b: string; skill_a_teaches?: string; skill_b_teaches?: string; status: string; created_at: string }
export type SwipeReq = { target_id: string; direction: 'left'|'right'; context?: Record<string, unknown> }
export type CreditTxn = { id: string; user: string; delta: number; reason: string; created_at: string }
