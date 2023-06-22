import React, { useEffect, useState, useRef } from 'react';
import { VStack, Heading, Box, Flex, Badge } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import RecommendedCard from './RecommendedCard';

interface articleType {
    id: string,
    link: string,
    title: string,
}

const ArticleRecommendations = ({ ArticleId }: { ArticleId: string }) => {
    console.log(ArticleId)
    const Router = useRouter();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isScrolledPastThreshold, setIsScrolledPastThreshold] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [data, setData] = useState<articleType[]>([]);

    const getSimilarBlogs = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/getSimilarArticles?article_id=${ArticleId}`);
            const bodyData = await response.json();
            console.log(bodyData);
            setData(bodyData);
        }
        catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getSimilarBlogs();
    }, [])


    return (
        <VStack width="30vw">
            <VStack
                width="30vw"
                height='70vh'
                position='fixed'
                right='3.7vw'
                top='25vh'
                overflowY="scroll"
                borderRadius={10}
            >
                <Heading margin='5% 0' color='gray.700' >Similar Articles</Heading>
                {data && data.map((article, index) => {
                    return <RecommendedCard key={index} Title={article?.title} articleId={article?.id}></RecommendedCard>
                })}
            </VStack>
        </VStack>
    );
};

export default ArticleRecommendations;