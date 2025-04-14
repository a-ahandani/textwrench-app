export type Prompt = {
  value: string
  label: string | undefined
  ID: string
}

export type Template = {
  value: string
  label: string | undefined
  description: string
  category_id: string
  rate: number
  ID: string
}

export type Category = {
  label: string | undefined
  description: string
  ID: string
}

export type UserProfile = {
  user_type: string
  name: string
  email: string
  ID: string
  shortcuts: Shortcuts
}

export type StoreType = {
  appVersion?: string
  selectedText?: string | null
  selectedPrompt?: Prompt
  token?: string | null
  delay?: number
  lastDelayTest?: number
}

enum OsType {
  MAC = 'mac',
  WINDOWS = 'windows',
  LINUX = 'linux'
}

export type ShortcutList = {
  [key: string]: string
}

export type Shortcuts = {
  [OsType.MAC]: ShortcutList
  [OsType.WINDOWS]: ShortcutList
  [OsType.LINUX]: ShortcutList
}
