import React, { useContext} from 'react'
import { Flex, Box, Button, Text, Stack, Divider, Image } from '@chakra-ui/react'
import { AuthContext } from '@/Providers/AuthProvider'

const Banner: React.FC = () => {
  const currentUser = useContext(AuthContext);
  return (
    <Flex flexDirection="column" width={`calc(100vw - 12px)`} overflowX="hidden">
      {!currentUser && <Flex flexDirection="row" height="60vh" bg="#ffdf00" marginTop="0" alignItems="center">
        <Box width="50vw" paddingLeft="10%">
          <Stack>
            <Text fontSize={{ lg: "7xl", md: "5xl", sm: "4xl", base: "3xl" }}>Stay Curious</Text>
            <Text fontSize={{ lg: "3xl", md: "2xl", sm: "xl", base: "md" }}>Discover stories, thinking, and expertise from writers on any topic.
            </Text>
            <Button variant="solid" fontWeight="bold" width={{ lg: "180px", md: "150px", sm: "100px" }} 
            size={{ lg: 'lg', md: 'md', sm: 'sm' }} marginTop="5%">Start Reading</Button>
          </Stack>
        </Box>
        <Image src="/assets/reading_guy.png" width="50%" height="100%" padding="0 5%" objectFit="cover"></Image>
      </Flex>}
    </Flex>
  )
}

export default Banner