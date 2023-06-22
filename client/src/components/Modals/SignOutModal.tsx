import React from 'react'
import { Player } from '@lottiefiles/react-lottie-player';
import { Button, Flex, Heading, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay } from '@chakra-ui/react';
import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';

const SignOutModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [signOut] = useSignOut(auth);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <Modal size='2xl' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Heading margin='2% auto' size='xl' textAlign='center'>Are you sure you would like to log out?</Heading>
            <Player
              autoplay
              loop
              src="/logout.json"
              style={{ height: '60%', width: '60%' }}
            />
          </ModalBody>
          <ModalFooter>
            <Flex justifyContent='center' alignItems='center' width='full'>
              <Button variant='danger' size='lg' width='40%' borderRadius={5} onClick={handleSignOut}>
                Log Out
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SignOutModal;
