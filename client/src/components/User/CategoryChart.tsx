import React from 'react';
import { Flex } from '@chakra-ui/react';
import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';

const CategoryChart:React.FC = () => {
    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1,
            },
        ],
    };

    return <Flex bg="white" maxHeight="80vh" height="50%" width="55vw" paddingTop="5vh" paddingBottom="5vh" borderRadius={10} justifyContent="center"> <Pie data={data} redraw/></Flex>;
}

export default CategoryChart