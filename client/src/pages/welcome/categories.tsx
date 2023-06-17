import React from 'react'
import { useRouter } from 'next/router'
import { Stack, InputGroup, InputLeftElement, Input, Icon, Heading } from '@chakra-ui/react'
import CategoryCard from '@/components/Category/CategoryCard'
import { categoriesData } from '@/Handlers/CategoriesData'
import AllCategories from '@/components/Category/AllCategories'
import { FaArrowCircleRight, FaSearch } from 'react-icons/fa'

type Props = {}

const categories = (props: Props) => {
    const Router = useRouter();
    console.log(categoriesData.length)
    return (
        <Stack alignItems="center" justifyContent="center">
            <Heading marginTop="5vh">SELECT YOUR FAVOURITE CATEFORIES</Heading>
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
            <Icon onClick={() => Router.push('/')} boxSize="5vw" as={FaArrowCircleRight} position="fixed" bottom="2vw" right="2vw"></Icon>
        </Stack>
    )
}

export default categories