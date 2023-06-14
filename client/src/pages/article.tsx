import React from 'react'
import { Stack } from '@chakra-ui/react'
import Article from '@/components/Blogs/Article'
import ArticleRecommendations from '@/components/Blogs/ArticleRecommendations'

const article = () => {
  return (
    <Stack direction={{md:"row", sm:"column"}} width={`calc(100vw - 12px)`} maxWidth="100vw" overflowX='hidden'>
      <Article></Article>
      <ArticleRecommendations></ArticleRecommendations>
    </Stack>
  )
}

export default article