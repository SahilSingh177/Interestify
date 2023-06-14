import React from 'react'
import { Stack } from '@chakra-ui/react'
import Article from '@/components/Blogs/Article'
import ArticleRecommendations from '@/components/Blogs/ArticleRecommendations'

const article = () => {
  return (
    <Stack direction={{md:"row", sm:"column"}} width="100vw" maxWidth="100vw">
      <Article></Article>
      <ArticleRecommendations></ArticleRecommendations>
    </Stack>
  )
}

export default article