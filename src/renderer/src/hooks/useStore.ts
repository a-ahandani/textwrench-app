import { useEffect, useState } from 'react'
import { StoreType } from 'src/shared/types/store'
import { isEqual } from 'lodash'
import { useEventSubscription } from './useEventSubscription'

export type useStoreReturnType<K> = {
  value: K
  setValue: (value: StoreType[keyof StoreType]) => void
  isLoading: boolean
}

type useStoreProps = {
  key: keyof StoreType
}

export const useStore = <K>({ key }: useStoreProps): useStoreReturnType<K> => {
  const [localValue, setLocalValue] = useState<StoreType[keyof StoreType]>()

  const { getStoreValue, setStoreValue } = window.api

  useEffect(() => {
    const loadStoreData = async () => {
      const storeValue = await getStoreValue(key)
      setLocalValue(storeValue)
    }
    loadStoreData()
  }, [key])

  useEventSubscription({
    eventName: 'onStoreChange',
    callback: (data: { key: keyof StoreType; value: StoreType[keyof StoreType] }) => {
      if (data.key === key && !isEqual(data.value, localValue)) {
        setLocalValue(data.value)
      }
    },
    dependencies: [key, localValue]
  })

  const handleSetStoreValue = (value: StoreType[keyof StoreType]) => {
    setStoreValue(key, value)
  }

  return {
    value: localValue as K,
    setValue: handleSetStoreValue,
    isLoading: false
  }
}
