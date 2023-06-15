import React, { useEffect, useState } from 'react';
import { Flex, Stack, Text, Button, Divider, Center } from '@chakra-ui/react';
import { authState } from '@/atoms/userAtom';
import { useRecoilValue } from 'recoil';

type Props = {};

const Sidebar: React.FC<Props> = () => {
  const isLoggedIn = useRecoilValue(authState).isLoggedIn;

  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = window.scrollY;
      const windowHeight = window.innerHeight;
      const calculatedHeight = isLoggedIn ? 0 : 0.5 * windowHeight + 80;

      setIsFixed(scrollHeight > calculatedHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Flex marginTop="3vh" width="30vw" flexDirection="column">
      <Flex width="30vw" height={0} />
      <Stack
        spacing="1vh"
        position={{lg: isFixed ? 'fixed' : 'static',md:"static"}}
        top={isFixed ? 'calc(100px + 10vh)' : 'auto'}
        right="auto"
        left="auto"
        width={{lg:"30vw",md:`calc(100vw - 12px)`}}

      >
        <Text fontWeight="medium" fontSize="20px" marginBottom="10px" textAlign={{lg:"left",md:"center"}}>
          Discover more of what matters to you
        </Text>
        <Flex flexWrap="wrap" justifyContent="center">
          <Button variant="link" size="md" padding="6px 12px" minWidth="auto" margin="0px 6px 12px 0px">Programming</Button>
          <Button variant="link" size="md" padding="6px 12px" minWidth="auto" margin="0px 6px 12px 0px">Programming</Button>
          <Button variant="link" size="md" padding="6px 12px" minWidth="auto" margin="0px 6px 12px 0px">Programming</Button>
          <Button variant="link" size="md" padding="6px 12px" minWidth="auto" margin="0px 6px 12px 0px">Programming</Button>
          <Button variant="link" size="md" padding="6px 12px" minWidth="auto" margin="0px 6px 12px 0px">Programming</Button>
        </Flex>
        <Center>
          <Button variant="success" width="60%">
            See more topics
          </Button>
        </Center>
        <Divider margin="10px 0" size="4px" borderColor="black" />
        <Flex flexWrap="wrap" justifyContent="center">
          <Text color="gray.500" fontSize="sm" cursor="pointer" _hover={{ color: "gray.600" }} margin="0px 10px 12px 0px">Terms & Conditions</Text>
          <Text color="gray.500" fontSize="sm" cursor="pointer" _hover={{ color: "gray.600" }} margin="0px 10px 12px 0px">Terms & Conditions</Text>
          <Text color="gray.500" fontSize="sm" cursor="pointer" _hover={{ color: "gray.600" }} margin="0px 10px 12px 0px">Terms & Conditions</Text>
          <Text color="gray.500" fontSize="sm" cursor="pointer" _hover={{ color: "gray.600" }} margin="0px 10px 12px 0px">Terms & Conditions</Text>
          <Text color="gray.500" fontSize="sm" cursor="pointer" _hover={{ color: "gray.600" }} margin="0px 10px 12px 0px">Terms & Conditions</Text>
        </Flex>
      </Stack>
    </Flex>
  );
};

export default Sidebar;


