import React from 'react'
import { Flex, Heading, Divider, Tabs, TabList, Tab } from '@chakra-ui/react'
import ArticleCard from '../../components/Blogs/ArticleCard'
import Sidebar from '../../components/Blogs/SideBar'
import { GetServerSidePropsContext } from 'next'

type Props = {
  category: string
}

interface Article {
  id: string,
  author: string;
  category: string;
  link: string;
  title: string,
  summary: string,
  time: string,
  likes: number,
  isLiked: boolean,
}

const Category = ({ category, data }: Props & { data: Article[] }) => {
  return (
    <Flex flexDirection={{ lg: "row", md: "column", sm: "column" }} marginTop="10vh" width={`calc(100vw - 12px)`} justifyContent="space-evenly">
      <Flex flexDirection="column" justifyContent={{ lg: "flex-start", md: "center" }} width={{ lg: "55vw", md: `calc(80vw - 12px)` }} overflowX="hidden">
        <Heading size="2xl" paddingLeft={2} marginBottom={10}>{category}</Heading>
        <Tabs colorScheme='green'>
          <TabList>
            <Tab>Recent</Tab>
            <Tab>Best</Tab>
            <Tab>Hot</Tab>
          </TabList>
        </Tabs>
        {data && data.map((articleInfo, id) =>
          <ArticleCard articleId={articleInfo.id} Author={articleInfo.author} Category={category} Title={articleInfo.title} Summary={articleInfo.summary} ReadingTime={articleInfo.time} ArticleLink={articleInfo.link} Likes={articleInfo.likes}
            key={id}></ArticleCard>)
        }
      </Flex>
      <Divider orientation='vertical' borderColor='black' bg="black" size="5px"></Divider>
      <Sidebar></Sidebar>
    </Flex>
  )
}

export async function getServerSideProps({ query }: GetServerSidePropsContext<{ category: string }>) {
  try {
    const startTime = new Date().getTime();
    const resp = await fetch(`http://127.0.0.1:5000/getTopArticlesfor?category=${query?.category_name}`);
    const filteredResp = await resp.json();
    const endTime = new Date().getTime(); // Record end time
    const executionTime = endTime - startTime; // Calculate execution time
    console.log('getServerSideProps execution time:', executionTime, 'ms');
    return {
      props: {
        data: filteredResp,
        category:query?.category_name,
      }
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        data: null
      }
    };
  }
}


export default Category
