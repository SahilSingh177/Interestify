import React, { useEffect, useState, useRef, useContext } from "react";
import { Flex, Heading, Icon, Input, InputGroup, InputLeftElement, Skeleton, Stack, VStack } from "@chakra-ui/react";
import HistoryCard from "@/components/User/HistoryCard";
import { auth } from '@/firebase/clientApp';
import { Player } from "@lottiefiles/react-lottie-player";
import { AuthContext } from "@/Providers/AuthProvider";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";
import Head from "next/head";

const History = () => {
  const currentUser = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('http://localhost:3000/login');
    }
  }, [currentUser, router]);

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
  const [initialData, setInitialData] = useState<PreviousArticle[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>('');
  const email = auth.currentUser?.email;

  const fetchData = async () => {
    try {
      let response = await fetch(`http://127.0.0.1:5000/history?email=${email}`);
      const bodyData = await response.json();
      const filteredData = bodyData.data;
      setData(filteredData);
      setInitialData(filteredData);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSearchResults = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value;
    setInputText(searchText);

    if (inputText.length < 2) {
      setData(initialData);
    } else {
      try {
        const resp = await fetch('http://127.0.0.1:5000/searchHistory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: searchText,
            email: currentUser?.email,
          }),
        });

        const searchResults = await resp.json();
        const filteredResults = initialData?.filter(item => searchResults.includes(item.link));
        setData(filteredResults);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
    <Head>
        <title>History</title>
      </Head>
    <Stack
      width={`calc(100vw - 12px)`}
      minHeight='90vh'
      bg="gray.50"
      alignItems="center"
      margin="auto"
      paddingTop="5vh"
    >
      <Heading marginBottom="5vh" ref={heightRef}>HISTORY</Heading>
      <InputGroup width='70%' marginBottom={5}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FaSearch} />
        </InputLeftElement>
        <Input value={inputText} onChange={getSearchResults} borderColor="gray.700" _hover={{borderColor:'gray.700'}} focusBorderColor="gray.700" type="tel" placeholder="Search History" />
      </InputGroup>
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
      {initialData &&
        initialData.map((article, id) => (
          <HistoryCard
            key={id}
            articleId={article.id}
            link={article.link}
            Title={article.title}
            Author={article.author}
            Category={article.category}
            date={article.date}
            rid={article.rid}
            toBeDisplayed={data?.includes(article)||false}
          />
        ))}
    </Stack>
    </>
  );
};

export default History;
