import React, { useState } from 'react';
import { Card, CardBody, CardFooter, Image, Text, Icon } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

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
      w={{ lg: '18vw', md: '25vw', sm: '35vw', base: '50vw' }}
      margin={5}
      cursor='pointer'
      onClick={() => onClick()}
      position='relative'
    >
      {isSelected && <Icon as={FaCheckCircle} position='absolute' right='0' />}
      <CardBody padding={0} margin={0} >
        <Image width='full' borderRadius='lg' maxHeight='80%' src={imageLink} objectFit='cover' />
      </CardBody>
      <CardFooter margin={0} paddingTop={0}>
        <Text color='gray.700' fontWeight='semibold'>
          {categoryName}
        </Text>
      </CardFooter>
    </Card>
  ) : null;
};

export default CategoryCard;
