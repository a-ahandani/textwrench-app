import { Key } from '@nut-tree-fork/nut-js'

export const getCommandKey = (): Key.LeftCmd | Key.LeftControl =>
  process.platform === 'darwin' ? Key.LeftCmd : Key.LeftControl
