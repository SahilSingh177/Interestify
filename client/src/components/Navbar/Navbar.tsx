import React from "react";
import { Box, Flex, Image, Text, Button, Divider, Stack } from "@chakra-ui/react";
import AuthButtons from "./AuthButtons";
import Banner from "./Banner";

const Navbar: React.FC = () => {
  return <>
      <Flex bg="#ffdf00"
        height="80px"
        padding="10px 10vw"
        justifyContent="space-between"
        alignItems="center"
        >
        <Text fontWeight="extrabold" fontSize="40px" >Intrestify</Text>
        <Flex>
          <AuthButtons></AuthButtons>
        </Flex>
      </Flex>
  </>;
};

export default Navbar;
