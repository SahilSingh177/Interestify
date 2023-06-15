import React from 'react'
import { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard'
import SideBar from './SideBar'
import { Flex, Divider } from '@chakra-ui/react'
import axios from 'axios';

const Blogs: React.FC = () => {
    interface Article {
        author: string;
        category: string;
        link: string;
      }
      
      const [data, setData] = useState<Article[] | undefined>(undefined);
      
      useEffect(() => {
        const fetchData = async () => {
          try {
            let response = await axios.get('http://127.0.0.1:5000/getTopArticles');
            console.log(response.data);
            const bodyData = response.data;
            setData(bodyData);
          } catch (error) {
            console.error(error);
          }
        };
      
        fetchData();
      }, []);
      
    return <>
        <Flex flexDirection={{lg:"row",md:"column"}} marginTop="10vh" width={`calc(100vw - 12px)`} justifyContent="space-evenly">
            <Flex flexDirection="column" justifyContent={{lg:"flex-start",md:"center"}} width={{lg:"55vw",md:`calc(80vw - 12px)`}} overflowX="hidden">
                {
                    data && data.map((articleInfo,id)=>
                        <ArticleCard Author={articleInfo.author} Category={articleInfo.category} key={id}></ArticleCard>
                    )
                }
            </Flex>
            <Divider orientation='vertical' borderColor='black' bg="black" size="5px"></Divider>
            <SideBar></SideBar>
        </Flex>
    </>
}

export default Blogs