import { HStack, Icon, Text, Spacer } from '@chakra-ui/react';
import React from 'react';
import { FaBook, FaExternalLinkAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';

type Props = {
    categoryName: string;
    searchResults: string[];
};

const SearchResult = ({ searchResults, categoryName }: Props) => {
    const Router = useRouter();
    return (
        <>
            {
                searchResults.includes(categoryName) &&
                <HStack
                    width='90%'
                    overflowY='hidden'
                    cursor='pointer'
                    fontWeight='medium'
                    _hover={{ bg: 'teal.400', color: 'white' }}
                    borderRadius='md'
                    bg='gray.100'
                    padding={5}
                    onClick={()=>Router.push(`http://localhost:3000/category/${categoryName}/best`)}
                >
                    <Icon as={FaBook} marginRight={2} />
                    <Text>{categoryName}</Text>
                    <Spacer />
                    <Icon as={FaExternalLinkAlt} />
                </HStack>
            }
        </>
    );
};

export default SearchResult;
