import React from 'react'
import { Flex, Icon, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'

type Props = {}

const search_category = (props: Props) => {
    return (
        <Flex height={`calc(100vh - 80px)`} width={`calc(100vw - 12px)`}>
            <InputGroup width="60vw" margin="5vh 5vw" maxHeight='-moz-min-content'>
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
        </Flex>
    )
}

export default search_category