import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Spacer, Card, VStack, HStack, CardBody, Heading, Text, CardFooter, Icon, Tag } from '@chakra-ui/react';
import { FaBookmark, FaRegBookmark, FaRegEye, FaRegThumbsUp } from 'react-icons/fa';
import { getRandomColour } from '@/helper/getRandomColour';

type Props = {
  articleId: string
  Author: string,
  Category: string |null,
  Title: string,
  Summary: string,
  ReadingTime: string,
  ArticleLink: string,
};

const ArticleCard: React.FC<Props> = 
        ({articleId,Author,Category,Title,Summary, ReadingTime,ArticleLink}:Props) => {
  const Router = useRouter();
  const [isLiked, setIsLiked] = useState<Boolean>(false);
  const [isBookMarked, setIsBookMarked] = useState<Boolean>(false);

  const bookmarkArticle = async () => {
    if(!isBookMarked){
      await fetch(`http://127.0.0.1:5000/addBookmark?email=test@mail&link=${ArticleLink}`); 
      setIsBookMarked(true);
      console.log("SUCCESSFULLY ADDED")
    }
    else{
      await fetch(`http://127.0.0.1:5000/deleteBookmark?email=test@mail&link=${ArticleLink}`); 
      setIsBookMarked(false);
      console.log("DELETED SUCCESSFULLY")     
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
        <VStack width="full">
          <CardBody width="full" onClick={() => Router.push(`/article/${articleId}`)}>
            <HStack>
              <Heading size='md' width='90%'>{Title?Title:"Title"}</Heading>
              <Tag size="sm" variant='solid' colorScheme={getRandomColour()}>
                {Category?Category:"Unknown"}
              </Tag>

            </HStack>
            <Text py='2'>
              {Summary?Summary:"Summary"}
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
                <Text fontSize='sm' color="gray.500">{ReadingTime}</Text>
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
export const revalidate = false
export default ArticleCard;