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
      enabled: false
    },
    legend: {
      display: false
    },
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      title: {
        display: true,
        text: 'Categories',
      },
    },
    y: {
      grid: {
        display: false
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
  let stringArray: string[] = [];
  let dataArray: number[] = [];

  const fetchData = async () => {
    const resp = await fetch(`http://127.0.0.1:5000/getCategoryData?email=${currentUser?.email}`);
    const data = await resp.json();
    for (const categoryData of data) {
      stringArray.push(categoryData['category_name']);
      dataArray.push(categoryData['duration']);
    }
    setLabels(stringArray);
    setLabelData(dataArray);
    setBarColors(Array.from({ length: dataArray.length }, () => getRandomColour()));
  };

  useEffect(() => {
    fetchData();
  }, [currentUser?.email]);

  return (
    <Flex bg='gray.50' height='100vh' flexDirection='column' width={`(100vw - 12px)`} alignItems='center' justifyContent='space-around' padding='5vh 5vw' maxHeight='90vh'>
      <Heading>YOUR ACTIVITY</Heading>
      <Bar  options={options} data={data}  style={{
      maxHeight: '80vh' 
    }} />
    </Flex>
  );
};

export default Profile;
