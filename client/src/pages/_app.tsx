import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'

//INTERNAL IMPORTS
import {theme} from '../chakra/theme'
import Layout from '../components/Layout/Layout'
import '../firebase/clientApp'
import { AuthProvider } from '../Providers/AuthProvider';

export default function App({ Component, pageProps }: AppProps) {

  return(
    <AuthProvider>
    <ChakraProvider theme={theme}>
      <Layout>
    <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
    </AuthProvider>
  ) 
}
