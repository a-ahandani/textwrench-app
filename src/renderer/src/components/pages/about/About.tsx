import { Card } from '@chakra-ui/react'
import { useUpdate } from '@renderer/components/providers/UpdateProvider'
import { Button } from '@renderer/components/ui/Button'

export const About = () => {

  const {
    quitAndInstall,
    isUpdateAvailable,
    latestVersion,
    currentVersion,
    isUpdateDownloaded,
    releaseNotes
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
              There is a new version available!
              <br />
              {isUpdateDownloading && (
                <Card.Description>
                  Downloading version {latestVersion}...
                  <br />
                  You can manually update to version {latestVersion} or wait for the automatic update.
                </Card.Description>
              )}
              {
                isUpdateDownloaded && (
                  <Button my="2" as="a" onClick={() => quitAndInstall()} colorPalette="green">
                    Update now
                  </Button>)
              }
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
