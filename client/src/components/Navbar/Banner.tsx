import React from 'react'
import { Flex, Box, Button, Text, Stack, Divider, Image } from '@chakra-ui/react'

type Props = {}

const Banner: React.FC = () => {
  return (
    <Flex flexDirection="column" width="100vw">
      <Divider
        orientation="horizontal"
        size="5px"
        bg="black"
        borderColor="black"
      />
      <Flex flexDirection="row" height="60vh" bg="#ffdf00" marginTop="0" alignItems="center">
        <Box width="50vw" paddingLeft="10%">
          <Stack>
            <Text fontSize="80px">Stay Curious</Text>
            <Text fontSize="30px">Discover stories, thinking, and expertise from writers on any topic.
            </Text>
            <Button variant="solid" width="30%" size={{base:'lg',md:'md',sm:'sm'}} marginTop="5%">Start Reading</Button>
          </Stack>
        </Box>
        <Image src="/assets/reading_guy.png" width="50%" height="100%" padding="0 5%" objectFit="cover"></Image>
      </Flex>
    </Flex>
  )
}

export default Banner