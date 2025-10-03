import { Box } from '@chakra-ui/react'
import { Auth } from './components/Auth'
import { UsageStatsPanel } from './components/UsageStats'
// import { Shortcuts } from './components/Shortcuts'

export const Settings: React.FC = () => {
  return (
    <Box>
      <Auth />
      <UsageStatsPanel />
      {/* <Shortcuts /> */}
    </Box>
  )
}
