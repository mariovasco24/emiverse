import { useEffect, useState } from 'react'
import type { WorldRepository } from './WorldRepository'
export function useWorld(repository: WorldRepository) {
  const [save, setSave] = useState(() => repository.load())
  const [storageBlocked, setStorageBlocked] = useState(false)
  useEffect(() => {
    try {
      repository.save(save)
      setStorageBlocked(false)
    } catch {
      setStorageBlocked(true)
    }
  }, [repository, save])
  return { save, setSave, storageBlocked }
}
