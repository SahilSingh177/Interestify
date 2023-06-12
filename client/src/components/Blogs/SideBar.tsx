import React from 'react';
import { useState, useEffect } from 'react';
import { Flex, Stack, StackProps, Text, Button, Divider, Link, Center } from '@chakra-ui/react';

type Props = {};

const Sidebar: React.FC<Props> = () => {

    const [stackPosition, setStackPosition] = useState<StackProps>({
        position: 'static',
        top: 'auto',
        right: 'auto',
        left: 'auto',
        spacing: "1vh",
      });

      useEffect(() => {
        const handleScroll = () => {
          const scrollHeight = window.scrollY;
          const windowHeight = window.innerHeight;
          const calculatedHeight = 0.5*windowHeight + 80;
          const heightFromTop = `calc(100px + 10vh)`;
    
          if (scrollHeight > calculatedHeight) {
            setStackPosition({
                position: 'fixed',
                top: heightFromTop,
                right: 'auto',
                left: 'auto',
            });
          } else {
            setStackPosition({
              position: 'static',
              top: 'auto',
              right: 'auto',
              left: 'auto',
            });
          }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);    
    
    return (
        <>
            <Flex  marginTop="3vh" width={`calc(0.3*90vw)`} flexDirection="column">
                <Flex width={`calc(0.3*90vw)`} height="0"></Flex>
                <Stack spacing="1vh" {...stackPosition} width={`calc(0.3*90vw)`}>
                    <Text fontWeight="medium" fontSize="20px" marginBottom="10px">Discover more of what matters to you</Text>
                    <Flex flexWrap="wrap" justifyContent="center">
                        <Button variant="link" size="md" padding="6px 12px" minWidth="auto" margin="0px 6px 12px 0px">Programming</Button>
                        <Button variant="link" size="md" padding="6px 12px" minWidth="auto" margin="0px 6px 12px 0px">Entertainment</Button>
                        <Button variant="link" size="md" padding="6px 12px" minWidth="auto" margin="0px 6px 12px 0px">Entertainment</Button>
                        <Button variant="link" size="md" padding="6px 12px" minWidth="auto" margin="0px 6px 12px 0px">Entertainment</Button>
                        <Button variant="link" size="md" padding="6px 12px" minWidth="auto" margin="0px 6px 12px 0px">Entertainment</Button>
                    </Flex>
                    <Center>
                    <Button variant="success" width="60%">See more topics</Button>
                    </Center>
                    <Divider margin="10px 0" size="4px" borderColor="black"></Divider>
                    <Flex flexWrap="wrap" justifyContent="center">
                        <Text color="gray.500" fontSize="sm" cursor="pointer" _hover={{color:"gray.600"}} margin="0px 10px 12px 0px">Help</Text>
                        <Text color="gray.500" fontSize="sm" cursor="pointer" _hover={{color:"gray.600"}} margin="0px 10px 12px 0px">Contact Us</Text>
                        <Text color="gray.500" fontSize="sm" cursor="pointer" _hover={{color:"gray.600"}} margin="0px 10px 12px 0px">Privacy Policy</Text>
                        <Text color="gray.500" fontSize="sm" cursor="pointer" _hover={{color:"gray.600"}} margin="0px 10px 12px 0px">Terms & Conditions</Text>
                    </Flex>
                </Stack>
            </Flex>
        </>
    );
};

export default Sidebar;
