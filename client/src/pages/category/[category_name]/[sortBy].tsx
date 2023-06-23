import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Flex,
  Heading,
  Divider,
  Tabs,
  TabList,
  Tab,
  Spinner,
} from '@chakra-ui/react';
import ArticleCard from '@/components/Articles/ArticleCard';
import Sidebar from '@/components/Articles/SideBar';
import { GetServerSidePropsContext } from 'next';
import InfiniteScroll from 'react-infinite-scroll-component';
import Head from 'next/head';

interface Article {
  id: string;
  author: string;
  category: string;
  link: string;
  title: string;
  summary: string;
  time: string;
  likes: number;
  isLiked: boolean;
}

const Category = () => {
  const router = useRouter();
  const category = router.query.category_name as string;
  const sortBy = router.query.sortBy as string;
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Article[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    try {
      let endpoint = '';
      if (sortBy === 'best')
        endpoint = `http://127.0.0.1:5000/getTopArticlesfor?category=${category}&page=${page}`;
      else if (sortBy === 'recent')
        endpoint = `http://127.0.0.1:5000/getRecentArticlesfor?category=${category}&page=${page}`;
      else
        endpoint = `http://127.0.0.1:5000/getHotArticlesfor?category=${category}&page=${page}`;

      const response = await fetch(endpoint);
      const jsonData = await response.json();
      console.log(jsonData);
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

  useEffect(() => {
    const handleRouteChange = () => {
      if (router.query.optionalParam !== router.asPath) {
        console.log('route changed');
        setData([]);
        setPage(1);
        setHasMoreData(true);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>{category}</title>
      </Head>
      <Flex
        flexDirection={{ lg: 'row', md: 'column', sm: 'column' }}
        marginTop="10vh"
        width={`calc(100vw - 12px)`}
        justifyContent="space-evenly"
      >
        <Flex
          flexDirection="column"
          justifyContent={{ lg: 'flex-start', md: 'center' }}
          width={{ lg: '55vw', md: `calc(80vw - 12px)` }}
          overflowX="hidden"
        >
          <Heading size="2xl" paddingLeft={2} marginBottom={10}>
            {category}
          </Heading>
          <Tabs colorScheme="green">
            <TabList>
              <Tab onClick={() => router.push(`/category/${category}/best`)}>
                Best
              </Tab>
              <Tab onClick={() => router.push(`/category/${category}/recent`)}>
                Recent
              </Tab>
              <Tab onClick={() => router.push(`/category/${category}/hot`)}>
                Hot
              </Tab>
            </TabList>
          </Tabs>
          {isLoading && (
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="30vh"
              width="full"
            >
              <Spinner
                margin="auto"
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Flex>
          )}
          {data.length > 0 && (
            <InfiniteScroll
              dataLength={data.length}
              next={fetchData}
              hasMore={hasMoreData}
              loader={
                <Flex
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  height="30vh"
                  width="full"
                >
                  <Spinner
                    margin="auto"
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                  />
                </Flex>
              }
            >
              {data.map((articleInfo, id) => (
                <ArticleCard
                  articleId={articleInfo.id}
                  Author={articleInfo.author}
                  Category={category}
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
        <Divider
          orientation="vertical"
          borderColor="black"
          bg="black"
          size="5px"
        ></Divider>
        <Sidebar></Sidebar>
      </Flex>
    </>
  );
};

export default Category;
