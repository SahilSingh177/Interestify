import React, { useEffect, useState, useRef } from 'react';
import { VStack, Heading, Box, Flex, Badge } from '@chakra-ui/react';

const ArticleRecommendations = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isScrolledPastThreshold, setIsScrolledPastThreshold] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentPosition = window.pageYOffset;
            const containerHeight = containerRef.current?.offsetHeight || 0;
            setScrollPosition(currentPosition);
            setIsScrolledPastThreshold(currentPosition > 105 + (containerHeight * 0.05));
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Box ref={containerRef} width="30vw" marginTop={isScrolledPastThreshold ? 0 : `calc(80px + 5vh)`}>
            {!isScrolledPastThreshold && (
                <Flex flexWrap="wrap" paddingTop={5} paddingBottom={5}>
                    <Badge marginLeft={5} marginBottom={5} padding={2} borderRadius={20} fontWeight="light" bg="gray.100">
                        Startup
                    </Badge>
                    <Badge marginLeft={5} marginBottom={5} padding={2} borderRadius={20} fontWeight="light" bg="gray.100">
                        Software Development
                    </Badge>
                    <Badge marginLeft={5} marginBottom={5} padding={2} borderRadius={20} fontWeight="light" bg="gray.100">
                        Software Architecture
                    </Badge>
                    <Badge marginLeft={5} marginBottom={5} padding={2} borderRadius={20} fontWeight="light" bg="gray.100">
                        Software Engineering
                    </Badge>
                    <Badge marginLeft={5} marginBottom={5} padding={2} borderRadius={20} fontWeight="light" bg="gray.100">
                        Software Programming
                    </Badge>
                </Flex>
            )}
            <VStack
                width="30vw"
                height="calc(90vh - 80px)"
                position={isScrolledPastThreshold ? 'fixed' : 'static'}
                right={isScrolledPastThreshold ? '3.7vw' : '0'}
                top={`calc(80px + 5vh)`}
                overflowY="scroll"
                borderRadius={10}
            >
                <Heading margin='5% 0' color='gray.700'>Similar Articles</Heading>
            </VStack>
        </Box>
    );
};

export default ArticleRecommendations;