import React, { useContext, useState, useEffect,useMemo } from "react";
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
  Stack,
} from "@chakra-ui/react";
import {
  FaBookmark,
  FaRegBookmark,
  FaRegEye,
  FaRegThumbsUp,
  FaThumbsUp,
} from "react-icons/fa";
// import { getRandomColour } from "@/Handlers/getRandomColour";
import { toggleBookmark } from "@/Handlers/toggleBookmark";
import { toggleLike } from "@/Handlers/toggleLike";
import { AuthContext } from "@/Providers/AuthProvider";

type Props = {
  articleId: string;
  Author: string;
  Category: string | null;
  Title: string;
  Summary: string;
  ReadingTime: string;
  ArticleLink: string;
  Likes: number;
};

const ArticleCard: React.FC<Props> = ({
  articleId,
  Author,
  Category,
  Title,
  Summary,
  ReadingTime,
  ArticleLink,
  Likes,
}: Props) => {
  const currentUser = useContext(AuthContext);
  const Router = useRouter();
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isBookMarked, setIsBookMarked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(Likes);

  const colours = ["red", "orange", "yellow", "teal", "cyan", "purple", "pink"];

  const getRandomColour = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * colours.length);
    return colours[randomIndex];
  }, []);


  const handleBookmark = async () => {
    if (!currentUser) return;
    try{
      setIsBookMarked(!isBookMarked);
      await toggleBookmark(isBookMarked, articleId, currentUser);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async () => {
    if (!currentUser) return;
    try {
      setHasLiked(!hasLiked);
      hasLiked ? setLikes(likes - 1) : setLikes(likes + 1);
      await toggleLike(hasLiked, articleId, currentUser);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    
    const fetchHasLiked = async () => {
      if (!currentUser) return;
      try {
        const response = await fetch(
          `https://nikhilranjan.pythonanywhere.com/isArticleLiked?email=${currentUser.email}&blog_id=${articleId}`
        );
        const bodyData = await response.json();
        setHasLiked(bodyData.message);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchHasBookmarked = async () => {
      if (!currentUser) return;
      try {
        const response = await fetch(
          `https://nikhilranjan.pythonanywhere.com/isArticleBookmarked?email=${currentUser.email}&blog_id=${articleId}`
        );
        const bodyData = await response.json();
        setIsBookMarked(bodyData.message);
      } catch (error) {
        console.error(error);
      }
    };
    Promise.all([fetchHasLiked(), fetchHasBookmarked()]);
    
  }, [articleId]);

  return (
    <>
      <Card
        direction={["column","row"]}
        overflow="hidden"
        size="md"
        marginBottom={5}
        cursor="pointer"
        style={{ WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)' }}
      >
        <VStack width="full">
          <CardBody width="full" onClick={() => Router.push(`/article/${articleId}`)}>
            <HStack>
              <Heading size={["md","md","md","lg"]} width={["100%","100%","90%","90%"]}>
                {Title ? Title : "Title"}
              </Heading>
              <Tag size="sm" display={["none","none","block","block"]} variant="solid" colorScheme={getRandomColour}>
                {Category ? Category : "Unknown"}
              </Tag>
            </HStack>
            <Text py="2" fontSize={{md:'md',base:'sm'}}>{Summary ? Summary : "Summary"}</Text>
          </CardBody>
          <CardFooter width="full" paddingTop={0}>
            <HStack spacing={4} width="full">
              <HStack spacing={1}>
                <Icon
                  as={hasLiked ? FaThumbsUp : FaRegThumbsUp}
                  onClick={() => {
                    handleLike();
                  }}
                />
                <Text fontSize="sm" color="gray.500">
                  {likes}
                </Text>
              </HStack>
              <HStack spacing={1}>
                <Icon as={FaRegEye} />
                <Text fontSize="sm" color="gray.500">
                  {ReadingTime}
                </Text>
              </HStack>
              <Spacer />
              <Text fontSize="sm" color="gray.500">
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