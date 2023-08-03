import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  VStack,
} from "@chakra-ui/react";
import HistoryCard from "@/components/User/HistoryCard";
import { auth } from "@/firebase/clientApp";
import { Player } from "@lottiefiles/react-lottie-player";
import { AuthContext } from "@/Providers/AuthProvider";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";
import Head from "next/head";
import Loading from "@/components/loading/Loading";
import InfiniteScroll from "react-infinite-scroll-component";

type CustomError = Error & {
  name: string;
};

const History = () => {
  const abortController = useRef(new AbortController());
  const currentUser = useContext(AuthContext);
  const router = useRouter();

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

  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);

  // Data state
  const [data, setData] = useState<PreviousArticle[]>([]);
  const [initialData, setInitialData] = useState<PreviousArticle[]>([]);

  // Search state
  const [inputText, setInputText] = useState<string>("");
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const email = auth.currentUser?.email;

  const fetchData = async () => {
    try {
      let response = await fetch(
        `https://nikhilranjan.pythonanywhere.com/history?email=${email}&page=${page}`
      );
      const bodyData = await response.json();
      const filteredData = bodyData.data;
      if (filteredData.length === 0) {
        setHasMoreData(false);
        return;
      }
      setData((oldData) => [...oldData, ...filteredData]);
      setInitialData((oldInitialData) => [...oldInitialData, ...filteredData]);
      setPage(page + 1);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSearchResults = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const searchText = event.target.value;
    setInputText(searchText);
    setData([]);

    abortController.current.abort();
    const newAbortController = new AbortController();
    abortController.current = newAbortController;

    if (searchText.length < 2) {
      setData(initialData);
      setIsSearching(false);
      setSearchMode(false);
    } else {
      setIsSearching(true);
      setSearchMode(true);

      try {
        const resp = await fetch("https://nikhilranjan.pythonanywhere.com/searchHistory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: newAbortController.signal,
          body: JSON.stringify({
            text: searchText,
            email: currentUser?.email,
          }),
        });

        const searchResults = await resp.json();
        setData(searchResults.data);
      } catch (error) {
        const customError = error as CustomError;
        if (customError.name === "AbortError") return;
        console.log(error);
      }

      setIsSearching(false);
    }
  };

  useEffect(() => {
    return () => {
      abortController.current.abort();
    };
  }, []);

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  return (
    <>
      <Head>
        <title>History</title>
      </Head>
      <Stack
        width={["100vw", "100vw", "100vw", `calc(100vw - 12px)`]}
        minHeight="90vh"
        bg="gray.50"
        alignItems="center"
        margin="auto"
        paddingTop="5vh"
      >
        <Heading marginBottom="5vh" ref={heightRef}>
          HISTORY
        </Heading>
        <InputGroup width={["80%", "80%", "70%", "70%"]} marginBottom={5}>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} />
          </InputLeftElement>
          <Input
            value={inputText}
            onChange={getSearchResults}
            borderColor="gray.700"
            _hover={{ borderColor: "gray.700" }}
            focusBorderColor="gray.700"
            placeholder="Search History"
          />
        </InputGroup>
        {/* LOADING STATE */}
        {isLoading && !isSearching && (
          <Flex
            position="relative"
            alignItems="center"
            justifyContent="center"
            height="60vh"
            width={["100vw", "100vw", "100vw", `calc(100vw - 12px)`]}
          >
            <Loading />
          </Flex>
        )}
        {/* SEARCHING STATE */}
        {isSearching && (
          <Flex
            position="relative"
            alignItems="center"
            justifyContent="center"
            height="60vh"
            width={["100vw", "100vw", "100vw", `calc(100vw - 12px)`]}
          >
            <Loading />
          </Flex>
        )}
        {/* EMPTY RESULTS */}
        {!isLoading && (!data || data.length===0) && !searchMode && (
          <Flex
          width={`calc(100vw - 12px)`}
          // height={`calc(80vh - ${heightRef.current?.offsetHeight}px - 8px)`}
          height='60vh'
          flexDirection='column'
          flexGrow={1}
          alignItems="center"
          justifyContent="center"
          // overflow="hidden"
        >
          <Player
            autoplay
            loop
            src="/empty.json"
            style={{ height: "60vh" }}
          />
        </Flex>
        )}
        {/* SEARCH RESULTS */}
        {searchMode && data && !isSearching && (
          <VStack spacing={4} align="stretch">
            {data.map((article, index) => (
              <HistoryCard
                key={index}
                articleId={article.id}
                link={article.link}
                Title={article.title}
                Author={article.author}
                Category={article.category}
                date={article.date}
                rid={article.rid}
              />
            ))}
          </VStack>
        )}
        {/* DATA */}
        {data && data.length>0 && !searchMode && !isSearching && (
          <InfiniteScroll
            dataLength={data.length}
            hasMore={hasMoreData}
            next={fetchData}
            style={{width:`calc(100vw - 12px)`}}
            loader={
              <Flex
                position="relative"
                alignItems="center"
                justifyContent="center"
                height="40vh"
                width={["100vw", "100vw", "100vw", `calc(100vw - 12px)`]}
              >
                <Loading />
              </Flex>
            }
          >
            {data.map((article, id) => (
              <HistoryCard
                key={id}
                articleId={article.id}
                link={article.link}
                Title={article.title}
                Author={article.author}
                Category={article.category}
                date={article.date}
                rid={article.rid}
              />
            ))}
          </InfiniteScroll>
        )}
      </Stack>
    </>
  );
};

export default History;
