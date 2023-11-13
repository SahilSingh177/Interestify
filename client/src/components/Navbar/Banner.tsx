import React, { useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Flex,
  Box,
  Button,
  Text,
  Stack,
  Divider,
  VStack,
  Center,
} from "@chakra-ui/react";
import { AuthContext } from "@/Providers/AuthProvider";

const Banner: React.FC = () => {
  const router = useRouter();
  const currentUser = useContext(AuthContext);

  return (
    <Flex
      flexDirection="column"
      width={["100vw", "100vw", "100vw", `calc(100vw - 12px)`]}
      overflowX="hidden"
      pl='7.5vw'
      pr='7.5vw'
      bg="#f59e0b"
    >
      {!currentUser && (
        <Flex
          flexDirection="row"
          height="60vh"
          marginTop="0"
          alignItems="center"
        >
          <Stack
            width="50%"
            height="full"
            justifyContent="center" 
          >
            <Text fontSize={{ lg: "6xl", md: "4xl", sm: "4xl", base: "3xl" }}>
              Stay Curious
            </Text>
            <Text fontSize={{ lg: "3xl", md: "2xl", sm: "xl", base: "md" }}>
              Discover stories, thinking, and expertise from writers on any
              topic.
            </Text>
            <Button
              variant="solid"
              fontWeight="bold"
              size={["md", "md", "md", "lg"]}
              marginTop="5%"
              width="70%"
              onClick={() => router.push("/signup")}
            >
              Start Reading
            </Button>
          </Stack>
            <Flex
              width="50%"
              height="full"
              alignItems='center'
              justifyContent='center'
            >
              <Image
                priority={true}
                width="500"
                height="500"
                alt="reading guy"
                src="/assets/reading_guy.png"
              ></Image>
            </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default Banner;
