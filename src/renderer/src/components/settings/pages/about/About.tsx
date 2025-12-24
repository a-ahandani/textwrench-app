import { Card, Progress } from '@chakra-ui/react'
import { useUpdate } from '@renderer/components/providers/UpdateProvider'
import { Button } from '@renderer/components/ui/Button'
import Markdown from '@renderer/components/ui/Markdown'

import { FC } from 'react'

export const About: FC = () => {
  const {
    checkForUpdates,
    quitAndInstall,
    isUpdateAvailable,
    latestVersion,
    currentVersion,
    isUpdateDownloaded,
    releaseNotes,
    progress,
    isCheckingForUpdate,
    updateError
  } = useUpdate()

  const isUpdateDownloading = isUpdateAvailable && !isUpdateDownloaded
  return (
    <>
      <Card.Root>
        <Card.Body>
          <Card.Title mt="2">About</Card.Title>

          {updateError && <Card.Description color="red.400">{updateError}</Card.Description>}
          {!isUpdateAvailable ? (
            <Card.Description>You are using the latest version: {currentVersion}</Card.Description>
          ) : (
            <Card.Description>
              You are using version: {currentVersion}, There is a new version available!
              <br />
              {isUpdateDownloading && (
                <>
                  <Progress.Root my={1} value={progress} striped animated>
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>
                  Downloading version {latestVersion}...
                </>
              )}
              {isUpdateDownloaded && (
                <Button my="2" as="a" onClick={() => quitAndInstall()} colorPalette="green">
                  Update now
                </Button>
              )}
            </Card.Description>
          )}
          <Button
            mt={2}
            mb={2}
            width={170}
            size="sm"
            variant="outline"
            loading={isCheckingForUpdate}
            loadingText="Checking…"
            onClick={() => checkForUpdates()}
            disabled={isUpdateDownloading}
          >
            Check for updates
          </Button>
        </Card.Body>
      </Card.Root>
      {releaseNotes && (
        <Card.Root mt={2}>
          <Card.Body>
            <Card.Title mt="2">Change log:</Card.Title>
            <Markdown>{releaseNotes}</Markdown>
          </Card.Body>
        </Card.Root>
      )}
    </>
  )
}
