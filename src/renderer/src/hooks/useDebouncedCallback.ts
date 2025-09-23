import { useEffect, useMemo, useRef } from 'react'

/**
 * useDebouncedCallback
 * Returns a stable debounced function that delays invoking `fn` until after `delay` ms
 * have elapsed since the last time the debounced function was called.
 *
 * - Ensures latest `fn` is used (via ref)
 * - Clears timers on unmount
 */
export function useDebouncedCallback<T extends unknown[]>(
  fn: (...args: T) => void,
  delay = 300
): (...args: T) => void {
  const fnRef = useRef(fn)
  const timerRef = useRef<number | null>(null)

  // Always keep latest fn
  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  const debounced = useMemo(() => {
    const wrapped = (...args: T): void => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
      timerRef.current = window.setTimeout(() => {
        fnRef.current(...args)
      }, delay)
    }

    return wrapped
  }, [delay])

  return debounced
}
