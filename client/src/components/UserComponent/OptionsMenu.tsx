import React from 'react';
import { auth } from '@/firebase/clientApp';
import { VStack, Icon, Card, CardBody, Image, Stack, HStack, Heading, CardFooter, Button, Text } from '@chakra-ui/react';
import {FaUser, FaClock, FaBookmark} from "react-icons/fa";
import Link from 'next/link';
import 'chart.js/auto';

const OptionsMenu: React.FC = () => {
    let imageURL = auth.currentUser?.photoURL || undefined;
    if (!imageURL) imageURL = '/assets/default_profile_photo.png'
    let displayName = auth.currentUser?.displayName;
    return (
        <VStack minWidth="25vw" marginTop="10vh" paddingLeft="5vw" alignItems="flex-start" justifyContent="flex-start" spacing={10}>
            <HStack alignItems="center" justifyContent="center" spacing={4}>
                <Icon as={FaUser}/>
                <Text fontSize="xl"><Link href='#'>My Dashboard</Link></Text>
            </HStack>
            <HStack alignItems="center" justifyContent="center" spacing={4}>
                <Icon as={FaBookmark}/>
                <Text fontSize="xl"><Link href='http://localhost:3000/user/bookmarks'>Bookmarks</Link></Text>
            </HStack>
            <HStack alignItems="center" justifyContent="center" spacing={4}>
                <Icon as={FaClock}/>
                <Text fontSize="xl"><Link href='#'>History</Link></Text>
            </HStack>
        </VStack>
    );
}

export default OptionsMenu;