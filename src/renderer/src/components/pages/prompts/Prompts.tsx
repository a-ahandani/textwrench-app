import { PromptList } from './components/PromptList'
import { PromptsProvider } from './components/PromptsContext'

export const Prompts = () => {
  return (
    <PromptsProvider>
      {/* <PromptHead /> */}
      <PromptList />
    </PromptsProvider>
  )
}
