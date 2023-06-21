import type { ReactElement } from 'react'
import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';
import Layout from '@/components/Layout/Layout';
import { NextPageWithLayout } from './_app';

const NotFoundPage: NextPageWithLayout = () => {
  return (
    <Flex width='100vw' height='100vh' alignItems='center' justifyContent='center'>            
      <Player
      autoplay
      loop
      src="/404.json"
      style={{ height: '100%', width: '100%' }}
    /></Flex>
  );
};

NotFoundPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      {page}
    </>
  )
}

export default NotFoundPage;
