import React, { useState, useRef } from "react";
import {
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import SearchCategoriesModal from "@/components/Modals/SearchCategoriesModal";
import Head from "next/head";
import ShowAlert from "@/components/Alert/ShowAlert";

const search_category = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  return (
    <>
      <Head>
        <title>Interestify - Categories</title>
      </Head>
      <Flex
        flexDirection="column"
        alignItems="center"
        bgImage="/assets/category_bg_2.jpg"
        // bgColor='gray.600'
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        height="90vh"
      >
        <VStack
          justifyContent="center"
          width={["95%", "90%", "90%", "70%"]}
          bg="white"
          marginTop="10vh"
          borderRadius={15}
          marginBottom="5vh"
          overflow="auto"
        >
          <Flex
            height="8vh"
            width="100%"
            justifyContent="center"
            alignItems="flex-end"
            paddingLeft={5}
          >
            <InputGroup
              height="7vh"
              size="lg"
              bg="white"
              width="100%"
              marginBottom={0}
              justifyContent="center"
              alignItems="center"
            >
              <InputLeftElement
                height="7vh"
                color="teal.400"
                pointerEvents="none"
                justifyContent="center"
                alignItems="center"
              >
                <Flex alignItems="center" justifyContent="center" height="7vh">
                  <Icon as={FaSearch} color="teal.400" />
                </Flex>
              </InputLeftElement>
              <Input
                marginBottom={0}
                height="7vh"
                borderWidth={0}
                borderColor="white"
                _hover={{ borderColor: "white" }}
                focusBorderColor="white"
                type="text"
                placeholder="Search Categories"
                onChange={handleChange}
              />
            </InputGroup>
          </Flex>
          <SearchCategoriesModal
            inputText={searchInput}
          ></SearchCategoriesModal>
        </VStack>
      </Flex>
    </>
  );
};

export default search_category;
