import React from 'react'
import { Stack, InputGroup, InputLeftElement, Input, Icon, Heading } from '@chakra-ui/react'
import AllCategories from '@/components/Category/AllCategories'

import { FaSearch } from 'react-icons/fa'

const categories = () => {
    
    return (
        <Stack alignItems="center" justifyContent="center">
            <Heading marginTop="5vh">SELECT YOUR FAVOURITE CATEGORIES</Heading>
            <InputGroup width="60vw" margin="5vh 5vw">
                <InputLeftElement
                    pointerEvents="none"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                >
                    <Icon as={FaSearch} />
                </InputLeftElement>
                <Input
                    borderRadius={100}
                    height="7vh"
                    borderColor="black"
                    _hover={{ borderColor: "black" }}
                    focusBorderColor="black"
                    type="tel"
                    placeholder="Search Categories"
                />
            </InputGroup>
            <AllCategories />
        </Stack>
    )
}

export default categories