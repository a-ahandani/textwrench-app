import { useEffect, useState } from 'react'
import { StoreType } from 'src/shared/types/store'

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
  const [isLoading, setIsLoading] = useState(false)

  const { getStoreValue, setStoreValue } = window.api

  useEffect(() => {
    setIsLoading(true)
    const loadStoreData = async () => {
      const storeValue = await getStoreValue(key)
      setLocalValue(storeValue)
      setIsLoading(false)
    }
    loadStoreData()
  }, [])

  const handleSetStoreValue = (value) => {
    setStoreValue(key, value)
  }

  return {
    value: localValue as K,
    setValue: handleSetStoreValue,
    isLoading
  }
}
