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

const Category = ({
  category,
  sortBy,
  initialData,
}: {
  category: string;
  sortBy: string;
  initialData: Article[];
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Article[]>(initialData);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handleRouteChange = () => {
      if (router.query.optionalParam !== router.asPath) {
        setData(initialData);
        setPage(1);
        setHasMoreData(true);
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  let endpoint = '';
  if (sortBy === 'best')
    endpoint = `http://127.0.0.1:5000/getTopArticlesfor?category=${category}&page=${page}`;
  else if (sortBy === 'recent')
    endpoint = `http://127.0.0.1:5000/getRecentArticlesfor?category=${category}&page=${page}`;
  else
    endpoint = `http://127.0.0.1:5000/getHotArticlesfor?category=${category}&page=${page}`;

  const fetchData = async () => {
    try {
      const response = await fetch(endpoint);
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

  return (
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
            <Tab
              onClick={() =>
                router.push(`http://localhost:3000/category/${category}/best`)
              }
            >
              Best
            </Tab>
            <Tab
              onClick={() =>
                router.push(`http://localhost:3000/category/${category}/recent`)
              }
            >
              Recent
            </Tab>
            <Tab
              onClick={() =>
                router.push(`http://localhost:3000/category/${category}/hot`)
              }
            >
              Hot
            </Tab>
          </TabList>
        </Tabs>
        {data && data.length > 0 && (
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
  );
};

export async function getServerSideProps({
  query,
}: GetServerSidePropsContext<{ category_name: string; sortBy: string }>) {
  try {
    const { category_name, sortBy } = query;
    let endpoint = '';

    if (sortBy === 'best')
      endpoint = `http://127.0.0.1:5000/getTopArticlesfor?category=${category_name}&page=1`;
    else if (sortBy === 'recent')
      endpoint = `http://127.0.0.1:5000/getRecentArticlesfor?category=${category_name}&page=1`;
    else
      endpoint = `http://127.0.0.1:5000/getHotArticlesfor?category=${category_name}&page=1`;

    const resp = await fetch(endpoint);
    const filteredResp = await resp.json();
    return {
      props: {
        initialData: filteredResp,
        category: category_name,
        sortBy: sortBy,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        data: null,
      },
    };
  }
}

export default Category;
