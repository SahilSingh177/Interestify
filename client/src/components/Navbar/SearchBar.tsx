import React from 'react'
import { Input, InputGroup, InputLeftElement, Icon } from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'
import { authState } from '@/atoms/userAtom'
import { useRecoilValue } from 'recoil'

type Props = {}

const SearchBar = (props: Props) => {
    const isLoggedIn = useRecoilValue(authState);
    return (
        <InputGroup margin="auto 5vw">
            <InputLeftElement pointerEvents='none'>
                <Icon as={FaSearch} />
            </InputLeftElement>
            <Input borderColor={isLoggedIn?"gray.300":"black"} focusBorderColor={isLoggedIn?"gray.700":"black"} type='tel' placeholder='Search Interestify' />
        </InputGroup>
    )
}

export default SearchBar