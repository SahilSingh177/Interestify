import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Card, CardBody, CardFooter, Icon, Tag, VStack, HStack, Spacer, Heading, Text} from '@chakra-ui/react'
import { FaBookmark, FaRegBookmark, FaRegEye, FaRegThumbsUp } from 'react-icons/fa'
import { Link } from '@chakra-ui/next-js'

type Props = {}

const BookmarkCard = (props: Props) => {
    const Router = useRouter();
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
          <Heading size='md' width='90%'>Message from the Guest Editor of the 18th Multiphase Flow Conference Special Issue</Heading>
          <Tag size="sm" variant='solid' colorScheme="teal">Unknown
              </Tag>
        </HStack>
      </CardBody>

      <CardFooter width="full">
        <HStack spacing={4} justifyContent="flex-end" width="full">
          <Link href="https://link.springer.com/article/10.1007/s42757-022-0154-6" color="teal" >Read Full Article Here</Link>
          <Spacer/>
          <Text fontSize='sm' color="gray.500">By "NERD"</Text>
          <Icon as={isBookMarked ? FaBookmark : FaRegBookmark} onClick={bookmarkArticle} />
        </HStack>
      </CardFooter>
    </VStack>
  </Card>
  )
}

export default BookmarkCard