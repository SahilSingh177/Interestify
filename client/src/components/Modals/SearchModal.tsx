import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  Text,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  InputGroup,
  InputLeftElement,
  Icon,
  Input,
  Flex,
  HStack,
  VStack,
  Spacer,
  Divider,
  useColorModeValue
} from "@chakra-ui/react";
import { FaBook, FaExternalLinkAlt, FaSearch } from "react-icons/fa";

type CustomError = Error & {
  name: string;
};

const SearchModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const abortController = useRef(new AbortController());
  const Router = useRouter();
  const [inputText, setInputText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      setSearchResults([]);
    };
  }, []);

  const GetSearchResults = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    abortController.current.abort();
    const newAbortController = new AbortController();
    abortController.current = newAbortController;
    setInputText(event.target.value);
    if (inputText.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const resp = await fetch("https://nikhilranjan.pythonanywhere.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: newAbortController.signal,
        body: JSON.stringify({
          text: inputText,
        }),
      });
      const data = await resp.json();
      setSearchResults(data);
    } catch (error) {
      const customError = error as CustomError;
      if (customError.name === "AbortError") {
        return;
      }
    }
  };

  return (
    <>
      <Modal size={["xs", "xs", "xl", "2xl"]} isOpen={isOpen} onClose={onClose} >
        <ModalOverlay />
        <ModalContent>
          <ModalBody bg={useColorModeValue('white','#15202B')}>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none">
                <Flex alignItems="center" justifyContent="center" height="8vh">
                  <Icon as={FaSearch} color="teal.400" />
                </Flex>
              </InputLeftElement>
              <Input
                textOverflow='ellipsis'
                onChange={GetSearchResults}
                borderColor={useColorModeValue('white','#15202B')}
                focusBorderColor={useColorModeValue('white','#15202B')}
                type="text"
                placeholder="Search Interestify"
              />
            </InputGroup>
          </ModalBody>
          {
            searchResults.length > 0 && (
              <VStack
                width="full"
                maxHeight="65vh"
                overflowY="scroll"
                paddingBottom="5vh"
                bg={useColorModeValue('white','#15202B')}
              >
                <Divider height={0} marginBottom={5}></Divider>
                {searchResults.map((searchResult, id) => {
                  return (
                    <HStack
                      fontSize={['sm','sm','sm','sm']}
                      width="90%"
                      cursor="pointer"
                      fontWeight="medium"
                      _hover={{ bg: "teal.400", color: "white"}}
                      borderRadius="md"
                      key={id}
                      bg={useColorModeValue('gray.100','#192734')}
                      padding={5}
                      onClick={() => Router.push(`/article/${searchResult[1]}`)}
                    >
                      <Icon as={FaBook} marginRight={2}></Icon>
                      <Text>{searchResult[0]}</Text>
                      <Spacer />
                      <Icon as={FaExternalLinkAlt}></Icon>
                    </HStack>
                  );
                })}
              </VStack>
            )
          }
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchModal;
