import React from 'react';
import { VStack, Heading} from '@chakra-ui/react';
import RecommendedCard from './RecommendedCard';
interface articleType {
  id: string,
  link: string,
  title: string,
}

const ArticleRecommendations = ({ similarArticles }: { similarArticles: articleType[] }) => {


  return (
    <VStack width={["90vw", "90vw", "90vw", "30vw"]} margin='auto'>
      <VStack
        width={["90vw", "90vw", "90vw", "30vw"]}
        height='70vh'
        position={['static', 'static', 'static', 'fixed']}
        right='3.7vw'
        top='25vh'
        overflowY="scroll"
        borderRadius={10}
      >
        <Heading margin='5% 0' color='gray.700' >Similar Articles</Heading>
        {similarArticles && similarArticles.map((article, index) => {
          return <RecommendedCard key={index} Title={article?.title} articleId={article?.id}></RecommendedCard>
        })}
      </VStack>
    </VStack>
  );
};

export default ArticleRecommendations;
