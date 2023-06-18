import React from 'react'
import { useState, useEffect, cache } from 'react';
import ArticleCard from './ArticleCard'
import SideBar from './SideBar'
import { Flex, Divider, Spinner, VStack, Heading } from '@chakra-ui/react'

const Blogs: React.FC = () => {
    interface Article {
        id: string,
        author: string;
        category: string;
        link: string;
        title: string,
        summary: string,
        time: string,
        likes : number,
    }
    const [data, setData] = useState<Article[] | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<Boolean>(true);

    const fetchData = async () => {
        try {
            let response = await fetch('http://127.0.0.1:5000/getTopArticles', 
            { next: { revalidate: 60 } });
            const bodyData = await response.json();
            setData(bodyData);
        } 
        catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    return <>
        <Flex flexDirection={{ lg: "row", md: "column",sm:"column"}} marginTop="10vh" width={`calc(100vw - 12px)`} justifyContent="space-evenly" minHeight={`calc(100vh-80px)`}>
            <Flex minHeight='full' flexDirection="column" justifyContent={{ lg: "flex-start", md: "center" }} width={{ lg: "55vw", md: `calc(80vw - 12px)` }} overflowX="hidden">

                {isLoading && <Spinner
                    margin='auto'
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl' />
                }

                {
                    !isLoading && !data &&
                    <VStack spacing={10}>
                        <Heading size="2xl">INTERNAL SERVER ERROR</Heading>
                        <Heading size="xl">We'll be back soon</Heading>
                        <iframe width="100%" src="https://giphy.com/embed/ykaNntbZ3hfsWotKmA" />
                    </VStack>
                }

                {data && data.map((articleInfo, id) =>
                    <ArticleCard articleId={articleInfo.id} Author={articleInfo.author} Category={articleInfo.category} Title={articleInfo.title} Summary={articleInfo.summary} ReadingTime={articleInfo.time} ArticleLink={articleInfo.link} Likes={articleInfo.likes} key={id}></ArticleCard>)
                }

            </Flex>
            <Divider orientation='vertical' borderColor='black' bg="black" size="5px"></Divider>
            <SideBar></SideBar>
        </Flex>
    </>
}
export const revalidate = false
export default Blogs