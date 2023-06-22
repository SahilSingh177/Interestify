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
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { Player } from "@lottiefiles/react-lottie-player";
import BookmarkCard from "@/components/User/BookmarkCard";
import { auth } from "@/firebase/clientApp";
import { AuthContext } from "@/Providers/AuthProvider";
import { useRouter } from "next/router";

const Bookmarks = () => {
  const currentUser = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('http://localhost:3000/login');
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
        `http://127.0.0.1:5000/getBookMarks?email=${email}`
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
        const resp = await fetch("http://127.0.0.1:5000/searchBookmark", {
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
    <Stack
      width="calc(100vw - 12px)"
      minHeight="90vh"
      bg="gray.50"
      alignItems="center"
      margin="auto"
      paddingTop="5vh"
    >
      <Heading ref={heightRef} marginBottom="5vh">
        BOOKMARKS
      </Heading>
      <InputGroup width="70%" marginBottom={2}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FaSearch} />
        </InputLeftElement>
        <Input
          value={inputText}
          onChange={getSearchResults}
          borderColor="gray.700"
          _hover={{ borderColor: "gray.700" }}
          focusBorderColor="gray.700"
          type="tel"
          placeholder="Search Bookmarks"
        />
      </InputGroup>
      {isLoading && (
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
      )}
      {!isLoading && data?.length === 0 && (
        <Flex
          width={`calc(100vw - 12px)`}
          height={`calc(80vh - ${heightRef.current?.offsetHeight}px - 8px)`}
          flexGrow={1}
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
        >
          <Player
            autoplay
            loop
            src="/empty.json"
            style={{ height: "100%", width: "100%" }}
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
  );
};

export default Bookmarks;
