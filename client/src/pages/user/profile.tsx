import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '@/Providers/AuthProvider';
import { Box, Flex, Heading } from '@chakra-ui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Loading from '@/components/loading/Loading';

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
      display: true,
      text: 'Activity',
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      title: {
        display: true,
        text: 'Categories',
      },
      ticks: {
        autoSkip: false,
        maxRotation: 90,
        minRotation: 0,
      },
    },
    y: {
      grid: {
        display: false,
      },
      title: {
        display: true,
        text: 'Time',
      },
    },
  },
};

const Profile = () => {

  const colours = ["#faf0e6", "#e6f0fa", "#c7ded9", "#a4c7bf", "	#46637b"];
  const getRandomColour = () => {
    const randomIndex = Math.floor(Math.random() * colours.length);
    return colours[randomIndex];
  };
  const [labels, setLabels] = useState<string[]>([]);
  const [labelData, setLabelData] = useState<number[]>([]);
  const [barColors, setBarColors] = useState<string[]>([]);

  const data = {
    labels,
    datasets: [
      {
        data: labelData,
        backgroundColor: barColors,
      }
    ],
  };

  const currentUser = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  let stringArray: string[] = [];
  let dataArray: number[] = [];

  const fetchData = async () => {
    const resp = await fetch(`https://nikhilranjan.pythonanywhere.com/getCategoryData?email=${currentUser?.email}`);
    const data = await resp.json();
    for (const categoryData of data) {
      stringArray.push(categoryData['category_name']);
      dataArray.push(categoryData['duration']);
    }
    setIsLoading(false);
    setLabels(stringArray);
    setLabelData(dataArray);
    setBarColors(Array.from({ length: dataArray.length }, () => getRandomColour()));
  };
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Activity</title>
      </Head>
      {isLoading && (
        <Flex
          position='relative'
          alignItems="center"
          justifyContent='center'
          height='60vh'
          width="100vw"
        >
          <Loading />
        </Flex>
      )}
      <Flex bg='gray.50' height='100vh' flexDirection='column'
        width={['100vw', '100vw', '100vw', `calc(100vw - 12px)`]} alignItems='center' justifyContent='space-around' padding='5vh 5vw' maxHeight='90vh'>
        <Heading>YOUR ACTIVITY</Heading>
        <Bar options={options} data={data} style={{
          maxHeight: '80vh'
        }} />
      </Flex>
    </>
  );
};

export default Profile;
