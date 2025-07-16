import { Card, Progress } from '@chakra-ui/react'
import { useUpdate } from '@renderer/components/providers/UpdateProvider'
import { Button } from '@renderer/components/ui/Button'

import { FC } from 'react'

export const About: FC = () => {
  const {
    quitAndInstall,
    isUpdateAvailable,
    latestVersion,
    currentVersion,
    isUpdateDownloaded,
    releaseNotes,
    progress
  } = useUpdate()

  const isUpdateDownloading = isUpdateAvailable && !isUpdateDownloaded
  return (
    <>
      <Card.Root>
        <Card.Body>
          <Card.Title mt="2">About</Card.Title>
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
        </Card.Body>
      </Card.Root>
      {releaseNotes && (
        <Card.Root mt={2}>
          <Card.Body>
            <Card.Title mt="2">Change log:</Card.Title>
            <Card.Description dangerouslySetInnerHTML={{ __html: releaseNotes }}></Card.Description>
          </Card.Body>
        </Card.Root>
      )}
    </>
  )
}
