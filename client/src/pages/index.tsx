import React from 'react'
import { Stack } from '@chakra-ui/react'
import Banner from '@/components/Navbar/Banner'
import ArticleCard from '../components/Blogs/ArticleCard'
import SideBar from '../components/Blogs/SideBar'
import { Flex, Divider } from '@chakra-ui/react'
import {auth } from '../firebase/clientApp'

interface Article {
  id: string,
  author: string;
  category: string;
  link: string;
  title: string,
  summary: string,
  time: string,
  likes: number,
  liked: boolean,
}


const index = ({ data }: { data: Article[] }) => {
  return (
    <>
      <Stack>
        <Banner></Banner>
        <Flex flexDirection={{ lg: "row", md: "column", sm: "column" }} marginTop="10vh" width={`calc(100vw - 12px)`} justifyContent="space-evenly" minHeight={`calc(100vh-80px)`}>
          <Flex minHeight='full' flexDirection="column" justifyContent={{ lg: "flex-start", md: "center" }} width={{ lg: "55vw", md: `calc(80vw - 12px)` }} overflowX="hidden">

            {data && data.map((articleInfo, id) =>
              <ArticleCard articleId={articleInfo.id} Author={articleInfo.author} Category={articleInfo.category} Title={articleInfo.title} Summary={articleInfo.summary} ReadingTime={articleInfo.time} ArticleLink={articleInfo.link} Likes={articleInfo.likes} key={id}></ArticleCard>)
            }

          </Flex>
          <Divider orientation='vertical' borderColor='black' bg="black" size="5px"></Divider>
          <SideBar></SideBar>
        </Flex>
      </Stack>
    </>
  )
}

export async function getServerSideProps() {
  try {
    const response = await fetch('http://127.0.0.1:5000/getTopArticles');
    const bodyData = await response.json();
      // console.log(bodyData)
    return {
      props: {
        data:bodyData,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        data: null
      },
    };
  }
}

export default index