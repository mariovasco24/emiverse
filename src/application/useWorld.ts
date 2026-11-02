import { useCallback, useEffect, useRef, useState, type SetStateAction } from 'react'
import type { WorldSave } from '../domain/world'
import type { WorldRepository } from './WorldRepository'
export function useWorld(repository: WorldRepository) {
  const [save, updateSave] = useState(() => repository.load())
  const current = useRef(save)
  const [storageBlocked, setStorageBlocked] = useState(false)
  const persist = useCallback(
    (next: WorldSave) => {
      try {
        repository.save(next)
        setStorageBlocked(false)
      } catch {
        setStorageBlocked(true)
      }
    },
    [repository],
  )
  // Commit explicit game actions before returning, including pagehide/visibility events.
  // Functional updates read the latest commit even when React batches several actions.
  const setSave = useCallback(
    (update: SetStateAction<WorldSave>) => {
      const next = typeof update === 'function' ? update(current.current) : update
      current.current = next
      persist(next)
      updateSave(next)
    },
    [persist],
  )
  useEffect(() => persist(current.current), [persist])
  return { save, setSave, storageBlocked }
}
