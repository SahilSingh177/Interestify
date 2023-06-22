import React, { useState } from 'react'
import { Flex, Icon, Input, InputGroup, InputLeftElement, VStack } from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'
import SearchCategoriesModal from '@/components/Modals/SearchCategoriesModal';


const search_category = () => {
    const [searchInput, setSearchInput] = useState<string>("");
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    }

    return (
        <Flex
            flexDirection='column'
            alignItems='center'
            bgImage='/assets/search_bg.jpg'
            bgSize="cover"
            bgPosition="center"
            bgRepeat="no-repeat"
            height='90vh'
            width='100vw'
        >
            <VStack minHeight='8vh' justifyContent='center' width='70%' bg='white' marginTop='10vh' borderRadius={15} padding={0}>
                <Flex height='8vh' width='100%' justifyContent='center' alignItems='center'>
                    <InputGroup height='7vh' size='lg' bg='white' width='65vw' maxHeight='-moz-min-content'>
                        <InputLeftElement
                            color='teal.400'
                            pointerEvents="none"
                        >
                            <Flex alignItems='center' justifyContent='center' height="7vh">
                                <Icon as={FaSearch} color='teal.400' />
                            </Flex>
                        </InputLeftElement>
                        <Input
                            height='7vh'
                            borderColor="white"
                            _hover={{ borderColor: "white" }}
                            focusBorderColor="white"
                            type="tel"
                            placeholder="Search Categories"
                            onChange={handleChange}
                        />
                    </InputGroup>
                </Flex>
                <SearchCategoriesModal inputText={searchInput}></SearchCategoriesModal>
            </VStack>
        </Flex>
    )
}

export default search_category