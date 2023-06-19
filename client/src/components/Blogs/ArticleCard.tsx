import React, { useState, useEffect } from "react";
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
import { getRandomColour } from "@/Handlers/getRandomColour";
import { toggleBookmark } from "@/Handlers/toggleBookmark";
import { toggleLike } from "@/Handlers/toggleLike";
import { auth } from "@/firebase/clientApp";

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
  const Router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isBookMarked, setIsBookMarked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(Likes);

  const handleBookmark = async () => {
    if (!auth.currentUser?.email) return;
    try{
      setIsBookMarked(!isBookMarked);
      await toggleBookmark(isBookMarked, ArticleLink);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async () => {
    if (!auth.currentUser?.email) return;
    try {
      setHasLiked(!hasLiked);
      hasLiked?setLikes(likes-1):setLikes(likes+1);
      await toggleLike(hasLiked,articleId);
    } catch (error) {
      console.error(error);
    }
  };

  const updateBlogList = async () => {
    if (!auth.currentUser?.email) return;
    await fetch("http://127.0.0.1:5000/registerBlog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: auth.currentUser?.email,
        blog_id: articleId,
      }),
    });
  };


  useEffect(() => {
    const fetchHasLiked = async () => {
      if (!auth.currentUser?.email) return;
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/isArticleLiked?email=${auth.currentUser?.email}&blog_id=${articleId}`
        );
        const bodyData = await response.json();
        setHasLiked(bodyData.message);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHasLiked();
  }, [articleId]);

  return (
    <>
      <Card
        bg="white"
        direction={{ md: "row", sm: "column" }}
        overflow="hidden"
        size="md"
        marginBottom={5}
        cursor="pointer"
      >
        <VStack width="full">
          <CardBody width="full" onClick={() => Router.push(`/article/${articleId}`)}>
            <HStack>
              <Heading size="md" width="90%">
                {Title ? Title : "Title"}
              </Heading>
              <Tag size="sm" variant="solid" colorScheme={getRandomColour()}>
                {Category ? Category : "Unknown"}
              </Tag>
            </HStack>
            <Text py="2">{Summary ? Summary : "Summary"}</Text>
          </CardBody>
          <CardFooter width="full" marginTop={2}>
            <HStack spacing={4} width="full">
              <HStack spacing={1}>
                <Icon
                  as={hasLiked ? FaThumbsUp : FaRegThumbsUp}
                  onClick={() => { handleLike() }}
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

export const revalidate = false;
export default ArticleCard;