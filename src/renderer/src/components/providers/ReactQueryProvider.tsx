import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
})

export const ReactQueryProvider = (props: object): JSX.Element => (
  <QueryClientProvider {...props} client={queryClient} />
)
