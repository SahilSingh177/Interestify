import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Card, CardBody, CardFooter, Icon, Tag, VStack, HStack, Spacer, Heading, Text} from '@chakra-ui/react'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { Link } from '@chakra-ui/react'
import { getRandomColour } from '@/helper/getRandomColour';

type Props = {
    author: string;
    article_id: string,
    link: string;
    title: string,
}

const BookmarkCard = ({author,article_id,link,title}: Props) => {
    const Router = useRouter();
    const [isBookMarked, setIsBookMarked] = useState<Boolean>(false);

    const bookmarkArticle = () => {
      setIsBookMarked(false);
    }
  return (
    <Card
    bg='white'
    direction={{ md: 'row', sm: 'column' }}
    overflow='hidden'
    size="md"
    marginBottom={5}
    cursor='pointer'
    width="80%"
  >
    <VStack width="full">
      <CardBody width="full">
        <HStack>
          <Heading size='md' width='90%'>{title}</Heading>
          <Spacer/>
          <Tag size="sm" variant='solid' colorScheme={getRandomColour()}>Unknown
              </Tag>
        </HStack>
      </CardBody>

      <CardFooter width="full">
        <HStack spacing={4} justifyContent="flex-end" width="full">
          <Link href={link} isExternal color="teal" _hover={{textDecoration:"none"}} >Read Full Article Here</Link>
          <Spacer/>
          <Text fontSize='sm' color="gray.500">By {author}</Text>
          <Icon as={FaBookmark} onClick={bookmarkArticle} />
        </HStack>
      </CardFooter>
    </VStack>
  </Card>
  )
}

export default BookmarkCard