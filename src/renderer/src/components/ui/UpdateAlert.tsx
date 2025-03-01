import { Alert, Link } from '@chakra-ui/react'
import { GoBookmarkFill } from 'react-icons/go'
import { useUpdate } from '../providers/UpdateProvider'

export const UpdateAlert = () => {
  const { isUpdateDownloaded, quitAndInstall, latestVersion } = useUpdate()

  if (!isUpdateDownloaded) {
    return null
  }
  return (
    <Alert.Root
      position={'fixed'}
      zIndex={2}
      bottom={0}
      py={1}
      title="The latest version is ready to install"
      status="success"
      variant="solid"
      borderRadius={0}
      size={'sm'}
      display={'flex'}
      justifyContent={'center'}
    >
      <Link alignSelf="center" onClick={() => quitAndInstall()} color={'white'}>
        <Alert.Indicator>
          <GoBookmarkFill />
        </Alert.Indicator>
        The latest version is ready to install, <b>Update to {latestVersion} now!</b>
      </Link>
    </Alert.Root>
  )
}
