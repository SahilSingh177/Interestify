import React, { useEffect, useState } from "react";
import { Heading, Skeleton, Stack, VStack } from "@chakra-ui/react";
import HistoryCard from "@/components/User/HistoryCard";
import { auth } from '@/firebase/clientApp';

const History = () => {
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
      minHeight={`calc(100vw - 12px)`}
      bg="gray.50"
      alignItems="center"
      margin="auto"
      paddingTop="5vh"
    >
      <Heading marginBottom="5vh">HISTORY</Heading>
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
