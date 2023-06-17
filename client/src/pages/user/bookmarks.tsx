import React from 'react'
import { useState, useEffect} from 'react'
import { Stack, HStack , Heading, Spinner } from '@chakra-ui/react'
import BookmarkCard from '@/components/UserComponent/BookmarkCard'

type Props = {}

const bookmarks = (props: Props) => {
    interface BookmarkedArticles {
        author: string;
        article_id: string,
        link: string;
        title: string,
    }

    const [data, setData] = useState<BookmarkedArticles[] | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<Boolean>(true);

    const fetchData = async () => {
        try {
            let response = await fetch('http://127.0.0.1:5000/getBookMarks?email=test@mail', 
            { next: { revalidate: 60 } });
            const bodyData = await response.json();
            const filteredData = bodyData.data;
            setData(filteredData);
            setIsLoading(false);
        } 
        catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };
    
    useEffect(() => {
        fetchData();
    }, []);

  return (
    <Stack width={`calc(100vw - 12px)`} minHeight="100vh" bg="gray.50" alignItems="center" margin="auto" paddingTop="5vh">
        <Heading marginBottom="5vh"> BOOKMARKS</Heading>
        {isLoading && <Spinner
                    margin='auto'
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl' />
                }
        {data && data.map((article,id)=>
            <BookmarkCard key={id} article_id={article.article_id} link={article.link} title={article.title}
            author={article.author}></BookmarkCard>
        )}
    </Stack>
  )
}

export default bookmarks