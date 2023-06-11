import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import AuthButtons from "./AuthButtons";

const Navbar: React.FC = () => {
  return (
    <Flex bg="red.400"
          height="60px"
          padding="6px 12px"
          justifyContent="space-between">
      <Text>Navbar Content</Text>
      <Flex>
        <AuthButtons></AuthButtons>
      </Flex>
    </Flex>
  );
};

export default Navbar;
