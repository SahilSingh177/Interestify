import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import {
  Stack,
  Flex,
  Divider,
  Icon,
  Skeleton,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Banner from "@/components/Navbar/Banner";
import ArticleCard from "@/components/Home/ArticleCard";
import SideBar from "@/components/Home/SideBar";
import InfiniteScroll from "react-infinite-scroll-component";
import { auth } from "@/firebase/clientApp";
import { AuthContext } from "@/Providers/AuthProvider";
import Head from "next/head";
import Loading from "@/components/loading/Loading";
import { FaPlus } from "react-icons/fa";

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

  const [selectedIndex, setSelectedIndex] = useState<number>(1);

  useEffect(() => {
    const checkCategories = async () => {
      try {
        const response = await fetch(
          "https://nikhilranjan.pythonanywhere.com/hasSelectedCategories",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: currentUser?.email,
            }),
          }
        );
        const data = await response.json();

        if (!data) {
          router.push("/welcome/categories");
        }
      } catch (error) {
        console.error("Error checking categories:", error);
      }
    };

    checkCategories();
  }, []);

  useEffect(() => {
    fetchData({ reset: true });
  }, [selectedIndex]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<Article[]>([]);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | null>();

  let link: string | undefined;

  const fetchData = async ({ reset }: { reset?: boolean } = {}) => {
    try {
      if (reset) {
        setData([]);
        setIsLoading(true);
        setHasMoreData(true);
        setPage(1);
      }
      const email = auth.currentUser?.email;
      if (selectedIndex === 1) {
        if (!email)
          link = `https://nikhilranjan.pythonanywhere.com/getTopArticles?page=${page}`;
        else
          link = `https://nikhilranjan.pythonanywhere.com/getTopArticles?email=${email}&page=${page}`;
      } else if (selectedIndex === 2) {
        link = `https://nikhilranjan.pythonanywhere.com/getTopArticlesfor?email=${email}&category=Psychology&page=${page}`;
      } else if (selectedIndex === 3) {
        link = `https://nikhilranjan.pythonanywhere.com/getTopArticlesfor?email=${email}&category=Law&page=${page}`;
      }

      if (!link) {
        console.error("Error: Link is undefined");
        return;
      }

      const response = await fetch(link);
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
      <Stack minHeight="90vh" bg={useColorModeValue("white", "#15202B")}>
        <Banner></Banner>
        <Flex
          flexDirection={{ lg: "row", base: "column" }}
          marginTop={["5vh", "5vh", "5vh", "5vh"]}
          width={["90vw", "90vw", "90vw", `calc(85vw - 12px)`]}
          justifyContent={{ lg: "space-evenly", base: "column" }}
          alignItems={{ lg: "flex-start", base: "center" }}
          minHeight={`calc(100vh-80px)`}
          m="auto"
        >
          <Flex
            minHeight="full"
            flexDirection="column"
            width={["90%", "90%", "90%", "62.75%"]}
            mr="2.25%"
            overflowX="hidden"
          >
            {currentUser && (
              <Tabs
                colorScheme="teal"
                w="95%"
                m="auto"
                mb="3vh"
                index={selectedIndex}
              >
                <TabList display={["none", "none", "flex", "flex"]}>
                  <Tab
                    color="gray.500"
                    _hover={{ color: "black" }}
                    borderRadius="50%"
                  >
                    <Icon
                      as={FaPlus}
                      onClick={() => router.push("/search_category")}
                    />
                  </Tab>
                  <Tab onClick={() => setSelectedIndex(1)}>For You</Tab>
                  <Tab onClick={() => setSelectedIndex(2)}>Psychology</Tab>
                  <Tab onClick={() => setSelectedIndex(3)}>Law</Tab>
                </TabList>
              </Tabs>
            )}
            {isLoading && (
              <Flex
                position="relative"
                alignItems="center"
                justifyContent="center"
                height={["80vh", "80vh", "80vh", "75vh"]}
                width={{ lg: "100%", base: `calc(90vw - 12px)` }}
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
                      position="relative"
                      alignItems="center"
                      justifyContent="center"
                      width={{ lg: "100%", base: `calc(70 - 12px)` }}
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
                    Category={
                      selectedIndex == 1
                        ? articleInfo.category
                        : selectedIndex == 2
                        ? "none"
                        : "none"
                    }
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
          <SideBar></SideBar>
        </Flex>
      </Stack>
    </>
  );
};

export default Index;
