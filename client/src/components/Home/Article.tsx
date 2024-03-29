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
  Icon,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";

import {
  FaRegComment as regularComment,
  FaRegBookmark as regularBookmark,
  FaRegThumbsUp as regularThumbsup,
  FaBookmark as solidBookMark,
  FaThumbsUp as solidThumbsUp,
} from "react-icons/fa";

import AuthorCard from "../Author/AuthorCard";
import { AuthContext } from "@/Providers/AuthProvider";
import { toggleBookmark } from "@/Handlers/toggleBookmark";
import { toggleLike } from "@/Handlers/toggleLike";
import ShowAlert from "../Alert/ShowAlert";

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
  isLiked: boolean;
  isBookmarked: boolean;
};

const Article: React.FC<Props> = ({
  Content,
  Author,
  Category,
  Title,
  ReadingTime,
  ArticleId,
  isLiked,
  isBookmarked,
}: Props) => {
  const currentUser = useContext(AuthContext);
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [articleProgress, setArticleProgress] = useState<number>(0);

  useEffect(() => {
    const startTime = Date.now();

    const updateCategoryTime = async ({ timeSpent }: { timeSpent: number }) => {
      try {
        await fetch("https://nikhilranjan.pythonanywhere.com/updateCategoryScore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: currentUser?.email,
            category_name: Category,
            duration: timeSpent,
          }),
        });
      } catch (error) {
        console.error("Error updating category time:", error);
      }
    };

    return () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      updateCategoryTime({ timeSpent: duration });
      console.log("yayyyy");
    };
  }, []);

  useEffect(() => {
    const updateBlogList = async () => {
      if (!currentUser) return;
      await fetch("https://nikhilranjan.pythonanywhere.com/registerBlog", {
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

    const promises = [updateBlogList()];

    Promise.all(promises);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [ArticleId]);

  const Router = useRouter();
  const [hasLiked, setHasLiked] = useState<boolean>(isLiked ? isLiked : false); //liked or not should be fetched from backend
  const [isBookMarked, setIsBookMarked] = useState<boolean>(
    isBookmarked ? isBookmarked : false
  );

  const handleBookmark = async () => {
    if (!currentUser) {
      setIsAlertVisible(true);
      return;
    }
    try {
      setIsBookMarked(!isBookMarked);
      await toggleBookmark(isBookMarked, ArticleId, currentUser);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      setIsAlertVisible(true);
      return;
    }
    try {
      setHasLiked(!hasLiked);
      await toggleLike(hasLiked, ArticleId, currentUser);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <VStack
      alignItems="flex-start"
      width={["90%", "90%", "90%", "60%"]}
      maxWidth="100vw"
      minHeight="90vh"
      mr={["0", "0", "0", "5%"]}
      overflowX="hidden"
    >
      <ShowAlert
        type="warning"
        message="Please login first"
        title=""
        isVisible={isAlertVisible}
        onClose={() => setIsAlertVisible(false)}
      />
      <CircularProgress
        position="fixed"
        bottom="5vh"
        left={["0", "0", "1vw", "2vw"]}
        value={Math.floor(articleProgress)}
        color="teal.600"
        display={["none", "none", "block", "block"]}
      >
        <CircularProgressLabel>
          {Math.floor(articleProgress)}
        </CircularProgressLabel>
      </CircularProgress>

      <Heading
        color={useColorModeValue("gray.700", "gray.100")}
        size={["md", "md", "md", "lg"]}
        mb="3vh"
      >
        {Title}
      </Heading>

      <AuthorCard
        Author={Author}
        Category={Category}
        ReadTime={ReadingTime}
      ></AuthorCard>

      <Divider bg="gray.400" borderColor="gray.600" mt="2.5vh" mb="1vh" />

      <HStack spacing={5} paddingLeft={5} paddingRight={5} width="100%">
        <Icon
          as={hasLiked ? solidThumbsUp : regularThumbsup}
          size="lg"
          cursor="pointer"
          onClick={handleLike}
        />
        <Spacer />
        <Icon
          as={isBookMarked ? solidBookMark : regularBookmark}
          onClick={handleBookmark}
          size="lg"
          cursor="pointer"
        />
      </HStack>

      <Divider bg="gray.400" borderColor="gray.600" mt="1vh" mb="2.5vh" />
      <Text
        fontSize={["sm", "sm", "15px", "15px"]}
        wordBreak="break-word"
        lineHeight="2"
        textAlign="start"
      >
        {Content}
      </Text>

      <Divider bg="gray.400" borderColor="gray.600" mt="2.5vh" mb="1vh" />

      <HStack spacing={5} paddingLeft={5} paddingRight={5} width="100%">
        <Icon
          as={hasLiked ? solidThumbsUp : regularThumbsup}
          size="lg"
          cursor="pointer"
          onClick={handleLike}
        />
        <Spacer />
        <Icon
          as={isBookMarked ? solidBookMark : regularBookmark}
          onClick={handleBookmark}
          size="lg"
          cursor="pointer"
        />
      </HStack>

      <Divider bg="gray.400" borderColor="gray.600" mt="1vh" mb="2.5vh" />
    </VStack>
  );
};

export default Article;
