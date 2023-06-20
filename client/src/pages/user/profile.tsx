import React from 'react';
import { Flex, VStack, HStack } from '@chakra-ui/react';
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
  return (
    <Flex>
      <OptionsMenu></OptionsMenu>
      <HStack height={'calc(90vh - 80px'} overflow="hidden" justifyContent='space-between' alignItems='center'>
        <VStack width="35vw" height={`calc(90vh - 12px)`} paddingBottom={0}>
          <UserCard />
          <Bar width="full" options={options} data={data} />
        </VStack>
        <EditCategories />
      </HStack>
    </Flex>
  );
};

export default Profile;
