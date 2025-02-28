import { Alert, Link } from "@chakra-ui/react"
import { GoBookmarkFill } from "react-icons/go"
import { useUpdate } from "../providers/UpdateProvider"

export const UpdateAlert = () => {
  const { isUpdateDownloaded, quitAndInstall, latestVersion } = useUpdate()


  if (!isUpdateDownloaded) {
    return null
  }
  return <Alert.Root py={2} title="Update available" status="success" variant="solid" borderRadius={0}>
    <Alert.Indicator>
      <GoBookmarkFill />
    </Alert.Indicator>
    <Alert.Content color="fg">
      <Alert.Title>The latest version is ready to install</Alert.Title>
    </Alert.Content>
    <Link alignSelf="center" onClick={() => quitAndInstall()} fontWeight="bold">
      Update to {latestVersion} now!
    </Link>
  </Alert.Root>
}
