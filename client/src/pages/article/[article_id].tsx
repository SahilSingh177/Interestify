import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { Heading, Spinner, Stack, VStack } from '@chakra-ui/react'
import Article from '@/components/Blogs/Article'
import ArticleRecommendations from '@/components/Blogs/ArticleRecommendations'

const article = () => {
  const router = useRouter();
  let article_id = router.query.article_id;
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  type Article = {
    Text: string,
    Author: string,
    Category: string | null,
    Title: string,
    Summary: string,
    ReadingTime: string,
    PDFLink: string,
  };

  const [articleData, setArticleData] = useState<Article | undefined>(undefined);

  const getArticleData = async () => {
    try{
        const response = await fetch(`http://127.0.0.1:5000/getArticle?article_id=${article_id}`);
        const data = await response.json();
        const filteredData = data.data[0];
        console.log(filteredData);
    
        const formattedData: Article = {
          Text: filteredData['text'],
          Author: filteredData['author'],
          Category: filteredData['category'],
          Title: filteredData['title'],
          Summary: filteredData['summary'],
          ReadingTime: filteredData['read_time'],
          PDFLink: filteredData['pdf_link']
        };
        setArticleData(formattedData);
    }
    catch (error){
        console.log(error);
    }

    setIsLoading(false);
  }
  
  useEffect(() => {
    if (article_id) {
      getArticleData();
    }
  }, [article_id])

  return (
    <Stack direction={{ md: "row", sm: "column" }} width={`calc(100vw - 12px)`} maxWidth="100vw" overflowX='hidden'>

      {isLoading && <Spinner
        margin='auto'
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        size='xl' />
      }

      {
        !isLoading && !articleData &&
        <VStack spacing={10}>
          <Heading size="2xl">INTERNAL SERVER ERROR</Heading>
          <Heading size="xl">We'll be back soon</Heading>
          <iframe width="100%" src="https://giphy.com/embed/ykaNntbZ3hfsWotKmA" />
        </VStack>
      }

      {
        articleData && 
        <Article Content={articleData.Text} Author={articleData.Author} Category={articleData.Category}
          Title={articleData.Title} ReadingTime={articleData.ReadingTime} Summary={articleData.Summary}
          PDFLink={articleData.PDFLink}
        ></Article>
      }

      <ArticleRecommendations></ArticleRecommendations>
    </Stack>
  )
}

export default article