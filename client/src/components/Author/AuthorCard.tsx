import React from "react";
import {
  VStack,
  Stack,
  Flex,
  Box,
  Text,
  Link,
  Avatar,
} from "@chakra-ui/react";

type AuthorData = {
  Author: string;
  Category: string | null;
  ReadTime: string;
};

const AuthorCard: React.FC<AuthorData> = ({ Author, Category, ReadTime }) => {
  return (
    <Flex flexDirection={{ md: "row", sm: "column" }} >
      <Avatar src="/assets/default_profile_photo.png" />
      <VStack>
        <Box ml="3">
          <Text fontSize={['sm','sm','md','md']} fontWeight="bold">{Author}</Text>
          <Stack
            direction={{ md: "row", sm: "column" }}
            spacing={{ md: "4", sm: "2" }}
          >
            <Text fontSize={['x-small','x-small','sm','sm']} color="gray.500" marginRight={2}>
              Published in{" "}
              <Link color="black">{Category ? Category : "Unknown"}</Link>
            </Text>
            <Text fontSize={['x-small','x-small','sm','sm']} color="gray.500">
              {ReadTime}
            </Text>
          </Stack>
        </Box>
      </VStack>
    </Flex>
  );
};

export default AuthorCard;
