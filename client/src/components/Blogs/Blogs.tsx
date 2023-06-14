import React from 'react'
import ArticleCard from './ArticleCard'
import SideBar from './SideBar'
import { Flex, Divider } from '@chakra-ui/react'

const Blogs: React.FC = () => {
    return <>
        <Flex flexDirection="row" paddingLeft="7.5vw" paddingRight="7.5vw" marginTop="10vh" width={`calc(100vw - 12px)`}>
            <Flex flexDirection="column" width={`calc(0.6 * 90vw)`} marginRight={`calc(0.1*90vw)`} overflowX="hidden">
                <ArticleCard></ArticleCard>
                <ArticleCard></ArticleCard>
                <ArticleCard></ArticleCard>
                <ArticleCard></ArticleCard>
                <ArticleCard></ArticleCard>
                <ArticleCard></ArticleCard>
            </Flex>
            <Divider orientation='vertical' borderColor='black' bg="black" size="5px"></Divider>
            <SideBar></SideBar>
        </Flex>
    </>
}

export default Blogs