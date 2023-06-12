import React from 'react';
import { Box, Card, Image, Stack, CardBody, Heading, Text, CardFooter, Button, Flex } from '@chakra-ui/react';

type Props = {};

const Article: React.FC<Props> = () => {
  return (
    <>
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow='hidden'
        variant='outline'
        marginTop="3vh"
        width="100%"
        // minHeight="auto"
        height="30vh"
      >
        <Stack height="100%">
          <CardBody width="60%">
            <Heading size='md'>The perfect latte</Heading>
            <Text py='2'>
              Caffè latte is a coffee beverage of Italian origin made with espresso
              and steamed milk.
            </Text>
          </CardBody>
          <Flex margin="0px 0px 2% 2%">
            <Button variant='success' width="15%" marginRight="2%">
              Likes
            </Button>
            <Button variant='danger'>
              Dislikes
            </Button>
          </Flex>
        </Stack>
        <Box width="40%" height="100%">
          <Image
            marginRight="0"
            objectFit='cover'
            height="100%"
            src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
            alt='Caffe Latte'
          />
        </Box>
      </Card>
    </>
  );
};

export default Article;
