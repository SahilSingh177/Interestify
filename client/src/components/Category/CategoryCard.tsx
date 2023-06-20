import React, { useState } from 'react'
import { Card, CardBody, CardFooter, Image, Text, Icon } from '@chakra-ui/react'
import { FaCheckCircle } from 'react-icons/fa'

type Props = {
  categoryName: string,
  onClickHandler: any,
}

const CategoryCard = ({ categoryName, onClickHandler }: Props) => {
  const [isSelected, setIsSelected] = useState<boolean>(false)

  const onClick = () => {
    console.log(isSelected)
    onClickHandler(categoryName);
    setIsSelected(!isSelected);
  }

  return (
    <Card bg={isSelected ? "gray.200" : "white"} w={{ lg: '18vw', md: '25vw', sm: '35vw', base: '50vw' }} margin={5} cursor='pointer' onClick={() => onClick()} position="relative">
      {isSelected && <Icon as={FaCheckCircle} position='absolute' right='0'></Icon>}
      <CardBody>
        <Image width='full' borderRadius='lg' src='/assets/healthcare.png' objectFit="cover"></Image>
      </CardBody>
      <CardFooter>
        <Text color="gray.700" fontWeight="semibold">{categoryName}</Text>
      </CardFooter>
    </Card>
  )
}

export default CategoryCard