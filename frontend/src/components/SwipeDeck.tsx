
import React, { useEffect, useState } from 'react'
import TinderCard from 'react-tinder-card'
import ProfileCard from './ProfileCard'
import { suggestions, createSwipe } from '../api'
import type { User } from '../types'
export default function SwipeDeck(){
  const [candidates, setCandidates] = useState<User[]>([])
  const [message, setMessage] = useState<string>('')
  useEffect(()=>{ (async()=>{
    const r = await suggestions(); setCandidates(r.data)
  })() }, [])
  async function onSwipe(dir: 'left'|'right', u:User){
    const r = await createSwipe({ target_id: u.id, direction: dir, context: {} })
    if (dir==='right' && r.data.matched) setMessage(`🎉 It's a match with ${u.full_name || u.username}!`)
    else setMessage(dir==='right' ? `👍 Liked ${u.full_name || u.username}` : `👋 Passed on ${u.full_name || u.username}`)
    setCandidates(prev => prev.filter(c => c.id !== u.id))
  }
  return (
    <div>
      <div className="deck">
        {candidates.length===0 && <div>No more suggestions.</div>}
        {candidates.map(u => (
          <div className="swipeable" key={u.id}>
            <TinderCard onSwipe={(d)=>onSwipe(d as any,u)} preventSwipe={['up','down']}>
              <ProfileCard u={u} />
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>
                <button className="btn danger" onClick={()=>onSwipe('left', u)}>Pass</button>
                <button className="btn primary" onClick={()=>onSwipe('right', u)}>Like</button>
              </div>
            </TinderCard>
          </div>
        ))}
      </div>
      {message && <p style={{marginTop:12}}>{message}</p>}
    </div>
  )
}
