import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';

const InternalServerError = () => {
  return (
    <Flex width='100vw' height='90vh' alignItems='center' justifyContent='center'>            
      <Player
      autoplay
      loop
      src="/500.json"
      style={{ height: '100%', width: '100%' }}
    /></Flex>
  );
};

export default InternalServerError;
