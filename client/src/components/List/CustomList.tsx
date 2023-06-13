import React from 'react'
import { useState } from 'react'
import { List } from '@chakra-ui/react'
import CustomListItem from './CustomListItem'
import { useRouter } from 'next/router'
// import { ShowAlert } from '../Alert/Alert' 


const CustomList = () => {
    const categories = ["sports", "medicines", "hardware", "electronics", "space", "windows"]
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const Router = useRouter();

    const handleItemClick = (item: string) => {
        if (!selectedItems.includes(item)) setSelectedItems([...selectedItems, item]);
        else setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
        console.log(selectedItems)
    };

    const handleItemRegistration = ()=>{
        if(selectedItems.length<5){
            console.log("Failure! Choose atleast 5 categories")
            return;
        }
        console.log("Success! You've successfully registeres your interests")
        Router.push('/');
    }

    return (
        <List spacing={2} marginTop={`calc(80px + 10vh)`} bg="#E5D3B3" overflowY="scroll" scrollBehavior="smooth" maxHeight="70%" padding="2%" css={{ "&::-webkit-scrollbar": { width: "20px", } }}
        // paddingTop="10%"
        >
            {categories.map((category, index) => (
                <CustomListItem key={index} addCategory={handleItemClick} category={category}></CustomListItem>
            ))}
        </List>
    )
}

export default CustomList