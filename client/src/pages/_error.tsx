import React from 'react';
import type { ReactElement } from 'react';
import { Flex } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';
import { NextPageWithLayout } from './_app';
import Head from 'next/head';

const InternalServerError = () => {
  return (
    <Flex width='100vw' height='100vh' alignItems='center' justifyContent='center'>            
      <Player
      autoplay
      loop
      src="/500.json"
      style={{ height: '60%', width: '60%' }}
    /></Flex>
  );
};

InternalServerError.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>500 - Internal Server Error</title>
      </Head>
      {page}
    </>
  )
}

export default InternalServerError;
