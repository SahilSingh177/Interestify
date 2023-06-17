import React from 'react';
import { auth } from '@/firebase/clientApp';
import {
    Flex, VStack, HStack, Card, CardBody, Stack, Heading, Text, Image, Divider, CardFooter, TagLabel,
    Tag, TagCloseButton, Button
} from '@chakra-ui/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { categories } from '@/Handlers/CategoriesData';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);


export const options = {
    responsive: true,
    plugins: {
        title: { display: false },
    },
    scales: {
        x: { grid: { display: false } },
        y: { grid: { display: false } },
    },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
    labels,
    datasets: [
        {
            data: [50, 60, 30, 2, 56, 69, 12],
            backgroundColor: "RGBA(0, 0, 0, 0.80)",
        }
    ]
};

import OptionsMenu from './OptionsMenu';
import { getRandomColour } from '@/Handlers/getRandomColour';

const UserProfile: React.FC = () => {
    let imageURL = auth.currentUser?.photoURL || undefined;
    if (!imageURL) imageURL = '/assets/default_profile_photo.png'
    let displayName = auth.currentUser?.displayName;
    let userEmail = auth.currentUser?.email;
    return (
        <Flex>
            <OptionsMenu></OptionsMenu>
            <HStack height={'calc(90vh - 80px'} overflow="hidden" justifyContent='space-between' alignItems='center'>
                <VStack width="35vw" height={`calc(90vh - 12px)`} paddingBottom={0}>
                    <Card borderRadius={50} width="full" height="50%">
                        <CardBody>
                            <Image
                                src={imageURL}
                                alt='Green double couch with wooden legs'
                                borderRadius='lg'
                                height="50%"
                            />
                            <Stack mt='6' spacing='3'>
                                <Heading size='md'>{displayName}</Heading>
                                <Text>
                                    <Text color="gray.600">Signed in as</Text>
                                     {userEmail}
                                </Text>
                            </Stack>
                        </CardBody>
                        <Divider />
                        <CardFooter>
                            <Button variant='solid'>
                                Edit Profile
                            </Button>
                        </CardFooter>
                    </Card>
                    <Bar width="full" options={options} data={data} />
                </VStack>
                <VStack width={`calc(40vw - 20px)`} paddingLeft="5vw" paddingRight="5vw" justifyContent="space-around">
                    <Flex flexWrap="wrap">
                        {categories.map((category, id) => {
                            return (
                                <Tag
                                    margin={2}
                                    size="lg"
                                    key={id}
                                    borderRadius="full"
                                    variant="solid"
                                    colorScheme={getRandomColour()}
                                >
                                    <TagLabel>{category}</TagLabel>
                                    <TagCloseButton />
                                </Tag>
                            );
                        })}
                    </Flex>
                    <Button variant="solid" marginTop={10} width="15vw" padding="20px 10px" fontSize="xl">Edit Categories</Button>
                </VStack>
            </HStack>
        </Flex >
    );
}

export default UserProfile;