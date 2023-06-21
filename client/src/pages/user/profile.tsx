import React from 'react';
import { Flex, VStack, HStack, useMediaQuery, Stack, Box } from '@chakra-ui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

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
    title: {
      display: false
    },
  },
  scales: {
    x: {
      grid: {
        display: false
      },
    },
    y: {
      grid: {
        display: false
      },
    },
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
  ],
};

import OptionsMenu from '@/components/User/OptionsMenu';
import EditCategories from '@/components/User/EditCategories';
import UserCard from '@/components/User/UserCard';

const Profile = () => {
  const [isLargerThanMd] = useMediaQuery("(min-width: 48em)");
  return (
    <Flex>
      {isLargerThanMd && <OptionsMenu></OptionsMenu>}
      <Stack direction={['column', 'column', 'column', 'row']} minHeight='90vh' overflow="hidden" justifyContent='space-around' alignItems='center'>
        <VStack width={["100vw", "100vw", "75vw", "35vw"]} height='full' paddingTop='5vh' justifyContent={['space-around']}>
          <UserCard />
          <Flex flexGrow={1} padding={['10%','10%','0','0']} alignItems='center' justifyContent='center' height='-moz-max-content' width='100%'>
          <Bar width="full" options={options} data={data} />
          </Flex>
        </VStack>
        <EditCategories />
      </Stack>
    </Flex>
  );
};


export default Profile;
