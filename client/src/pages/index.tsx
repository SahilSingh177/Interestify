import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { Stack, Flex, Divider, Skeleton, useColorModeValue } from "@chakra-ui/react";
import Banner from "@/components/Navbar/Banner";
import ArticleCard from "@/components/Articles/ArticleCard";
import SideBar from "@/components/Articles/SideBar";
import InfiniteScroll from "react-infinite-scroll-component";
import { auth } from "@/firebase/clientApp";
import { AuthContext } from "@/Providers/AuthProvider";
import Head from "next/head";
import Loading from "@/components/loading/Loading";

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

const Index = () => {
  const router = useRouter();
  const currentUser = useContext(AuthContext);

  useEffect(() => {
    const checkCategories = async () => {
      try {
        const response = await fetch('https://nikhilranjan.pythonanywhere.com/hasSelectedCategories', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "email": currentUser?.email,
          }),
        });
        const data = await response.json();

        if (!data) {
          router.push('/welcome/categories');
        }
      } catch (error) {
        console.error('Error checking categories:', error);
      }
    };

    checkCategories();
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<Article[]>([]);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    try {
      const email = auth.currentUser?.email;
      let response;
      if (!email) {
        response = await fetch(
          `https://nikhilranjan.pythonanywhere.com/getTopArticles?page=${page}`
        );
      } else {
        response = await fetch(
          `https://nikhilranjan.pythonanywhere.com/getTopArticles?email=${email}&page=${page}`
        );
      }
      const jsonData = await response.json();
      console.log(jsonData);
      if (jsonData.length === 0) {
        setHasMoreData(false);
        setIsLoading(false);
        return;
      }
      setData((prevData) => [...prevData, ...jsonData]);
      setPage((prevPage) => prevPage + 1);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser?.email]);

  return (
    <>
      <Head>
        <title>Interestify</title>
      </Head>
      <Stack minHeight='90vh' bg={useColorModeValue('white','#15202B')}>
        <Banner></Banner>
        <Flex
          flexDirection={{ lg: "row", base: "column" }}
          marginTop={['5vh', '5vh', '5vh', '10vh']}
          width={['100vw', '100vw', '100vw', `calc(100vw - 12px)`]}
          justifyContent={{ lg: "space-evenly", base: "column" }}
          alignItems={{ lg: "flex-start", base: "center" }}
          minHeight={`calc(100vh-80px)`}
        >
          <Flex
            minHeight="full"
            flexDirection="column"
            width={{ lg: "55vw", base: `calc(90vw - 12px)` }}
            overflowX="hidden"
          >
            {isLoading && (
              <Flex
                position='relative'
                alignItems="center"
                justifyContent='center'
                height={['80vh', '80vh', '80vh', '75vh']}
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
                    Category={articleInfo.category}
                    Title={articleInfo.title}
                    Summary={articleInfo.summary}
                    ReadingTime={articleInfo.time}
                    ArticleLink={articleInfo.link}
                    Likes={articleInfo.likes}
                    isLiked = {articleInfo.isLiked}
                    isBookmarked = {articleInfo.isBookmarked}
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
          <SideBar></SideBar>
        </Flex>
      </Stack>
    </>
  );
};

export default Index;