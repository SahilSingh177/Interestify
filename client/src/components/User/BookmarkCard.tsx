import React, { useState, useContext, useMemo } from "react";
import { AuthContext } from "@/Providers/AuthProvider";
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
  useColorModeValue,
} from "@chakra-ui/react";
import { FaBookmark } from "react-icons/fa";
import { toggleBookmark } from "@/Handlers/toggleBookmark";

type Props = {
  author: string;
  article_id: string;
  link: string;
  title: string;
  toBeDisplayed: boolean;
  category: string;
};

const BookmarkCard = ({
  author,
  article_id,
  link,
  title,
  toBeDisplayed,
  category,
}: Props) => {
  const currentUser = useContext(AuthContext);
  const [isBookMarked, setIsBookMarked] = useState<boolean>(true);

  const colours = ["red", "orange", "yellow", "teal", "cyan", "purple", "pink"];
  const getRandomColour = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * colours.length);
    return colours[randomIndex];
  }, []);

  const handleBookmark = async () => {
    if (!currentUser) return;
    try {
      setIsBookMarked(!isBookMarked);
      await toggleBookmark(isBookMarked, article_id, currentUser);
    } catch (error) {
      console.error(error);
    }
  };

  return isBookMarked && toBeDisplayed ? (
    <Card
      bg={useColorModeValue('white','#192734')}
      direction={{ md: "row", sm: "column" }}
      overflow="hidden"
      size="md"
      marginBottom={5}
      cursor="pointer"
      width={["90%","90%","90%","80%"]}
      style={{ WebkitTapHighlightColor: "rgba(0, 0, 0, 0)" }}
    >
      <VStack width="full" spacing={0} >
        <CardBody width="full">
          <HStack>
            <Heading   size={["sm", "md", "md", "md"]} width={["100%", "100%", "90%", "90%"]}>
              {title}
            </Heading>
            <Spacer />
            <Tag
              size="sm"
              display={["none", "none", "block", "block"]}
              variant="solid"
              colorScheme={getRandomColour}
              height="fit-content"
              paddingTop={1}
              paddingBottom={1}
            >
              {category}
            </Tag>
          </HStack>
        </CardBody>

        <CardFooter width="full" fontSize={['sm','sm','sm','sm']}>
          <HStack spacing={4} justifyContent="flex-end" width="full">
            <Link
              href={`/article/${article_id}`}
              isExternal
              color="teal"
              _hover={{ textDecoration: "underline" }}
            >
              Read Full Article Here
            </Link>
            <Spacer />
            <Text color="gray.500">
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
