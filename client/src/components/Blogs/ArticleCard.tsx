import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Spacer, Card, Image, VStack, HStack, CardBody, Heading, Text, CardFooter, Icon, Tag } from '@chakra-ui/react';
import { FaBookmark, FaRegBookmark, FaRegEye, FaRegThumbsUp } from 'react-icons/fa';

type Props = {
  articleId: string
  Author: string,
  Category: string |null,
  Title: string,
  Summary: string,
  ReadingTime: string,
};

const ArticleCard: React.FC<Props> = ({articleId,Author,Category,Title,Summary, ReadingTime}:Props) => {
  const colours=["red","orange","yellow","teal","cyan","purple","pink"];
  const getRandomColour = ()=>{
    const randomIndex = Math.floor(Math.random()*colours.length);
    return colours[randomIndex];
  }
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
