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
      pl={['7.5vw','7.5vw','10vw','10vw']}
      pr={['7.5vw','7.5vw','10vw','10vw']}
      bg="#f59e0b"
    >
      {!currentUser && (
        <Flex
          flexDirection={["column", "column", "row", "row"]}
          height={['auto','auto','60vh','60vh']}
          pt='5vh'
          pb='5vh'
          marginTop="0"
          alignItems="center"
        >
          <Stack
            width={["90%", "90%", "50%", "50%"]}
            height="full"
            justifyContent="center"
            alignItems={['center','center','flex-start','flex-start']}
          >
            <Box
              display={["block", "block", "none", "none"]}
              width={["90%", "90%", "50%", "50%"]}
              height="auto"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                priority={true}
                width="500"
                height="500"
                alt="reading guy"
                src="/assets/reading_guy.png"
              ></Image>
            </Box>
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
            display={["none", "none", "block", "block"]}
            width={["90%", "90%", "50%", "50%"]}
            height='"full"'
            alignItems="flex-end"
            justifyContent="flex-end"
            // bg='red'
          >
            {/* <Center> */}

            <Image
              style={{marginLeft:'auto'}}
              priority={true}
              width="500"
              height="500"
              alt="reading guy"
              src="/assets/reading_guy.png"
            ></Image>
            {/* </Center> */}
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default Banner;
