import React, { useState, useEffect } from 'react';
import { Heading, Spinner, Stack, VStack } from '@chakra-ui/react';
import Article from '@/components/Articles/Article';
import ArticleRecommendations from '@/components/Articles/ArticleRecommendations';
import { ParsedUrlQuery } from 'querystring';
import { GetServerSidePropsContext } from 'next';
import Router from 'next/router';
import Head from 'next/head';

interface ArticleData {
  Text: string;
  Author: string;
  Category: string | null;
  Title: string;
  Summary: string;
  ReadingTime: string;
  PDFLink: string;
  ArticleLink: string;
  ArticleId: string;
}

interface Params extends ParsedUrlQuery {
  article_id: string;
}

const ArticlePage = () => {
  const [articleData, setArticleData] = useState<ArticleData>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const articleId = Router.query.article_id as string;
        const response = await fetch(`http://127.0.0.1:5000/getArticle?article_id=${articleId}`);
        const data = await response.json();
        const filteredData = data.data[0];

        const formattedData: ArticleData = {
          Text: filteredData['text'],
          Author: filteredData['author'],
          Category: filteredData['category'],
          Title: filteredData['title'],
          Summary: filteredData['summary'],
          ReadingTime: filteredData['read_time'],
          PDFLink: filteredData['pdf_link'],
          ArticleLink: filteredData['link'],
          ArticleId: filteredData['id'],
        };

        setArticleData(formattedData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // if (isLoading) {
  //   return (
  //     <>
  //       <Head>
  //         <title>Articles</title>
  //       </Head>
  //       <Spinner
  //         margin='auto'
  //         thickness='4px'
  //         speed='0.65s'
  //         emptyColor='gray.200'
  //         color='blue.500'
  //         size='xl'
  //       />
  //     </>
  //   );
  // }

  // if (!articleData) {
  //   return (
  //     <>
  //       <Head>
  //         <title>Articles</title>
  //       </Head>
  //       <VStack spacing={10}>
  //         <Heading size="2xl">INTERNAL SERVER ERROR</Heading>
  //         <Heading size="xl">We'll be back soon</Heading>
  //         <iframe width="100%" src="https://giphy.com/embed/ykaNntbZ3hfsWotKmA" />
  //       </VStack>
  //     </>
  //   );
  // }

  return (
    <>
      <Head>
        <title>Articles</title>
      </Head>
      {articleData && <Stack direction={["column", 'column', 'column', 'row']} width="calc(100vw - 12px)" maxWidth="100vw" overflowX='hidden'>
        <Article
          ArticleId={articleData.ArticleId}
          Content={articleData.Text}
          Author={articleData.Author}
          Category={articleData.Category || 'Unknown'}
          Title={articleData.Title}
          ReadingTime={articleData.ReadingTime}
          Summary={articleData.Summary}
          PDFLink={articleData.PDFLink}
          ArticleLink={articleData.ArticleLink}
        />
        <ArticleRecommendations ArticleId={articleData.ArticleId} />
      </Stack>
      }
    </>
  );
};

export default ArticlePage;
