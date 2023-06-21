import React, { useContext, useState, useEffect } from 'react'
import { Box, Flex, Icon } from '@chakra-ui/react'
import CategoryCard from '@/components/Category/CategoryCard'
import { categoriesData } from '@/Handlers/CategoriesData'
import { useRouter } from 'next/router'
import { FaArrowCircleRight } from 'react-icons/fa'
import { AuthContext } from '@/Providers/AuthProvider'


const AllCategories = ({ filteredData }: { filteredData: string[] }) => {
  const currentUser = useContext(AuthContext);
  const Router = useRouter();
  const [clickedCategories, setClickedCategories] = useState<string[]>([]);

  const handleCategoryClick = (categoryName: string) => {
    setClickedCategories(prevClickedCategories => {
      const isCategorySelected = prevClickedCategories.includes(categoryName);
      if (isCategorySelected) return prevClickedCategories.filter(category => category !== categoryName);
      else return [...prevClickedCategories, categoryName];
    });
  };

  const submitCategories = async () => {
    const email = currentUser?.email;
    console.log(email);
    if (email && clickedCategories.length >= 5 && clickedCategories.length >= 5) {
      Router.push('http://localhost:3000/welcome/register_mail');
      const payload = {
        email: email,
        updated_preferences: clickedCategories
      };
      await fetch('http://127.0.0.1:5000/updatePreferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    }
  };

  useEffect(() => {
  }, [clickedCategories])

  return (
    <Box>
      <Flex width={`calc(100vw - 12px)`} flexWrap="wrap" height="100vh" justifyContent="center">
        {categoriesData.map((categoryName, id) => {
          return (
            <CategoryCard key={id} categoryName={categoryName} onClickHandler={handleCategoryClick} view={filteredData.includes(categoryName)} />
          );
        })}
      </Flex>
      <Icon onClick={() => submitCategories()} cursor="pointer" boxSize="5vw" as={FaArrowCircleRight} position="fixed" bottom="2vw" right="2vw"></Icon>
    </Box>
  )
}

export default AllCategories