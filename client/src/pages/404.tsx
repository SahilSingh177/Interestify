import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';

const NotFoundPage = () => {
  return (
    <Flex width='100vw' height='90vh' alignItems='center' justifyContent='center'>            
      <Player
      autoplay
      loop
      src="/404.json"
      style={{ height: '100%', width: '100%' }}
    /></Flex>
  );
};

export default NotFoundPage;
