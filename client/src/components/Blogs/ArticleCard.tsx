import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Spacer, Card, Image, VStack, HStack, CardBody, Heading, Text, CardFooter, Icon, Tag } from '@chakra-ui/react';
import { FaBookmark, FaRegBookmark, FaRegEye, FaRegThumbsUp } from 'react-icons/fa';

type Props = {
  Author: string,
  Category: string |null,
};

const ArticleCard: React.FC<Props> = ({Author,Category}:Props) => {
  const Router = useRouter();
  const [isLiked, setIsLiked] = useState<Boolean>(false); //liked or not should be fetched from backend
  const [isBookMarked, setIsBookMarked] = useState<Boolean>(false);

  const bookmarkArticle = () => {
    setIsBookMarked(!isBookMarked);
    if (isBookMarked) {
      const articleLink = Router.asPath;
      console.log("Bookmarked: ")
      console.log(articleLink);
    }
  }
  return (
    <>
      <Card
        bg='white'
        direction={{ md: 'row', sm: 'column' }}
        overflow='hidden'
        size="md"
        marginBottom={5}
        cursor='pointer'
      >
        {/* <Image
          objectFit='cover'
          maxW={{ md: '25%', sm: '100%' }}
          maxHeight={{ md: '100%', sm: '50%' }}
          src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
          alt='Caffe Latte'
        /> */}

        <VStack width="full">
          <CardBody width="full" onClick={() => Router.push('/article')}>
            <HStack>
              <Heading size='md'>The perfect latte</Heading>
              <Tag size="sm" variant='solid' colorScheme='teal'>
                {Category?Category:"Unknown"}
              </Tag>

            </HStack>
            <Text py='2'>
              Caffè latte is a coffee beverage of Italian origin made with espresso
              and steamed milk.
            </Text>
          </CardBody>

          <CardFooter width="full">
            <HStack spacing={4} width="full">
              <HStack spacing={1}>
                <Icon as={FaRegThumbsUp}></Icon>
                <Text fontSize='sm' color="gray.500">69</Text>
              </HStack>
              <HStack spacing={1}>
                <Icon as={FaRegEye}></Icon>
                <Text fontSize='sm' color="gray.500">5 min read</Text>
              </HStack>
              <Spacer />
              <Text fontSize='sm' color="gray.500">By {Author?Author:"Unknown"}</Text>
              <Icon as={isBookMarked ? FaBookmark : FaRegBookmark} onClick={bookmarkArticle} />
            </HStack>
          </CardFooter>
        </VStack>
      </Card>
    </>
  );
};

export default ArticleCard;
