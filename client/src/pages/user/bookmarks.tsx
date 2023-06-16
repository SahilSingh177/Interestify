import React from 'react'
import { VStack } from '@chakra-ui/react'
import BookmarkCard from '@/components/UserComponent/BookmarkCard'

type Props = {}

const bookmarks = (props: Props) => {
  return (
    <VStack width="100vw" minHeight="100vh" bg="gray.100" alignItems="center" margin="auto" paddingTop="5vh">
        <BookmarkCard/>
        <BookmarkCard/>
        <BookmarkCard/>
        <BookmarkCard/>
        <BookmarkCard/>
        <BookmarkCard/>
        <BookmarkCard/>
    </VStack>
  )
}

export default bookmarks