export const getCommandKey = (): 'command' | 'control' =>
  process.platform === 'darwin' ? 'command' : 'control'
