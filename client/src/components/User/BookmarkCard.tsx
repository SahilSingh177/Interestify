import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/Providers/AuthProvider';
import {
  Card,
  CardBody,
  CardFooter,
  Icon,
  Tag,
  VStack,
  HStack,
  Spacer,
  Heading,
  Text,
  Link,
} from '@chakra-ui/react';
import { FaBookmark } from 'react-icons/fa';
import { getRandomColour } from '@/Handlers/getRandomColour';
import { toggleBookmark } from '@/Handlers/toggleBookmark';

type Props = {
  author: string;
  article_id: string;
  link: string;
  title: string;
};

const BookmarkCard = ({ author, article_id, link, title }: Props) => {
  const currentUser = useContext(AuthContext);
  const [isBookMarked, setIsBookMarked] = useState<boolean>(true);

  const handleBookmark = async () => {
    if (!currentUser) return;
    try {
      setIsBookMarked(!isBookMarked);
      await toggleBookmark(isBookMarked, article_id, currentUser);
    } catch (error) {
      console.error(error);
    }
  };

  return isBookMarked ? (
    <Card bg="white" direction={{ md: 'row', sm: 'column' }} overflow="hidden" size="md" marginBottom={5} cursor="pointer" width="80%">
      <VStack width="full">
        <CardBody width="full">
          <HStack>
            <Heading size="md" width="90%">
              {title}
            </Heading>
            <Spacer />
            <Tag size="sm" variant="solid" colorScheme={getRandomColour()}>
              Unknown
            </Tag>
          </HStack>
        </CardBody>

        <CardFooter width="full">
          <HStack spacing={4} justifyContent="flex-end" width="full">
            <Link href={link} isExternal color="teal" _hover={{ textDecoration: 'none' }}>
              Read Full Article Here
            </Link>
            <Spacer />
            <Text fontSize="sm" color="gray.500">
              By {author}
            </Text>
            <Icon as={FaBookmark} onClick={handleBookmark} />
          </HStack>
        </CardFooter>
      </VStack>
    </Card>
  ) : null;
};

export default BookmarkCard;
