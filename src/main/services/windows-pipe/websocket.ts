import net from 'net'
import log from 'electron-log'
import { processTextWithAI } from '../ai/openai'
import { store } from '../../store'

export async function connectToGoPipe() {
  const selectedPrompt = await store.get('selectedPrompt')
  console.log('Selected Prompt:', selectedPrompt)
  const pipeName = '\\\\.\\pipe\\textwrench-pipe'

  let client: net.Socket | null = null

  const connect = () => {
    client = net.createConnection(pipeName, () => {
      log.info('🟨 Connected to Go pipe server')
    })

    client.on('data', async (data) => {
      const received = data.toString().trim()
      log.info('📥 Received:', received)

      const processedText = await processTextWithAI({
        selectedText: received,
        selectedPrompt: selectedPrompt
      })
      client?.write(processedText + '\n')
    })

    client.on('error', (err) => {
      log.warn('❌ Pipe error:', err)
      retry()
    })

    client.on('close', () => {
      log.warn('⚠️ Pipe closed')
      retry()
    })
  }

  const retry = () => {
    if (client) {
      client.destroy()
      client = null
    }
    setTimeout(connect, 2000) // Retry every 2s
  }

  connect()
}

export async function winnwt(): Promise<void> {
  connectToGoPipe()
}
