import React, { useState } from 'react'
import { UsageLimitContext } from './UsageLimitContext'
import { useEventSubscription } from '@renderer/hooks/useEventSubscription'
import { IPC_EVENTS } from '@shared/ipc-events'
import { PANEL_KEYS, PANEL_REGISTRY } from '../toolbar/constants'

export interface UsageLimitInfo {
  allowed: boolean
  remaining: number
  limit: number
  actionCount: number
  plan: string
}

export const UsageLimitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [info, setInfo] = useState<UsageLimitInfo | null>(null)
  useEventSubscription<UsageLimitInfo>({
    eventName: 'onUsageLimitReached',
    callback: (data) => {
      if (data && data.allowed === false) setInfo(data)
      if (data && data.allowed === false) {
        const ipc = window.electron?.ipcRenderer
        const panelKey = PANEL_KEYS.QUOTA
        const cfg = PANEL_REGISTRY[panelKey]
        ipc?.send(IPC_EVENTS.TOOLBAR_EXPAND, {
          action: 'open',
          panel: panelKey,
          width: cfg?.width,
          height: cfg?.height
        })
        ipc?.send(IPC_EVENTS.TOOLBAR_OPEN_PANEL, { panel: panelKey })
      }
    }
  })

  return (
    <UsageLimitContext.Provider value={{ info, dismiss: () => setInfo(null) }}>
      {children}
    </UsageLimitContext.Provider>
  )
}
