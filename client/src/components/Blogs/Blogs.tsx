import React from 'react'
import Article from './Article'
import SideBar from './SideBar'
import { Flex, Divider } from '@chakra-ui/react'

const Blogs: React.FC = () => {
    return <>
        <Flex flexDirection="row" paddingLeft="7.5vw" paddingRight="7.5vw" marginTop="10vh" width="100vw">
            <Flex flexDirection="column" width="70%">
                <Article></Article>
                <Article></Article>
                <Article></Article>
                <Article></Article>
                <Article></Article>
                <Article></Article>
            </Flex>
            <Divider orientation='vertical' colorScheme='black' size="5px"></Divider>
            <SideBar></SideBar>
        </Flex>
    </>
}

export default Blogs