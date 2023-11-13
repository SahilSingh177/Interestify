import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Flex,
  Stack,
  Text,
  Button,
  Divider,
  Center,
  Badge,
  useColorModeValue
} from "@chakra-ui/react";
import { AuthContext } from "@/Providers/AuthProvider";
import { categoriesData } from "@/Handlers/CategoriesData";
import ShowAlert from "../Alert/ShowAlert";

type Props = {};

const Sidebar: React.FC<Props> = () => {
  const currentUser = useContext(AuthContext);
  const Router = useRouter();
  const [isFixed, setIsFixed] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = window.scrollY;
      const windowHeight = window.innerHeight;
      const calculatedHeight = !currentUser
        ? 0.63 * windowHeight
        : 0.03 * windowHeight;

      setIsFixed(scrollHeight > calculatedHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Flex
      marginTop="3vh"
      width={{ lg: "27.8375vw", base: `calc(100vw - 12px)` }}
      flexDirection="column"
      alignItems="center"
      justifyContent={{ lg: "flex-start", base: "center" }}
    >
      <Flex width="27.8375vw" height={0} />
      <ShowAlert
        type="warning"
        message="Please login first"
        title=""
        isVisible={isAlertVisible}
        onClose={() => setIsAlertVisible(false)}
      />
      <Stack
        spacing="1vh"
        position={{ lg: isFixed ? "fixed" : "static", base: "static" }}
        top={isFixed ? "20vh" : "auto"}
        right="auto"
        left="auto"
        width={{ lg: "27.8375vw", base: `calc(90vw - 12px)` }}
      >
        <Text
          color="gray.700"
          fontWeight="bold"
          fontSize="30px"
          marginBottom={5}
          textAlign="center"
        >
          Recommended 
        </Text>
        <Flex flexWrap="wrap" justifyContent="center">
          {categoriesData.slice(0, 9).map((category, id) => (
            <Badge
            bg={useColorModeValue('gray.200','#192734')}
              key={id}
              onClick={() => {
                if (currentUser?.email)
                  Router.push(`/category/${category}/best`);
                else setIsAlertVisible(true);
              }}
              marginLeft={5}
              marginBottom={5}
              padding={2}
              borderRadius={20}
              fontWeight={["normal","normal","medium","medium"]}
              cursor="pointer"
            >
              {category}
            </Badge>
          ))}
        </Flex>
        <Center>
          <Button variant='more' size='md' onClick={() => Router.push("/search_category")}>
              See More Topics
          </Button>
        </Center>
        <Divider margin="10px 0" size="4px" borderColor="gray.500" w='25.8375vw' ml='auto'/>
        <Flex flexWrap="wrap" justifyContent="center" color={useColorModeValue('gray.700','gray.200')}>
          <Text
            fontSize="smaller"
            cursor="pointer"
            _hover={{ color: "gray.500" }}
            margin="0px 16px 12px 0px"
          >
            Help
          </Text>
          <Text
            fontSize="smaller"
            cursor="pointer"
            _hover={{ color: "gray.500" }}
            margin="0px 16px 12px 0px"
          >
            Privacy
          </Text>
          <Text
            fontSize="smaller"
            cursor="pointer"
            _hover={{ color: "gray.500" }}
            margin="0px 16px 12px 0px"
          >
            About
          </Text>
          <Text
            fontSize="smaller"
            cursor="pointer"
            _hover={{ color: "gray.500" }}
            margin="0px 16px 12px 0px"
          >
            Terms & Conditions
          </Text>
        </Flex>
      </Stack>
    </Flex>
  );
};

export default Sidebar;
