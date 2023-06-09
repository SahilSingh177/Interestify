import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { Text, Modal, ModalBody, ModalContent,  ModalOverlay, InputGroup, InputLeftElement, Icon, Input, Flex, HStack, VStack, Spacer, Divider } from '@chakra-ui/react'
import { FaBook, FaExternalLinkAlt, FaSearch } from 'react-icons/fa'

const SearchModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const Router = useRouter();
    const [inputText, setInputText] = useState<string>("");
    const [searchResults, setSearchResults] = useState<string[]>([]);

    useEffect(() => {
        return () => {
          setSearchResults([]);
        };
      }, []);

    const GetSearchResults = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
        if(inputText.length<2){
             setSearchResults([]);
             return;
        }
        const resp = await fetch('http://127.0.0.1:5000/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: inputText
            }),
        })
        const data = await resp.json();
        setSearchResults(data);
    }

    return (
        <>
            <Modal size={['xs','xs','xl','2xl']} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody>
                        <InputGroup size='lg'>
                            <InputLeftElement pointerEvents='none'>
                                <Flex alignItems='center' justifyContent='center' height="8vh">
                                    <Icon as={FaSearch} color='teal.400'/>
                                </Flex>
                            </InputLeftElement>
                            <Input onChange={GetSearchResults} borderColor="white" focusBorderColor="white" type='text' placeholder='Search Interestify' />
                        </InputGroup>
                    </ModalBody>
                    {
                        searchResults.length > 0 &&
                        // <ModalFooter>
                            <VStack width='full'  maxHeight='70vh' overflowY='scroll' paddingBottom='5vh'>
                                <Divider marginBottom={5}></Divider>
                                {searchResults.map((searchResult, id) => {
                                    
                                    return <HStack width='90%' cursor='pointer' fontWeight='medium' _hover={{ bg: 'teal.400', color: 'white' }} borderRadius="md" key={id} bg='gray.100' padding={5}>
                                        <Icon as={FaBook} marginRight={2}></Icon>
                                        <Text >{searchResult[0]}</Text>
                                        <Spacer />
                                        <Icon onClick={() => Router.push(`/article/${searchResult[1]}`)} as={FaExternalLinkAlt}></Icon>
                                    </HStack>
                                })}
                            </VStack>
                        // </ModalFooter>
                    }
                </ModalContent>
            </Modal>
        </>
    )
}

export default SearchModal
