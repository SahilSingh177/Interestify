import React from 'react'
import { Divider, Flex, VStack, HStack, Text } from '@chakra-ui/react'
import {
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList,
} from '@chakra-ui/react'
import { PhoneIcon, PlusSquareIcon, ViewIcon } from '@chakra-ui/icons'

type Props = {
    category: string,
    addCategory : any
}

const CustomListItem = ({category, addCategory}: Props) => {
    return (
        <ListItem bg="#FFFAF0" color="black" width="100%" height="22.5%" borderRadius="10px" >
            <Flex width="100%" flexDirection="row">
                <PhoneIcon height="80%" width="25%" padding="5%" color='green.500' />
                <VStack width="70%" height="100%" paddingRight="5%">
                    <Flex direction="row" width="100%" height="60px" alignItems="center" 
                    paddingLeft="2%"
                    justifyContent="space-between">
                        <Text fontSize="2xl">{category}</Text>
                        <PlusSquareIcon boxSize="25px" cursor="pointer" onClick={() => addCategory(category)}/>
                    </Flex>
                    <Divider
                        orientation="horizontal"
                        size="5px"
                        bg="black"
                        borderColor="black"
                        zIndex="200"
                    />
                    <HStack justifyContent="flex-start" width="100%"paddingLeft="2%">
                        <ViewIcon boxSize="20px" color="gray.600" _hover={{ color: "gray.700" }} />
                        <Text>69</Text>
                    </HStack>
                </VStack>
            </Flex>

        </ListItem>
    )
}

export default CustomListItem