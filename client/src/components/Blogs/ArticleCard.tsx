import React from 'react';
import { useRouter } from 'next/router';
import { Box, Card, Image, Stack, CardBody, Heading, Text, CardFooter, Button, Flex } from '@chakra-ui/react';

type Props = {};

const ArticleCard: React.FC<Props> = () => {
  const Router = useRouter();
  return (
    <>
      <Card
        minHeight='20vh'
        direction={{ md: 'row', sm: 'column' }}
        overflow='hidden'
        variant='outline'
        cursor='pointer'
        onClick={()=>Router.push('/article')}
      >
        <Image
          objectFit='cover'
          maxW={{ md: '30%', sm: '100%' }}
          maxHeight={{md:'100%', sm:'50%'}}
          src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
          alt='Caffe Latte'
        />

        <Stack>
          <CardBody>
            <Heading size='md'>The perfect latte</Heading>

            <Text py='2'>
              Caffè latte is a coffee beverage of Italian origin made with espresso
              and steamed milk.
            </Text>
          </CardBody>

          <CardFooter>
            <Button variant='solid' colorScheme='blue'>
              Buy Latte
            </Button>
          </CardFooter>
        </Stack>
      </Card>
    </>
  );
};

export default ArticleCard;
