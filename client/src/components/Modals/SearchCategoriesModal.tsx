import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Text, Modal, ModalContent, ModalOverlay, Icon, HStack, VStack, Spacer, Divider } from '@chakra-ui/react';
import { FaBook, FaExternalLinkAlt } from 'react-icons/fa';
import { categoriesData } from '@/Handlers/CategoriesData';
import SearchResult from './categorySearchResult';

const SearchCategoriesModal = ({ inputText }: { inputText: string }) => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (inputText.length < 2) {
      setIsOpen(false);
    } else {
      console.log(inputText);
      getSearchResults();
      setIsOpen(true);
    }

    return () => {
      setSearchResults([]);
    };
  }, [inputText]);

  const getSearchResults = async () => {
    if (inputText.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const resp = await fetch('http://127.0.0.1:5000/searchCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
        }),
      });

      const data = await resp.json();
      console.log(data);
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <>
      {searchResults.length > 0 && (
        <VStack width='100%' overflowY='scroll' paddingBottom={5}>
            <Divider marginBottom={5}></Divider>
          {categoriesData.map((categoryName, index) => (
            <SearchResult key={index} searchResults={searchResults} categoryName={categoryName} />
          ))}
        </VStack>
      )}
    </>
  );
};

export default SearchCategoriesModal;
