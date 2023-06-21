import React from 'react'
import { VStack, Flex, Tag, TagLabel,TagCloseButton, Button, Heading } from '@chakra-ui/react'
import { categoriesData } from '@/Handlers/CategoriesData';
import { getRandomColour } from '@/Handlers/getRandomColour';

const EditCategories = () => {
  return (
    <VStack width={['100vw','100vw','75vw',`calc(40vw - 20px)`]} paddingLeft="5vw" paddingRight="5vw" 
    justifyContent="space-around">
        <Heading size='2xl' color='gray.700' paddingTop='2vh' paddingBottom='5vh'>Top Categories</Heading>
    <Flex flexWrap="wrap" justifyContent='center'>
        {categoriesData.slice(0,10).map((category, id) => {
            return (
                <Tag
                    margin={2}
                    size={['md','md','lg',"lg"]}
                    key={id}
                    borderRadius="full"
                    variant="solid"
                    colorScheme={getRandomColour()}
                >
                    <TagLabel>{category}</TagLabel>
                </Tag>
            );
        })}
    </Flex>
    <Button variant="solid" marginTop={10} size={['md','lg','lg','lg']} padding="20px 10px">Edit Categories</Button>
</VStack>
  )
}

export default EditCategories