import { useState, useEffect, useRef } from 'react'

export function useTween(target: number, dur = 650): number {
  const [val, setVal] = useState(target)
  const fromRef = useRef(target)
  const startRef = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const from = fromRef.current
    if (from === target) { setVal(target); return }
    cancelAnimationFrame(rafRef.current)
    startRef.current = 0
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const t = Math.min(1, (ts - startRef.current) / dur)
      setVal(from + (target - from) * ease(t))
      if (t < 1) rafRef.current = requestAnimationFrame(step)
      else { fromRef.current = target; setVal(target) }
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, dur])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fromRef.current = val }, [])

  return val
}
