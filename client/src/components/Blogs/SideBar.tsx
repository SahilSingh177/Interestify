import React from 'react';
import { Flex, Stack, Text, Button, Divider, Link } from '@chakra-ui/react';

type Props = {};

const Sidebar: React.FC<Props> = () => {
    return (
        <>
            <Flex marginLeft="10%" width="30%" >
                <Stack>
                    <Text fontWeight="medium" fontSize="20px" marginBottom="10px">Discover more of what matters to you</Text>
                    <Flex flexWrap="wrap" justifyContent="center">
                        <Button variant="link" size="md" padding="6px 12px" minWidth="auto" margin="0px 6px 12px 0px">Programming</Button>
                        <Button variant="link" size="md" padding="6px 12px" minWidth="auto" margin="0px 6px 12px 0px">Entertainment</Button>
                        <Button variant="link" size="md" padding="6px 12px" minWidth="auto" margin="0px 6px 12px 0px">Entertainment</Button>
                        <Button variant="link" size="md" padding="6px 12px" minWidth="auto" margin="0px 6px 12px 0px">Entertainment</Button>
                        <Button variant="link" size="md" padding="6px 12px" minWidth="auto" margin="0px 6px 12px 0px">Entertainment</Button>
                    </Flex>
                    <Button variant="success" width="60%" margin="auto">See more topics</Button>
                    <Divider margin="10px 0"></Divider>
                    <Flex flexWrap="wrap" justifyContent="center">
                        <Text color="gray.300" fontSize="sm" margin="0px 6px 12px 0px">Help</Text>
                        <Text color="gray.300" fontSize="sm" margin="0px 6px 12px 0px">Contact Us</Text>
                        <Text color="gray.300" fontSize="sm" margin="0px 6px 12px 0px">Privacy Policy</Text>
                        <Text color="gray.300" fontSize="sm" margin="0px 6px 12px 0px">Terms & Conditions</Text>
                    </Flex>
                </Stack>
            </Flex>
        </>
    );
};

export default Sidebar;
