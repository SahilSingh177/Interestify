import React, { useEffect, useState } from 'react';
import { VStack, Heading, Stack, Skeleton } from '@chakra-ui/react';
import RecommendedCard from './RecommendedCard';
import { useRouter } from 'next/router';

interface articleType {
  id: string,
  link: string,
  title: string,
}

const ArticleRecommendations = ({ ArticleId }: { ArticleId: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<articleType[]>([]);
  const router = useRouter();

  const getSimilarBlogs = async () => {
    try {
      const response = await fetch(`http://nikhilranjan.pythonanywhere.com/getSimilarArticles?article_id=${ArticleId}`);
      const bodyData = await response.json();
      setIsLoading(false);
      setData(bodyData);
    }
    catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getSimilarBlogs();
  }, [router.asPath]); 


  return (
    <VStack width={["90vw","90vw","90vw","30vw"]} margin='auto'>
      <VStack
        width={["90vw","90vw","90vw","30vw"]}
        height='70vh'
        position={['static','static','static','fixed']}
        right='3.7vw'
        top='25vh'
        overflowY="scroll"
        borderRadius={10}
      >
        <Heading margin='5% 0' color='gray.700' >Similar Articles</Heading>
        {isLoading && (
          <Stack height="full">
            {[...Array(4)].map((_, index) => (
              <Skeleton
                key={index}
                borderRadius={8}
                marginBottom={1}
                endColor="gray.200"
                startColor="gray.100"
                width='28vw'
                height='15vh'
              />
            ))}
          </Stack>
        )}
        {data && data.map((article, index) => {
          return <RecommendedCard key={index} Title={article?.title} articleId={article?.id}></RecommendedCard>
        })}
      </VStack>
    </VStack>
  );
};

export default ArticleRecommendations;
