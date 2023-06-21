import Router, { useRouter } from "next/router";
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { theme } from '../chakra/theme'
import Layout from '../components/Layout/Layout'
import '../firebase/clientApp'
import { AuthProvider } from '../Providers/AuthProvider';

export default function App({ Component, pageProps }: AppProps) {
  // const router = useRouter();

  // // Conditionally render different layouts based on the current page
  // if (router.pathname === '/welcome/categories' || router.pathname==='/welcome/register_mail' ||
  // router.pathname==='/404') {
  //   return (
  //     <AuthProvider>
  //     <ChakraProvider theme={theme}>
  //         <Component {...pageProps} />
  //     </ChakraProvider>
  //   </AuthProvider>
  //   );
  // }
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </AuthProvider>
  )
}
