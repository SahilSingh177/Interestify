import React from 'react'
import { VStack, Flex, Tag, TagLabel,TagCloseButton, Button } from '@chakra-ui/react'
import { categoriesData } from '@/Handlers/CategoriesData';
import { getRandomColour } from '@/Handlers/getRandomColour';

const EditCategories = () => {
  return (
    <VStack width={`calc(40vw - 20px)`} paddingLeft="5vw" paddingRight="5vw" justifyContent="space-around">
    <Flex flexWrap="wrap">
        {categoriesData.slice(0,10).map((category, id) => {
            return (
                <Tag
                    margin={2}
                    size="lg"
                    key={id}
                    borderRadius="full"
                    variant="solid"
                    colorScheme={getRandomColour()}
                >
                    <TagLabel>{category}</TagLabel>
                    <TagCloseButton />
                </Tag>
            );
        })}
    </Flex>
    <Button variant="solid" marginTop={10} width="15vw" padding="20px 10px" fontSize="xl">Edit Categories</Button>
</VStack>
  )
}

export default EditCategories