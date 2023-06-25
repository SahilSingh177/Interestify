import Head from 'next/head';
import React, { useState, useEffect, useContext } from 'react'
import type { ReactElement } from 'react'
import { Stack, InputGroup, InputLeftElement, Input, Icon, Heading } from '@chakra-ui/react'
import AllCategories from '@/components/Category/AllCategories'
import { FaSearch } from 'react-icons/fa'
import { categoriesData } from '@/Handlers/CategoriesData'
import { AuthContext } from '@/Providers/AuthProvider'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from '../_app'
import { auth } from '@/firebase/clientApp'

const categories: NextPageWithLayout = () => {
  const currentUser = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);
  const [data, setData] = useState<string[]>(categoriesData);
  const [inputText, setInputText] = useState<string>('');

  const getSearchResults = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value;
    setInputText(searchText);
    if (searchText.length < 2) {
      setData(categoriesData);
      return;
    } else {
      try {
        const resp = await fetch('https://nikhilranjan.pythonanywhere.com/searchCategory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: searchText,
          }),
        });

        const searchResults = await resp.json();
        setData(searchResults);
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <>
      <Head>
        <title>Interestify - Select Categories</title>
      </Head>
      <Stack width={['100vw', '100vw', '100vw', `calc(100vw - 12px)`]} minHeight='100vh' alignItems="center" bg='gray.50'>
        <Heading marginTop="5vh" textAlign='center'>SELCT YOUR FAVOURITE CATEGORIES</Heading>
        <InputGroup width="60vw" margin="5vh 5vw 0 5vw">
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
            onChange={getSearchResults}
            value={inputText}
            borderRadius={100}
            borderWidth='medium'
            height="7vh"
            borderColor="black"
            _hover={{ borderColor: "black" }}
            focusBorderColor="black"
            type="tel"
            placeholder="Search Categories"
            _placeholder={{ color: 'black', fontWeight: 'bold' }}
          />
        </InputGroup>
        <AllCategories filteredData={data} />
      </Stack>
    </>
  )
}

categories.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      {page}
    </>
  )
}

export default categories;