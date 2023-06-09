import React, { useContext, useState, useEffect } from 'react'
import { Box, Flex, Icon } from '@chakra-ui/react'
import CategoryCard from '@/components/Category/CategoryCard'
import { categoriesData } from '@/Handlers/CategoriesData'
import { useRouter } from 'next/router'
import { FaArrowCircleRight } from 'react-icons/fa'
import { AuthContext } from '@/Providers/AuthProvider'
import { auth } from '@/firebase/clientApp'
import ShowAlert from '../Alert/ShowAlert'
import { imageLinks } from '@/Handlers/CategoriesData'


const AllCategories = ({ filteredData }: { filteredData: string[]}) => {
  const [hasSelected,setHasSelected] =useState<boolean>(false);
  const currentUser = useContext(AuthContext);
  const Router = useRouter();
  const [clickedCategories, setClickedCategories] = useState<string[]>([]);
  const [error,setError]=useState<string>('');

  const handleCategoryClick = (categoryName: string) => {
    setError('');
    setClickedCategories(prevClickedCategories => {
      const isCategorySelected = prevClickedCategories.includes(categoryName);
      if (isCategorySelected) return prevClickedCategories.filter(category => category !== categoryName);
      else return [...prevClickedCategories, categoryName];
    });
  };

  const submitCategories = async () => {
    const email = currentUser?.email;
    if (email && clickedCategories.length >= 1) {
      const payload = {
        email: email,
        updated_preferences: clickedCategories
      };
      await fetch('http://127.0.0.1:5000/updatePreferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });
      Router.push(!hasSelected?'/welcome/register_mail':'/');
    }
    else{
      setError('Please select atleast 1 category to proceed');
    }
  };

  const checkCategories = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/hasSelectedCategories', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "email": currentUser?.email,
        }),
      });
      const data = await response.json();
      setHasSelected(data);
    } catch (error) {
      console.error('Error checking categories:', error);
    }
  };

  useEffect(() => {
    checkCategories();
  }, [])

  return (
    <Box>
      <Flex width={`calc(100vw - 12px)`} flexWrap="wrap" justifyContent="center">
        {categoriesData.map((categoryName, id) => {
          return (
            <CategoryCard key={id} categoryName={categoryName} onClickHandler={handleCategoryClick} view={filteredData.includes(categoryName)} imageLink={imageLinks[id]} />
          );
        })}
      </Flex>
      <Icon onClick={() => submitCategories()} cursor="pointer" boxSize={["10vw","10vw","5vw","5vw"]} as={FaArrowCircleRight} position="fixed" bottom="2vw" right="2vw"></Icon>
      {
        error && <ShowAlert type='warning' title="Sorry" message={error}></ShowAlert>
      }
    </Box>
  )
}

export default AllCategories