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
import Loading from '@/components/loading/Loading'
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
  const [tabIndex, setTabIndex] = useState<number>(-1);
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
      if (jsonData.length === 0) {
        setHasMoreData(false);
        setIsLoading(false);
        return;
      }
      setData((prevData) => [...prevData, ...jsonData]);
      console.log('setting data');
      console.log(data)
      setPage((prevPage) => prevPage + 1);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const tab = router.asPath.split('/')[3];
    if (tab == 'best') setTabIndex(0);
    else if (tab == 'recent') setTabIndex(1);
    else setTabIndex(2);
    setData([]);
    setPage(1);
    setHasMoreData(true);
    setIsLoading(true);
    fetchData();
  }, [router]);

  return (
    <>
      <Head>
        <title>{category}</title>
      </Head>
      <Flex
        flexDirection={{ lg: "row", base: "column" }}
        marginTop={['5vh', '5vh', '5vh', '10vh']}
        width={['100vw', '100vw', '100vw', `calc(100vw - 12px)`]}
        justifyContent={{ lg: "space-evenly", base: "column" }}
        alignItems={{ lg: "flex-start", base: "center" }}
        minHeight={`calc(100vh-80px)`}
      >
        <Flex
          flexDirection="column"
          justifyContent={['center', 'center', 'center', 'flex-start']}
          width={{ lg: "55vw", base: `calc(90vw - 12px)` }}
          overflowX="hidden"
        >
          <Heading size="2xl" paddingLeft={2} marginBottom={10}>
            {category}
          </Heading>
          <Tabs index={tabIndex} colorScheme="green">
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
              position='relative'
              alignItems="center"
              justifyContent='center'
              height={['70vh', '70vh', '70vh', '60vh']}
              width={{ lg: "55vw", base: `calc(90vw - 12px)` }}
            >
              <Loading />
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
                  <Flex
                    position='relative'
                    alignItems="center"
                    justifyContent='center'
                    height={['70vh', '70vh', '70vh', '60vh']}
                    width={{ lg: "55vw", base: `calc(90vw - 12px)` }}
                  >
                    <Loading />
                  </Flex>
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