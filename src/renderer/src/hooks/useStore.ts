import { useEffect, useState } from 'react'
import { StoreType } from 'src/shared/types/store'
import { isEqual } from 'lodash'

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

  const { getStoreValue, setStoreValue, onStoreChange } = window.api

  useEffect(() => {
    const loadStoreData = async () => {
      const storeValue = await getStoreValue(key)
      setLocalValue(storeValue)
    }
    loadStoreData()

    const unsubscribe = onStoreChange((data) => {
      if (data.key === key && !isEqual(data.value, localValue)) {
        setLocalValue(data.value)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [key, localValue])

  const handleSetStoreValue = (value: StoreType[keyof StoreType]) => {
    setStoreValue(key, value)
  }

  return {
    value: localValue as K,
    setValue: handleSetStoreValue,
    isLoading: false
  }
}
