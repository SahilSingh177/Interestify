import React, { useState } from 'react';
import { Card, CardBody, CardFooter, Text, Icon, Flex } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import Image from 'next/image';

type Props = {
  categoryName: string;
  onClickHandler: any;
  view: boolean;
  imageLink: string;
};

const CategoryCard = ({ categoryName, onClickHandler, view, imageLink }: Props) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const onClick = () => {
    onClickHandler(categoryName);
    setIsSelected(!isSelected);
  };

  return view ? (
    <Card
      bg={isSelected ? 'gray.200' : 'white'}
      w={{ lg: '20vw', md: '25vw', sm: '40vw', base: '40vw' }}
      marginBottom={7}
      cursor='pointer'
      onClick={() => onClick()}
      position='relative'
      borderRadius={10}
      style={{ WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)' }}
    >
      {isSelected && <Icon as={FaCheckCircle} width='10%' height='10%' position='absolute' right='0' />}
      <CardBody padding={0} margin={0} >
        <Image width='100' height='80' layout="responsive" alt='categ' src={imageLink} objectFit='cover' />
      </CardBody>
      <CardFooter margin={0} paddingTop='5%' paddingBottom='5%'>
        <Flex justifyContent='center' alignItems='center'>
        <Text color='gray.700' fontWeight='semibold'>
          {categoryName}
        </Text>
        </Flex>
      </CardFooter>
    </Card>
  ) : null;
};

export default CategoryCard;
