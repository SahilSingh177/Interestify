import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Flex,
  Heading,
  Badge,
  Text,
  VStack,
  HStack,
  Divider,
  Spacer,
  CircularProgress,
  CircularProgressLabel
} from '@chakra-ui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComment as regularComment,
  faBookmark as regularBookmark,
  faThumbsUp as regularThumbsup
} from '@fortawesome/free-regular-svg-icons';

import {
  faBookmark as solidBookMark,
  faThumbsUp as solidThumbsUp
} from '@fortawesome/free-solid-svg-icons';

import AuthorCard from '../Author/AuthorCard';
// import { PDFDocumentProxy } from 'pdfjs-dist';


type Props = {
  Author: string,
  Category: string | null,
  Title: string,
  Summary: string,
  ReadingTime: string,
  PDFLink: string,
}

const Article: React.FC<Props> = ({ Author, Category, Title, Summary, ReadingTime, PDFLink }: Props) => {
  console.log("PDF", PDFLink)
  const [articleProgress, setArticleProgress] = useState<number>(0);
  const [articleContent, setArticleContent] = useState<string>("");

// const pdfjsLib = require('pdfjs-dist/webpack');
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

// const extractTextFromPDF = async (): Promise<string> => {
//   // Load the PDF document
//   const loadingTask = pdfjsLib.getDocument(pdfUrl);
//   const pdf: PDFDocumentProxy = await loadingTask.promise;

//   // Extract text from each page
//   const numPages = pdf.numPages;
//   const textContent: string[] = [];

//   for (let pageNum = 1; pageNum <= numPages; pageNum++) {
//     const page = await pdf.getPage(pageNum);
//     const content = await page.getTextContent();
//     const text = content.items.map((item) => item.str).join(' ');
//     textContent.push(text);
//   }

//   // Combine all the extracted text
//   const combinedText = textContent.join(' ');

//   return combinedText;
// };


  useEffect(() => {
    // extractTextFromPDF(PDFLink);
  }, [PDFLink])


  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`Time spent on page: ${duration} milliseconds`);
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;

      setArticleProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const Router = useRouter();
  const [isLiked, setIsLiked] = useState<Boolean>(false); //liked or not should be fetched from backend
  const [isBookMarked, setIsBookMarked] = useState<Boolean>(false);

  const bookmarkArticle = () => {
    setIsBookMarked(!isBookMarked);
    if (isBookMarked) {
      const articleLink = Router.asPath;
      console.log("Bookmarked: ")
      console.log(articleLink);
      //Backend request
    }
  }
  const likeArticle = () => {
    setIsLiked(!isLiked);
    if (isLiked) {
      const articleLink = Router.asPath;
      console.log("Liked: ")
      console.log(articleLink);
      //Backend request
    }
  }

  return (
    <VStack spacing={5} alignItems="flex-start" width="55vw" maxWidth="100vw" minHeight={`calc(100vh - 80px)`}
      marginLeft="5vw" marginRight="5vw" marginTop={`calc(80px + 5vh)`} bg="whiteAlpha.500" overflowX='hidden'>

      <CircularProgress position="fixed" bottom='2vh' left='2vh' value={Math.floor(articleProgress)} color='green.400'>
        <CircularProgressLabel>{Math.floor(articleProgress)}</CircularProgressLabel>
      </CircularProgress>

      <Heading color="gray.700">{Title}</Heading>
      <Heading as='h3' size="md" fontWeight="semibold" color='gray.600'>Transform your life with these ChatGPT’s hidden gems.</Heading>

      <AuthorCard Author={Author} Category={Category} ReadTime={ReadingTime}></AuthorCard>

      <Divider bg="gray.400" borderColor="gray.600" />

      <HStack spacing={5} paddingLeft={5} paddingRight={5} width="100%">
        <FontAwesomeIcon icon={isLiked ? solidThumbsUp : regularThumbsup} size='lg' cursor='pointer' onClick={likeArticle} />
        <FontAwesomeIcon icon={regularComment} size='lg' cursor='pointer' />
        <Spacer />
        <FontAwesomeIcon icon={isBookMarked ? solidBookMark : regularBookmark} size='lg' cursor='pointer' onClick={bookmarkArticle} />
      </HStack>

      <Divider bg="gray.400" borderColor="gray.600" />

      <Text lineHeight={2} padding={5} overflowX='hidden'>

      </Text>


      <Flex flexWrap="wrap" marginTop={5} marginBottom={5}>
        <Badge marginLeft={5} marginBottom={5} padding={2} borderRadius={20} fontWeight="light" bg="gray.100">Startup</Badge>
        <Badge marginLeft={5} marginBottom={5} padding={2} borderRadius={20} fontWeight="light" bg="gray.100">Software Development</Badge>
        <Badge marginLeft={5} marginBottom={5} padding={2} borderRadius={20} fontWeight="light" bg="gray.100">Software Architecture</Badge>
        <Badge marginLeft={5} marginBottom={5} padding={2} borderRadius={20} fontWeight="light" bg="gray.100">Software Enginerring</Badge>
        <Badge marginLeft={5} marginBottom={5} padding={2} borderRadius={20} fontWeight="light" bg="gray.100">Software Programming</Badge>
      </Flex>


      <Divider bg="gray.400" borderColor="gray.600" />
      <HStack spacing={5} paddingLeft={5} paddingRight={5} width="100%">
        <FontAwesomeIcon icon={isLiked ? solidThumbsUp : regularThumbsup} size='lg' cursor='pointer' onClick={likeArticle} />
        <FontAwesomeIcon icon={regularComment} size='lg' cursor='pointer' />
        <Spacer />
        <FontAwesomeIcon icon={isBookMarked ? solidBookMark : regularBookmark} size='lg' cursor='pointer' />
      </HStack>
      <Divider bg="gray.400" borderColor="gray.600" marginBottom={10} />

    </VStack>

  )
}

export default Article