import React, {useContext} from 'react'
import { AuthContext } from "@/Providers/AuthProvider";
import { Input, InputGroup, InputLeftElement, Icon } from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'

const SearchBar = () => {
    const currentUser = useContext(AuthContext);
    return (
        <InputGroup margin="auto 5vw">
            <InputLeftElement pointerEvents='none'>
                <Icon as={FaSearch} />
            </InputLeftElement>
            <Input borderColor={currentUser?"gray.300":"black"} focusBorderColor={currentUser?"gray.700":"black"} type='tel' placeholder='Search Interestify' />
        </InputGroup>
    )
}

export default SearchBar