import React, { useState } from "react";
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
} from "react-icons/fa";
import { getRandomColour } from "@/Handlers/getRandomColour";
import { bookmarkArticle } from "@/Handlers/bookmarkArticle";
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
  hasLiked: boolean | null;
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
  hasLiked,
}: Props) => {
  const Router = useRouter();
  const [isLiked, setIsLiked] = useState<boolean>(hasLiked ? hasLiked : false);
  const [isBookMarked, setIsBookMarked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(Likes);

  const handleBookmark = async () => {
    const updatedIsBookmarked = await bookmarkArticle(
      isBookMarked,
      ArticleLink
    );
    setIsBookMarked(updatedIsBookmarked);
  };

  const updateBlogList = async (articleId: string) => {
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

  const handleClick = (articleId: string) => {
    Router.push(`/article/${articleId}`);
    updateBlogList(articleId);
  };

  const likeArticle = (articleId: string) => async () => {
    if (!auth.currentUser?.email) return;
    if (isLiked) {
      setIsLiked(false);
      try {
        let response = await fetch(
          "http://127.0.0.1:5000/likeArticle?email=" +
            auth.currentUser?.email +
            "&blog_id=" +
            articleId,
          { next: { revalidate: 60 } }
        );
        const bodyData = await response.json();
        setLikes(bodyData);
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsLiked(true);
      try {
        let response = await fetch(
          "http://127.0.0.1:5000/dislikeArticle?email=" +
            auth.currentUser?.email +
            "&blog_id=" +
            articleId,
          { next: { revalidate: 60 } }
        );
        const bodyData = await response.json();
        setLikes(bodyData);
      } catch (error) {
        console.error(error);
      }
    }
  };

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
          <CardBody width="full" onClick={() => handleClick(articleId)}>
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
                <Icon as={FaRegThumbsUp} onClick={likeArticle(articleId)} />
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