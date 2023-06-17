import React, { useState,useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import CategoryCard from '@/components/Category/CategoryCard'
import { categoriesData } from '@/Handlers/CategoriesData'

type Props = {}

const AllCategories = (props: Props) => {
    const [clickedCategories, setClickedCategories] = useState<string[]>([])

    const handleCategoryClick = (categoryName: string) => {
        setClickedCategories(prevClickedCategories => {
          const isCategorySelected = prevClickedCategories.includes(categoryName);
          if (isCategorySelected)  return prevClickedCategories.filter(category => category !== categoryName);
          else  return [...prevClickedCategories, categoryName];
        });
      };

    useEffect(() => {
      console.log(clickedCategories)
    }, [clickedCategories])
    
    return (
        <Flex width={`calc(100vw - 12px)`} flexWrap="wrap" height="100vh" justifyContent="center">
            {categoriesData.map((categoryName, id) => <CategoryCard categoryName={categoryName} 
            onClickHandler={handleCategoryClick}></CategoryCard>)}
        </Flex>
    )
}

export default AllCategories