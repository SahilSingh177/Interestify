"use client";

import { Container, Flex, Heading, Input, Button, Spacer, Text } from "@chakra-ui/react";
import { Tabs, TabList, Box, Tab, TabPanel } from "@chakra-ui/react";
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from '@chakra-ui/react'

export default function Home() {
  return (
    <>
      <Flex width="100vw" height="7vh" background="#160303" p={1}>
        <Tabs variant="soft-rounded" colorScheme="green" m={2} pr={4}>
          <TabList>
            <Tab>Home</Tab>
            <Tab>Explore</Tab>
          </TabList>
        </Tabs>
        <Spacer />
        <Button colorScheme='blue' mr={5} mt={1}>Login</Button>
      </Flex>
      <Box display="flex" height="95vh" width="100vw">
        <Box background="#F5F5E6" w="70vw">
          <Container>
            <Text textColor="black" mt={4}>
              A wiki (/ˈwɪki/ WIK-ee) is an online hypertext publication
              collaboratively edited and managed by its own audience, using a
              web browser. A typical wiki contains multiple pages for the
              subjects or scope of the project, and could be either open to the
              public or limited to use within an organization ...
            </Text>
          </Container>
        </Box>
        <Box background="#E8F3F6" w="30vw">
          <List spacing={3} ml={2} pb={3} mt={3}>
            <ListItem color="black">
              <ListIcon as="svg" color="green.500"/>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit
            </ListItem>
            <ListItem color="black">
              <ListIcon as="svg" color="green.500" />
              Assumenda, quia temporibus eveniet a libero incidunt suscipit
            </ListItem>
            <ListItem color="black">
              <ListIcon as="svg" color="green.500" />
              Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
            </ListItem>
            {/* You can also use custom icons from react-icons */}
            <ListItem color="black">
              <ListIcon as="svg" color="green.500" />
              Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
            </ListItem>
          </List>
        </Box>
      </Box>
    </>
  );
}
