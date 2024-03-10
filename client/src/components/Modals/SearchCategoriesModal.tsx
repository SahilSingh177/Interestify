import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  Text,
  Modal,
  ModalContent,
  ModalOverlay,
  Icon,
  HStack,
  VStack,
  Spacer,
  Divider,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { FaBook, FaExternalLinkAlt } from "react-icons/fa";
import { categoriesData } from "@/Handlers/CategoriesData";
import SearchResult from "./categorySearchResult";
import { Player } from "@lottiefiles/react-lottie-player";

type CustomError = Error & {
  name: string;
};

const SearchCategoriesModal = ({ inputText }: { inputText: string }) => {
  const abortController = useRef(new AbortController());
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
    if (inputText.length < 2) {
      setSearchResults(categoriesData);
    } else {
      getSearchResults();
    }

    return () => {
      setSearchResults([]);
    };
  }, [inputText]);

  const getSearchResults = async () => {
    abortController.current.abort();
    const newAbortController = new AbortController();
    abortController.current = newAbortController;
    if (inputText.length < 2) {
      setSearchResults(categoriesData);
      return;
    }

    try {
      setIsSearching(true);
      const resp = await fetch(
        "https://nikhilranjan.pythonanywhere.com/searchCategory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: newAbortController.signal,
          body: JSON.stringify({
            text: inputText,
          }),
        }
      );

      const data = await resp.json();
      setSearchResults(data);
    } catch (error) {
      const customError = error as CustomError;
      if (customError.name === "AbortError") {
        return;
      }
      console.error("Error fetching search results:", error);
    }
    setIsSearching(false);
  };

  return (
    <>
      <VStack height="62vh" width="100%" overflowY="auto" paddingBottom={5}>
        <Divider marginBottom={5} marginTop={0}></Divider>
        {isSearching && (
          <Flex alignItems="center" justifyContent="center" overflow="hidden">
            <Player
              autoplay
              loop
              src="/searching.json"
              style={{ height: "45vh" }}
            />
          </Flex>
        )}
        {!isSearching &&
          searchResults.length > 0 &&
          categoriesData.map((categoryName, index) => (
            <SearchResult
              key={index}
              searchResults={searchResults}
              categoryName={categoryName}
            />
          ))}
        {!isSearching && searchResults.length === 0 && (
          <VStack alignItems="center" height="62vh">
            <Heading height="8vh"> No Categories found</Heading>
            <Player
              autoplay
              loop
              src="/no_category_found.json"
              style={{ height: "45vh" }}
            />
          </VStack>
        )}
      </VStack>
    </>
  );
};

export default SearchCategoriesModal;
