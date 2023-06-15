import React from 'react';
import { Flex, VStack } from '@chakra-ui/react';
import 'chart.js/auto';
import CategoryChart from '@/components/UserComponent/CategoryChart';
import UserProfile from '@/components/UserComponent/UserProfile';
import Settings from '@/components/UserComponent/Settings';

type Props = {};

const Profile = () => {
    return (
        <Flex bg="gray.100" width="100vw" height={`calc(100vh - 80px)`} padding="0 8%" justifyContent="space-between" alignItems="center">
            <VStack maxHeight="80vh" bg="white" borderRadius={10}>
                <UserProfile />
                <Settings />
            </VStack>
            <CategoryChart />
        </Flex>
    )
};

export default Profile;