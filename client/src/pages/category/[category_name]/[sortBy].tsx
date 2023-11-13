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
  useColorModeValue
} from '@chakra-ui/react';
import ArticleCard from '@/components/Home/ArticleCard';
import Sidebar from '@/components/Home/SideBar';
import Loading from '@/components/loading/Loading'
import InfiniteScroll from 'react-infinite-scroll-component';
import Head from 'next/head';
import { auth } from '@/firebase/clientApp';

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
  isBookmarked: boolean;
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

  const fetchData = async (pageNumber:number) => {
    try {
      const email = auth.currentUser?.email;
      let endpoint = '';
      if (sortBy === 'best')
        endpoint = `https://nikhilranjan.pythonanywhere.com/getTopArticlesfor?email=${email}&category=${category}&page=${pageNumber}`;
      else if (sortBy === 'recent')
        endpoint = `https://nikhilranjan.pythonanywhere.com/getRecentArticlesfor?email=${email}&category=${category}&page=${pageNumber}`;
      else
        endpoint = `https://nikhilranjan.pythonanywhere.com/getHotArticlesfor?email=${email}&category=${category}&page=${pageNumber}`;

      const response = await fetch(endpoint);
      const jsonData = await response.json();
      if (jsonData.length === 0) {
        setHasMoreData(false);
        setIsLoading(false);
        return;
      }
      setData((prevData) => [...prevData,...jsonData]);
      setPage((prevPage) => prevPage + 1);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const resetData=async()=>{
    setData([]);
    setPage(1);
    setHasMoreData(true);
    setIsLoading(true);
    await fetchData(1);
  }

  useEffect(() => {
    const tab = router.asPath.split('/')[3];
    if (tab == 'best') setTabIndex(0);
    else if (tab == 'recent') setTabIndex(1);
    else setTabIndex(2);
    resetData();
  }, [router]);

  return (
    <>
      <Head>
        <title>{category}</title>
      </Head>
      <Flex
        flexDirection={{ lg: "row", base: "column" }}
        paddingTop={['5vh', '5vh', '5vh', '10vh']}
        width={['100vw', '100vw', '100vw', `calc(85vw - 12px)`]}
        justifyContent={{ lg: "space-evenly", base: "column" }}
        alignItems={{ lg: "flex-start", base: "center" }}
        minHeight={`calc(100vh-80px)`}
        bg={useColorModeValue('white','#1f282f')}
        m='auto'
      >
        <Flex
          flexDirection="column"
          justifyContent={['center', 'center', 'center', 'flex-start']}
          width={{ lg: "62.75%", base: `calc(90vw - 12px)` }}
          overflowX="hidden"
          mr='2.25%'
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
              height={['70vh', '70vh', '70vh', '70vh']}
              width={{ lg: "62.75%", base: `calc(90vw - 12px)` }}
            >
              <Loading />
            </Flex>
          )}
          {data.length > 0 && (
            <InfiniteScroll
              dataLength={data.length}
              next={()=>fetchData(page)}
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
                    width={{ lg: "62.75%", base: `calc(90vw - 12px)` }}
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
                  isLiked={articleInfo.isLiked}
                  isBookmarked={articleInfo.isBookmarked}
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