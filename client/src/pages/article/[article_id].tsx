import React, { useState, useEffect } from 'react';
import { Heading, Flex, Stack, VStack } from '@chakra-ui/react';
import Article from '@/components/Articles/Article';
import ArticleRecommendations from '@/components/Articles/ArticleRecommendations';
import { ParsedUrlQuery } from 'querystring';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Loading from '@/components/loading/Loading';

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

interface articleType {
  id: string;
  link: string;
  title: string;
}

const ArticlePage = () => {
  const router = useRouter();
  const articleId = router.query.article_id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
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
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [articleId]);

  if (isLoading) {
    return (
      <Flex
        position='relative'
        alignItems="center"
        justifyContent='center'
        height={['80vh', '80vh', '80vh', '75vh']}
        width={['100vw', '100vw', '100vw', `calc(100vw - 12px)`]}
      >
        <Loading />
      </Flex>
    );
  }

  if (error) {
    return (
      <VStack spacing={10}>
        <Heading size="2xl">INTERNAL SERVER ERROR</Heading>
        <Heading size="xl">We'll be back soon</Heading>
        <iframe width="100%" src="https://giphy.com/embed/ykaNntbZ3hfsWotKmA" />
      </VStack>
    );
  }

  return (
    <>
      <Head>
        <title>Articles</title>
      </Head>
      <Stack direction={["column", 'column', 'column', 'row']} width={['100vw', '100vw', '100vw', `calc(100vw - 12px)`]} maxWidth="100vw" overflowX='hidden'>
        {articleData && (
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
        )}
        <ArticleRecommendations ArticleId={articleData?.ArticleId || ''} />
      </Stack>
    </>
  );
};

export default ArticlePage;
