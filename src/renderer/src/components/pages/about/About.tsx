import { Card } from '@chakra-ui/react'
import { Button } from '@renderer/components/ui/Button'
import { useStore } from '@renderer/hooks/useStore'
import { useVersion } from '@renderer/hooks/useVersion'

export const About = () => {
  const { value: version } = useStore<string>({
    key: 'appVersion'
  })

  const { data, download } = useVersion()

  const latestVersion = data?.tag_name?.replace(/[a-zA-Z]/g, '')
  const isUpdated = version == latestVersion

  return (
    <>
      <Card.Root>
        <Card.Body>
          <Card.Title mt="2">About</Card.Title>
          {isUpdated ? (
            <Card.Description>You are using the latest version: {latestVersion}</Card.Description>
          ) : (
            <Card.Description>
              There is a new version available!
              <br />
              Please update to the latest version: {latestVersion}
              <br />
              <Button my="2" as="a" onClick={() => download()} colorPalette="green">
                Update now
              </Button>
            </Card.Description>
          )}
        </Card.Body>
      </Card.Root>
      {!isUpdated && (
        <Card.Root mt={2}>
          <Card.Body>
            <Card.Title mt="2">Change log:</Card.Title>
            <Card.Description>{data?.body}</Card.Description>
          </Card.Body>
        </Card.Root>
      )}
    </>
  )
}
