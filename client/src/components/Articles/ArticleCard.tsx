import React, { useContext, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Spacer,
  Card,
  VStack,
  HStack,
  CardBody,
  Heading,
  Text,
  CardFooter,
  Icon,
  Tag,
} from "@chakra-ui/react";
import {
  FaBookmark,
  FaRegBookmark,
  FaRegEye,
  FaRegThumbsUp,
  FaThumbsUp,
} from "react-icons/fa";
import { toggleBookmark } from "@/Handlers/toggleBookmark";
import { toggleLike } from "@/Handlers/toggleLike";
import { AuthContext } from "@/Providers/AuthProvider";
import ShowAlert from "../Alert/ShowAlert";

type Props = {
  articleId: string;
  Author: string;
  Category: string | null;
  Title: string;
  Summary: string;
  ReadingTime: string;
  ArticleLink: string;
  Likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
};

const ArticleCard: React.FC<Props> = ({
  articleId,
  Author,
  Category,
  Title,
  Summary,
  ReadingTime,
  Likes,
  isLiked,
  isBookmarked,
}: Props) => {
  const currentUser = useContext(AuthContext);
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const Router = useRouter();
  const [hasLiked, setHasLiked] = useState<boolean>(isLiked ? isLiked : false);
  const [isBookMarked, setIsBookMarked] = useState<boolean>(
    isBookmarked ? isBookmarked : false
  );
  const [likes, setLikes] = useState<number>(Likes);

  const colours = ["red", "orange", "yellow", "teal", "cyan", "purple", "pink"];

  const getRandomColour = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * colours.length);
    return colours[randomIndex];
  }, []);

  const handleBookmark = async () => {
    if (!currentUser){
      setIsAlertVisible(true);
      return;
    }
    try {
      setIsBookMarked(!isBookMarked);
      await toggleBookmark(isBookMarked, articleId, currentUser);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async () => {
    if (!currentUser){
      setIsAlertVisible(true);
      return;
    }
    try {
      setHasLiked(!hasLiked);
      hasLiked ? setLikes(likes - 1) : setLikes(likes + 1);
      await toggleLike(hasLiked, articleId, currentUser);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ShowAlert
        type="warning"
        message="Please login first"
        title=""
        isVisible={isAlertVisible}
        onClose={() => setIsAlertVisible(false)}
      />
      <Card
        direction={["column", "row"]}
        overflow="hidden"
        size="md"
        marginBottom={5}
        cursor="pointer"
        fontSize={['x-small','x-small','sm','sm']}
      >
        <VStack width="full">
          <CardBody
            width="full"
            onClick={() => Router.push(`/article/${articleId}`)}
          >
            <HStack>
              <Heading
                fontSize={["md", "md", "1.7rem", "1.7rem"]}
                width={["100%", "100%", "90%", "90%"]}
              >
                {Title ? Title : "Title"}
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
                textAlign="center"
              >
                {Category ? Category : "Unknown"}
              </Tag>
            </HStack>
            <Text py="2" fontSize={['sm','sm','md','md']}>
              {Summary ? Summary : "Summary"}
            </Text>
          </CardBody>
          <CardFooter width="full" paddingTop={0} fontSize={['sm','sm','sm','sm']}>
            <HStack spacing={4} width="full">
              <HStack spacing={1}>
                <Icon
                  as={hasLiked ? FaThumbsUp : FaRegThumbsUp}
                  onClick={() => {
                    handleLike();
                  }}
                />
                <Text  color="gray.500">
                  {likes}
                </Text>
              </HStack>
              <HStack spacing={1}>
                <Icon as={FaRegEye} />
                <Text  color="gray.500">
                  {ReadingTime}
                </Text>
              </HStack>
              <Spacer />
              <Text  color="gray.500">
                By {Author ? Author : "Unknown"}
              </Text>
              <Icon
                as={isBookMarked ? FaBookmark : FaRegBookmark}
                onClick={handleBookmark}
              />
            </HStack>
          </CardFooter>
        </VStack>
      </Card>
    </>
  );
};

export default ArticleCard;
