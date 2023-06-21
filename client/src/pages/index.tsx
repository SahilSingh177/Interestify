import React, { useEffect, useState } from 'react';
import { Stack, Flex, Divider, Skeleton } from '@chakra-ui/react';
import Banner from '@/components/Navbar/Banner';
import ArticleCard from '@/components/Articles/ArticleCard';
import SideBar from '@/components/Articles/SideBar';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router';

interface Article {
  id: string;
  author: string;
  category: string;
  link: string;
  title: string;
  summary: string;
  time: string;
  likes: number;
  liked: boolean;
}

const Index = () => {
  const Router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<Article[]>([]);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    try {
      // const jsonData = useSWR(`http://127.0.0.1:5000/getTopArticles?page=${page}`,fetcher);
      const response = await fetch(`http://127.0.0.1:5000/getTopArticles?page=${page}`);
      const jsonData = await response.json();
      if (jsonData.length === 0) {
        setHasMoreData(false);
        return;
      }
      setData((prevData) => [...prevData, ...jsonData]);
      setPage((prevPage) => prevPage + 1);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Stack>
        <Banner></Banner>
        <Flex
          flexDirection={{ lg: 'row', base: 'column' }}
          marginTop='10vh'
          width={`calc(100vw - 12px)`}
          justifyContent={{ lg: 'space-evenly', base: 'column' }}
          alignItems={{ lg: 'flex-start', base: 'center' }}
          minHeight={`calc(100vh-80px)`}
        >
          <Flex
            minHeight='full'
            flexDirection='column'
            width={{ lg: '55vw', base: `calc(90vw - 12px)` }}
            overflowX='hidden'
          >
            {
              isLoading && <Stack height="full">
                {[...Array(3)].map((_, index) => (
                  <Skeleton
                    key={index}
                    borderRadius={8}
                    marginBottom={5}
                    endColor="gray.200"
                    startColor="gray.100"
                    width={{ lg: '55vw', base: `calc(90vw - 12px)` }}
                    height="30vh"
                  />
                ))}
              </Stack>
            }
            {data.length > 0 && (
              <InfiniteScroll
                dataLength={data.length}
                next={fetchData}
                hasMore={hasMoreData}
                loader={
                  <Flex flexDirection='column' alignItems='center' justifyContent='center' height='30vh' width="full">
                    <Spinner
                      margin='auto'
                      thickness='4px'
                      speed='0.65s'
                      emptyColor='gray.200'
                      color='blue.500'
                      size='xl'
                    /></Flex>
                }
              >
                {data.map((articleInfo, id) => (
                  <ArticleCard
                    articleId={articleInfo.id}
                    Author={articleInfo.author}
                    Category={articleInfo.category}
                    Title={articleInfo.title}
                    Summary={articleInfo.summary}
                    ReadingTime={articleInfo.time}
                    ArticleLink={articleInfo.link}
                    Likes={articleInfo.likes}
                    key={id}
                  ></ArticleCard>
                ))}
              </InfiniteScroll>
            )}
          </Flex>
          <Divider orientation='vertical' borderColor='black' bg='black' size='5px'></Divider>
          <SideBar></SideBar>
        </Flex>
      </Stack>
    </>
  );
};

export default Index;
