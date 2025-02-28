import { useEffect } from 'react'

type EventCallback<T> = (data: T) => void

type UseEventSubscriptionProps<T> = {
  eventName: string
  callback: EventCallback<T>
  dependencies?: any[]
}

export const useEventSubscription = <T>({
  eventName,
  callback,
  dependencies = []
}: UseEventSubscriptionProps<T>) => {
  useEffect(() => {
    const unsubscribe = window.api[eventName](callback)
    return () => {
      unsubscribe()
    }
  }, dependencies)
}
