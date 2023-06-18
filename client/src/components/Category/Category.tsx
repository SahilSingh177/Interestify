import React, { useState, useEffect } from 'react'
import { Flex, VStack, HStack, Heading, Text, Divider, Box, Tabs, TabList, Tab } from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import ArticleCard from '../Blogs/ArticleCard'
import Sidebar from '../Blogs/SideBar'

type Props = {}

const Category = (props: Props) => {
    interface Article {
        id: string,
        author: string;
        category: string;
        link: string;
        title: string,
        summary: string,
        time: string,
        likes: number,
        isLiked: boolean,
    }

    const [data, setData] = useState<Article[] | undefined>(undefined);
    const fetchArticles = async () => {
        const resp = await fetch('http://127.0.0.1:5000/getTopArticlesfor?category=Mathematics');
        const filteredResp = await resp.json();
        setData(filteredResp);
        console.log(filteredResp);
    }

    useEffect(() => {
        fetchArticles();
    }, [])
    return (
        <Flex flexDirection={{ lg: "row", md: "column", sm: "column" }} marginTop="10vh" width={`calc(100vw - 12px)`} justifyContent="space-evenly">
            <Flex flexDirection="column" justifyContent={{ lg: "flex-start", md: "center" }} width={{ lg: "55vw", md: `calc(80vw - 12px)` }} overflowX="hidden">
                <Heading size="2xl" paddingLeft={2} marginBottom={10}>Data Science</Heading>
                <Tabs colorScheme='green'>
                    <TabList>
                        <Tab>Recent</Tab>
                        <Tab>Best</Tab>
                        <Tab>Hot</Tab>
                    </TabList>
                </Tabs>
                {data && data.map((articleInfo, id) =>
                    <ArticleCard articleId={articleInfo.id} Author={articleInfo.author} Category={articleInfo.category} Title={articleInfo.title} Summary={articleInfo.summary} ReadingTime={articleInfo.time} ArticleLink={articleInfo.link} Likes={articleInfo.likes}
                        key={id}></ArticleCard>)
                }
            </Flex>
            <Divider orientation='vertical' borderColor='black' bg="black" size="5px"></Divider>
            <Sidebar></Sidebar>
        </Flex>
    )
}

export default Category