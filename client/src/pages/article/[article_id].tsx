import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { Heading, Spinner, Stack, VStack } from '@chakra-ui/react'
import Article from '@/components/Blogs/Article'
import ArticleRecommendations from '@/components/Blogs/ArticleRecommendations'
import { ParsedUrlQuery } from 'querystring';
import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';

interface ArticleData {
  Text: string;
  Author: string;
  Category: string|null;
  Title: string;
  Summary: string;
  ReadingTime: string;
  PDFLink: string;
  ArticleLink: string;
  ArticleId: string;
}

// Define the type for params
interface Params extends ParsedUrlQuery {
  article_id: string;
}

const ArticlePage = ({ articleData }: { articleData: ArticleData }) => {
  const [isLoading, setIsLoading] = useState(false);


  return (
    <Stack direction={{ md: "row", sm: "column" }} width={`calc(100vw - 12px)`} maxWidth="100vw" overflowX='hidden'>

      {isLoading && (
        <Spinner
          margin='auto'
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='blue.500'
          size='xl'
        />
      )}

      {!isLoading && !articleData && (
        <VStack spacing={10}>
          <Heading size="2xl">INTERNAL SERVER ERROR</Heading>
          <Heading size="xl">We'll be back soon</Heading>
          <iframe width="100%" src="https://giphy.com/embed/ykaNntbZ3hfsWotKmA" />
        </VStack>
      )}

      {articleData && (
        <Article
          ArticleId= {articleData.ArticleId}
          Content={articleData.Text}
          Author={articleData.Author}
          Category={articleData.Category || "Unknown"}
          Title={articleData.Title}
          ReadingTime={articleData.ReadingTime}
          Summary={articleData.Summary}
          PDFLink={articleData.PDFLink}
          ArticleLink={articleData.ArticleLink}
        />
      )}

      <ArticleRecommendations />
    </Stack>
  )
}

export async function getServerSideProps({ params }: GetServerSidePropsContext<Params>) {
  try {
    const startTime = new Date().getTime()
    const article_id = params?.article_id;
    const response = await fetch(`http://127.0.0.1:5000/getArticle?article_id=${article_id}`);
    const data = await response.json();
    const endTime = new Date().getTime(); // Record end time
    const executionTime = endTime - startTime; // Calculate execution time
    console.log('getServerSideProps execution time:', executionTime, 'ms');
    const filteredData = data.data[0];

    const formattedData = {
      Text: filteredData['text'],
      Author: filteredData['author'],
      Category: filteredData['category'],
      Title: filteredData['title'],
      Summary: filteredData['summary'],
      ReadingTime: filteredData['read_time'],
      PDFLink: filteredData['pdf_link'],
      ArticleLink: filteredData['link'],
      ArticleId: filteredData['id']
    };
    
    return {
      props: {
        articleData: formattedData
      }
    };
  } 
  catch (error) {
    console.log(error);
    return {
      props: {
        articleData: null
      }
    };
  }
}

export default ArticlePage;
