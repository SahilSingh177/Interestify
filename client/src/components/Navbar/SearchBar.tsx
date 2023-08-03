import React, { useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/router';
import { AuthContext } from "@/Providers/AuthProvider";
import { Input, InputGroup, InputLeftElement, Icon } from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'
import SearchModal from '../Modals/SearchModal';

const SearchBar = () => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = () => {
      if (router.query.optionalParam !== router.asPath) {
        setIsModalOpen(false);
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  const currentUser = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  if(!currentUser) return null;
  return (
    <InputGroup height='7vh'  marginRight='5vw' marginLeft='1vw' onClick={openModal}>
      <InputLeftElement pointerEvents='none'  height='7vh'>
        <Icon as={FaSearch} />
      </InputLeftElement>
      <Input height='7vh' borderColor={currentUser ? "gray.300" : "black"} focusBorderColor={currentUser ? "gray.300" : "black"} type='text' placeholder='Search Interestify' onChange={openModal} readOnly />
      <SearchModal isOpen={isModalOpen} onClose={closeModal} />
    </InputGroup>
  )
}

export default SearchBar