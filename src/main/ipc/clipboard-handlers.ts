import { getSelectedText } from '../services/clipboard/clipboard'
import { updateSelectedText } from '../services/text/text-operations'
import { updateStore } from '../store/helpers'

export const handleSelectedText = async (): Promise<void> => {
  const selectedText = await getSelectedText()
  updateStore('selectedText', selectedText)

  await updateSelectedText(selectedText)
}
