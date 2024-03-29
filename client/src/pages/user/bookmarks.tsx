import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Stack,
  Heading,
  Skeleton,
  Flex,
  InputGroup,
  InputLeftElement,
  Icon,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { Player } from "@lottiefiles/react-lottie-player";
import BookmarkCard from "@/components/User/BookmarkCard";
import { auth } from "@/firebase/clientApp";
import { AuthContext } from "@/Providers/AuthProvider";
import { useRouter } from "next/router";
import Head from "next/head";
import Loading from "@/components/loading/Loading";

const Bookmarks = () => {
  const currentUser = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);
  const heightRef = useRef<HTMLHeadingElement>(null);

  interface BookmarkedArticle {
    author: string;
    id: string;
    link: string;
    title: string;
    category: string;
  }

  const [data, setData] = useState<BookmarkedArticle[] | undefined>(undefined);
  const [initialData, setInitialData] = useState<
    BookmarkedArticle[] | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>("");

  const fetchData = async () => {
    const email = auth.currentUser?.email;
    try {
      const response = await fetch(
        `https://nikhilranjan.pythonanywhere.com/getBookMarks?email=${email}`
      );
      const bodyData = await response.json();
      const filteredData = bodyData.data;
      setData(filteredData);
      setInitialData(filteredData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSearchResults = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const searchText = event.target.value;
    setInputText(searchText);
    if (inputText.length < 2) {
      setData(initialData);
    } else {
      try {
        const resp = await fetch("https://nikhilranjan.pythonanywhere.com/searchBookmark", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: searchText,
            email: currentUser?.email,
          }),
        });

        const searchResults = await resp.json();
        const filteredResults = initialData?.filter((item) =>
          searchResults.includes(item.link)
        );
        setData(filteredResults);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Bookmarks</title>
      </Head>
      <Stack
        width={['100vw', '100vw', '100vw', `calc(100vw - 12px)`]}
        minHeight="90vh"
        bg={useColorModeValue('gray.50','#15202B')}
        alignItems="center"
        margin="auto"
        paddingTop="5vh"
      >
        <Heading ref={heightRef} marginBottom="5vh">
          BOOKMARKS
        </Heading>
        <InputGroup width={["80%", "80%", "70%", "70%"]} marginBottom={5}>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} />
          </InputLeftElement>
          <Input
            value={inputText}
            onChange={getSearchResults}
            borderColor={useColorModeValue("gray.700","gray.50")}
            _hover={{ borderColor: useColorModeValue("gray.700","gray.50") }}
            focusBorderColor={useColorModeValue("gray.700","gray.50")}
            placeholder="Search Bookmarks"
          />
        </InputGroup>
        {isLoading && (
            <Flex
              position='relative'
              alignItems="center"
              justifyContent='center'
              height='60vh'
              width="100vw"
            >
              <Loading />
            </Flex>
          )}
        {!isLoading && data?.length === 0 && (
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
        {initialData?.map((article, id) => (
          <BookmarkCard
            key={id}
            article_id={article.id}
            link={article.link}
            title={article.title}
            author={article.author}
            toBeDisplayed={data?.includes(article) || false}
            category={article.category}
          />
        ))}
      </Stack>
    </>
  );
};

export default Bookmarks;
