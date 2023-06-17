import React, { useEffect, useState } from 'react';
import { Flex, Stack, Text, Button, Divider, Center, Badge } from '@chakra-ui/react';
import { authState } from '@/atoms/userAtom';
import { useRecoilValue } from 'recoil';
import { categories } from '@/Handlers/categories'; 
// display top categories later

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
    <Flex marginTop="3vh" width={{ lg: "30vw", md: `calc(100vw - 12px)`, "sm": `calc(100vw - 12px)` }} flexDirection="column" alignItems="center" justifyContent={{ lg: "flex-start", md: "center", "sm": "center" }}>
      <Flex width="30vw" height={0} />
      <Stack
        spacing="1vh"
        position={{ lg: isFixed ? 'fixed' : 'static', md: "static" }}
        top={isFixed ? 'calc(100px + 10vh)' : 'auto'}
        right="auto"
        left="auto"
        width={{ lg: "30vw", md: `calc(90vw - 12px)`, "sm": `calc(90vw - 12px)` }}
      >
        <Text fontWeight="medium" fontSize="2xl" marginBottom={5} textAlign="center">
          Discover more of what matters to you
        </Text>
        <Flex flexWrap="wrap" justifyContent="center">
          {categories.map((category, id) => {
            return (<Badge key={id} marginLeft={5} marginBottom={5} padding={2} borderRadius={20} fontWeight="light" bg="gray.100" cursor="pointer">{category}</Badge>);
          })}
        </Flex>
        <Center>
          <Button variant="success" width="60%">
            See more topics
          </Button>
        </Center>
        <Divider margin="10px 0" size="4px" borderColor="black" />
        <Flex flexWrap="wrap" justifyContent="center">
          <Text color="gray.700" fontSize="sm" cursor="pointer" _hover={{ color: "gray.600" }} margin="0px 16px 12px 0px">Help</Text>
          <Text color="gray.700" fontSize="sm" cursor="pointer" _hover={{ color: "gray.600" }} margin="0px 16px 12px 0px">Privacy</Text>
          <Text color="gray.700" fontSize="sm" cursor="pointer" _hover={{ color: "gray.600" }} margin="0px 16px 12px 0px">About</Text>
          <Text color="gray.700" fontSize="sm" cursor="pointer" _hover={{ color: "gray.600" }} margin="0px 16px 12px 0px">Terms & Conditions</Text>
        </Flex>
      </Stack>
    </Flex>
  );
};

export default Sidebar;


