export const labels = {
  app: 'Text Wrench',
  showApp: 'Show App',
  quit: 'Quit',
  linux: 'Linux',
  darwin: 'Mac',
  win32: 'Windows'
}

export const APP_KEY = 'textwrench'

export const MODIFIERS = [
  'ControlLeft',
  'MetaLeft',
  'AltLeft',
  'ControlRight',
  'MetaRight',
  'AltRight'
]
export const NON_MODIFIERS = ['ShiftLeft', 'ShiftRight']
export const LETTER_CODES = Array.from({ length: 26 }, (_, i) => i + 65).map(
  (i) => `Key${String.fromCharCode(i)}`
)
export const NUMBER_CODES = Array.from({ length: 10 }, (_, i) => i).map((i) => `Digit${i}`)
export const LETTER_NUMBER_CODES = [...LETTER_CODES, ...NUMBER_CODES]

export const KEY_NAMES = {
  ControlLeft: 'Ctrl',
  MetaLeft: 'Meta',
  AltLeft: 'Alt',
  ControlRight: 'Ctrl',
  MetaRight: 'Meta',
  AltRight: 'Alt',
  ShiftLeft: 'Shift',
  ShiftRight: 'Shift',
  ...LETTER_CODES.reduce((acc, code) => {
    acc[code] = code.replace('Key', '')
    return acc
  }, {}),
  ...NUMBER_CODES.reduce((acc, code) => {
    acc[code] = code.replace('Digit', '')
    return acc
  }, {})
}
