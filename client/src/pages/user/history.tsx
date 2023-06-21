import React, { useEffect, useState, useRef } from "react";
import { Flex, Heading, Skeleton, Stack, VStack } from "@chakra-ui/react";
import HistoryCard from "@/components/User/HistoryCard";
import { auth } from '@/firebase/clientApp';
import { Player } from "@lottiefiles/react-lottie-player";

const History = () => {
  const heightRef = useRef<HTMLHeadingElement>(null);
  interface PreviousArticle {
    id: string;
    author: string;
    category: string;
    link: string;
    title: string;
    date: string;
    rid: string;
  }

  const [data, setData] = useState<PreviousArticle[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const email = auth.currentUser?.email;

  const fetchData = async () => {
    try {
      let response = await fetch(`http://127.0.0.1:5000/history?email=${email}`);
      const bodyData = await response.json();
      const filteredData = bodyData.data;
      console.log(filteredData);
      setData(filteredData);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [data]);

  return (
    <Stack
      width={`calc(100vw - 12px)`}
      minHeight='90vh'
      bg="gray.50"
      alignItems="center"
      margin="auto"
      paddingTop="5vh"
    >
      <Heading marginBottom="5vh" ref={heightRef}>HISTORY</Heading>
      {isLoading &&
        <Stack height="full">
          {[...Array(3)].map((_, index) => (
            <Skeleton
              key={index}
              borderRadius={8}
              marginBottom={5}
              endColor="gray.200"
              startColor="gray.100"
              width="80vw"
              height="18vh"
            />
          ))}
        </Stack>
      }
      {!isLoading && !data &&
        <Flex width={`calc(100vw - 12px)`} height={`calc(80vh - ${heightRef.current?.offsetHeight}px - 8px)`} alignItems='center' justifyContent='center' overflow='hidden'>
          <Player
            autoplay
            loop
            src="/empty.json"
            style={{ height: '100%', width: '100%' }}
          /></Flex>
      }
      {data &&
        data.map((article, id) => (
          <HistoryCard
            key={id}
            articleId={article.id}
            link={article.link}
            Title={article.title}
            Author={article.author}
            Category="Technology"
            date={article.date}
            rid={article.rid}
          />
        ))}
    </Stack>
  );
};

export default History;
