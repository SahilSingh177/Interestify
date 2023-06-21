import React, { useState, useEffect, useRef } from 'react';
import { Stack, Heading, Skeleton, Flex } from '@chakra-ui/react';
import BookmarkCard from '@/components/User/BookmarkCard';
import { auth } from '@/firebase/clientApp';
import { Player } from '@lottiefiles/react-lottie-player';

const Bookmarks = () => {
  const heightRef = useRef<HTMLHeadingElement>(null);
  interface BookmarkedArticle {
    author: string;
    id: string;
    link: string;
    title: string;
  }

  const [data, setData] = useState<BookmarkedArticle[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    const email = auth.currentUser?.email;
    try {
      let response = await fetch(`http://127.0.0.1:5000/getBookMarks?email=${email}`);
      const bodyData = await response.json();
      const filteredData = bodyData.data;
      setData(filteredData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [auth.currentUser]);

  return (
    <Stack width="calc(100vw - 12px)" minHeight='90vh' bg="gray.50" alignItems="center" margin="auto" paddingTop="5vh"  >
      <Heading ref={heightRef} marginBottom="5vh">BOOKMARKS</Heading>
      {isLoading &&
        <Stack height="full">
          {[...Array(3)].map((_, index) => (
            <Skeleton
              key={index}
              borderRadius={8}
              marginBottom={5}
              endColor="gray.200"
              startColor="gray.100"
              width="80vw"
              height="18vh"
            />
          ))}
        </Stack>
      }
      {!isLoading && data?.length===0 &&
        <Flex width={`calc(100vw - 12px)`} height={`calc(80vh - ${heightRef.current?.offsetHeight}px - 8px)`} flexGrow={1} alignItems='center' justifyContent='center' overflow='hidden'>
          <Player
            autoplay
            loop
            src="/empty.json"
            style={{ height: '100%', width: '100%' }}
          /></Flex>
      }
      {data &&
        data.map((article, id) => (
          <BookmarkCard key={id} article_id={article.id} link={article.link} title={article.title} author={article.author} />
        ))}
    </Stack>
  );
};

export default Bookmarks;
