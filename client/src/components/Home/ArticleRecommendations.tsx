import React, { useEffect, useState } from "react";
import {
  VStack,
  Heading,
  Stack,
  Skeleton,
  useColorModeValue,
} from "@chakra-ui/react";
import RecommendedCard from "./RecommendedCard";
import { useRouter } from "next/router";
import { requestToBodyStream } from "next/dist/server/body-streams";

interface articleType {
  id: string;
  link: string;
  title: string;
  author:string;
}

const ArticleRecommendations = ({ ArticleId }: { ArticleId: string }) => {
  console.log(ArticleId);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<articleType[]>([]);
  const router = useRouter();

  const getSimilarBlogs = async () => {
    try {
      const response = await fetch(
        `https://nikhilranjan.pythonanywhere.com/getSimilarArticles?article_id=${ArticleId}`
      );
      const bodyData = await response.json();
      console.log(bodyData)
      setIsLoading(false);
      setData(bodyData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getSimilarBlogs();
  }, [router.asPath]);

  return (
    <VStack
      w={['90vw','90vw','90vw','27.8375vw']}
      height="70vh"
      position={["static", "static", "static", "fixed"]}
      right="7.5vw"
      top="20vh"
      overflowY="scroll"
      borderRadius={10}
      m='auto'
    >
      <Heading margin="5% 0" color={useColorModeValue("gray.700", "gray.100")}>
        Similar Articles
      </Heading>
      {isLoading && (
        <Stack height="full">
          {[...Array(4)].map((_, index) => (
            <Skeleton
              key={index}
              borderRadius={8}
              marginBottom={1}
              endColor="gray.200"
              startColor="gray.100"
              width={`calc(26.2vw - 12px)`}
              height="15vh"
            />
          ))}
        </Stack>
      )}
      {data &&
        data.map((article, index) => {
          return (
            <RecommendedCard
              key={index}
              Title={article?.title}
              articleId={article?.id}
              author={article.author}
            ></RecommendedCard>
          );
        })}
    </VStack>
  );
};

export default ArticleRecommendations;
