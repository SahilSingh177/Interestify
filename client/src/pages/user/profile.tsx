import React from 'react';
import { Flex, VStack } from '@chakra-ui/react';
import 'chart.js/auto';
import CategoryChart from '@/components/UserComponent/CategoryChart';
import UserProfile from '@/components/UserComponent/UserProfile';

type Props = {};

const Profile = () => {
    return (
        <UserProfile></UserProfile>
    )
};

export default Profile;