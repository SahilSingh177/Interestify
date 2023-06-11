import React from 'react'
import Article from './Article'
import SideBar from './SideBar'
import {Flex, Divider} from '@chakra-ui/react'

const Blogs:React.FC = ()=>{
    return <>
    <Flex flexDirection="row" paddingLeft="7.5vw" paddingRight="7.5vw" marginTop="10vh">
        <Article></Article>
        <Divider orientation='vertical' colorScheme='black' size="5px"></Divider>
        <SideBar></SideBar>
    </Flex>
    </>
}

export default Blogs