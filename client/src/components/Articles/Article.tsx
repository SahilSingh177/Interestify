import React from "react";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Flex,
  Heading,
  Badge,
  Text,
  VStack,
  HStack,
  Divider,
  Spacer,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment as regularComment,
  faBookmark as regularBookmark,
  faThumbsUp as regularThumbsup,
} from "@fortawesome/free-regular-svg-icons";

import {
  faBookmark as solidBookMark,
  faThumbsUp as solidThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

import AuthorCard from "../Author/AuthorCard";
import { toggleBookmark } from "@/Handlers/toggleBookmark";
import { AuthContext } from "@/Providers/AuthProvider";
import { toggleLike } from "@/Handlers/toggleLike";

type Props = {
  ArticleId: string;
  Content: string;
  Author: string;
  Category: string | null;
  Title: string;
  Summary: string;
  ReadingTime: string;
  PDFLink: string;
  ArticleLink: string;
};

const Article: React.FC<Props> = ({
  Content,
  Author,
  Category,
  Title,
  ReadingTime,
  ArticleId,
}: Props) => {
  const currentUser = useContext(AuthContext);
  const [articleProgress, setArticleProgress] = useState<number>(0);

  useEffect(() => {
    const startTime = Date.now();

    const updateCategoryTime = async ({ timeSpent }: { timeSpent: number }) => {
      try {
        await fetch('http://127.0.0.1:5000/addBrowsingTime', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "user_email": currentUser.email,
            "category_name": Category,
            "browsing_time": timeSpent
          }),
        });
      } catch (error) {
        console.error("Error updating category time:", error);
      }
    };

    return () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`Time spent on page: ${duration} milliseconds`);
      updateCategoryTime({ timeSpent: duration });
      console.log('yayyyy')
    };
  }, []);

  useEffect(() => {
    const updateBlogList = async () => {
      if (!currentUser) return;
      await fetch("http://127.0.0.1:5000/registerBlog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: currentUser.email,
          blog_id: ArticleId,
        }),
      });
    };


    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;

      setArticleProgress(progress);
    };

    const fetchHasLiked = async () => {
      if (!currentUser) return;
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/isArticleLiked?email=${currentUser.email}&blog_id=${ArticleId}`
        );
        const bodyData = await response.json();
        setHasLiked(bodyData.message);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchHasBookmarked = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/isArticleBookmarked?email=${currentUser.email}&blog_id=${ArticleId}`
        );
        const bodyData = await response.json();
        console.log(bodyData);
        setIsBookMarked(bodyData.message);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHasBookmarked();
    fetchHasLiked();
    updateBlogList();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [ArticleId]);

  const Router = useRouter();
  const [hasLiked, setHasLiked] = useState<boolean>(false); //liked or not should be fetched from backend
  const [isBookMarked, setIsBookMarked] = useState<boolean>(false);

  const handleBookmark = async () => {
    if (!currentUser) return;
    try {
      setIsBookMarked(!isBookMarked);
      await toggleBookmark(isBookMarked, ArticleId, currentUser);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async () => {
    if (!currentUser) return;
    try {
      setHasLiked(!hasLiked);
      await toggleLike(hasLiked, ArticleId, currentUser);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <VStack
      spacing={5}
      alignItems="flex-start"
      width="55vw"
      maxWidth="100vw"
      minHeight={`calc(100vh - 80px)`}
      marginLeft="5vw"
      marginRight="5vw"
      marginTop={`calc(80px + 5vh)`}
      bg="whiteAlpha.500"
      overflowX="hidden"
    >
      <CircularProgress
        position="fixed"
        bottom="2vh"
        left="2vh"
        value={Math.floor(articleProgress)}
        color="green.400"
      >
        <CircularProgressLabel>
          {Math.floor(articleProgress)}
        </CircularProgressLabel>
      </CircularProgress>

      <Heading color="gray.700">{Title}</Heading>
      <Heading as="h3" size="md" fontWeight="semibold" color="gray.600">
        Transform your life with these ChatGPT’s hidden gems.
      </Heading>

      <AuthorCard
        Author={Author}
        Category={Category}
        ReadTime={ReadingTime}
      ></AuthorCard>

      <Divider bg="gray.400" borderColor="gray.600" />

      <HStack spacing={5} paddingLeft={5} paddingRight={5} width="100%">
        <FontAwesomeIcon
          icon={hasLiked ? solidThumbsUp : regularThumbsup}
          size="lg"
          cursor="pointer"
          onClick={handleLike}
        />
        <FontAwesomeIcon icon={regularComment} size="lg" cursor="pointer" />
        <Spacer />
        <FontAwesomeIcon
          icon={isBookMarked ? solidBookMark : regularBookmark}
          onClick={handleBookmark}
          size="lg"
          cursor="pointer"
        />
      </HStack>

      <Divider bg="gray.400" borderColor="gray.600" />

      <Text lineHeight={2} padding={5} overflowX="hidden">
        {Content}
      </Text>

      <Flex flexWrap="wrap" marginTop={5} marginBottom={5}>
        <Badge
          marginLeft={5}
          marginBottom={5}
          padding={2}
          borderRadius={20}
          fontWeight="light"
          bg="gray.100"
        >
          Startup
        </Badge>
        <Badge
          marginLeft={5}
          marginBottom={5}
          padding={2}
          borderRadius={20}
          fontWeight="light"
          bg="gray.100"
        >
          Software Development
        </Badge>
        <Badge
          marginLeft={5}
          marginBottom={5}
          padding={2}
          borderRadius={20}
          fontWeight="light"
          bg="gray.100"
        >
          Software Architecture
        </Badge>
        <Badge
          marginLeft={5}
          marginBottom={5}
          padding={2}
          borderRadius={20}
          fontWeight="light"
          bg="gray.100"
        >
          Software Enginerring
        </Badge>
        <Badge
          marginLeft={5}
          marginBottom={5}
          padding={2}
          borderRadius={20}
          fontWeight="light"
          bg="gray.100"
        >
          Software Programming
        </Badge>
      </Flex>

      <Divider bg="gray.400" borderColor="gray.600" />
      <HStack spacing={5} paddingLeft={5} paddingRight={5} width="100%">
        <FontAwesomeIcon
          icon={hasLiked ? solidThumbsUp : regularThumbsup}
          size="lg"
          cursor="pointer"
          onClick={handleLike}
        />
        <FontAwesomeIcon icon={regularComment} size="lg" cursor="pointer" />
        <Spacer />
        <FontAwesomeIcon
          icon={isBookMarked ? solidBookMark : regularBookmark}
          onClick={handleBookmark}
          size="lg"
          cursor="pointer"
        />
      </HStack>
      <Divider bg="gray.400" borderColor="gray.600" marginBottom={10} />
    </VStack>
  );
};

export default Article;
