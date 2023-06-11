import React from 'react'
import { Flex, Box, Button, Text, Stack, Divider, Image} from '@chakra-ui/react'
// import {} from './AuthButtons'

type Props = {}

const Banner:React.FC = () => {
  return (
    <Flex flexDirection="column">
        <Divider
      orientation="horizontal"
      size="5px"
      bg="black"
      borderColor="black"
    />
    <Flex flexDirection="row" height="60vh" bg="#ffdf00" marginTop="0" alignItems="center">
        <Box width="50vw" paddingLeft="10vw">
            <Stack>
                <Text fontSize="80px">Stay Curious</Text>
                <Text fontSize="30px">Discover stories, thinking, and expertise from writers on any topic.
                </Text>
                <Button variant="solid" width="30%" size="lg" marginTop="5%">Start Reading</Button>
            </Stack>
        </Box>
        <Box width="50vw" padding="5vw 5vw">
            <Image src="/assets/reading_guy.png" boxSize="40vw" objectFit="cover"></Image>
        </Box>
    </Flex>
    </Flex>
  )
}

export default Banner