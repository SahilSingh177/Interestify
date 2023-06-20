import React, { useState, useEffect } from 'react';
import { Stack, Heading, Skeleton } from '@chakra-ui/react';
import BookmarkCard from '@/components/User/BookmarkCard';
import { auth } from '@/firebase/clientApp';

const Bookmarks = () => {
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
    <Stack width="calc(100vw - 12px)" minHeight={`calc(100vh - 80px)`} bg="gray.50" alignItems="center" margin="auto" paddingTop="5vh">
      <Heading marginBottom="5vh">BOOKMARKS</Heading>
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
      {data &&
        data.map((article, id) => (
          <BookmarkCard key={id} article_id={article.id} link={article.link} title={article.title} author={article.author} />
        ))}
    </Stack>
  );
};

export default Bookmarks;
