import { RecoilRoot } from 'recoil'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'

//INTERNAL IMPORTS
import {theme} from '../chakra/theme'
import Layout from '../components/Layout/Layout'
import { CSSReset } from '@chakra-ui/react'

export default function App({ Component, pageProps }: AppProps) {
  return(
    <RecoilRoot>
    <ChakraProvider theme={theme}>
      <Layout>
    <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
    </RecoilRoot>
  ) 
}
