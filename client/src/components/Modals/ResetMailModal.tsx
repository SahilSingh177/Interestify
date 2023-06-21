import React from 'react'
import { Player } from '@lottiefiles/react-lottie-player';
import { Button, Flex, Heading, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay } from '@chakra-ui/react';

const ResetMailModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {

  return (
    <>
      <Modal size='md' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Heading margin='2% auto' size='xl' textAlign='center'>See You Later :/</Heading>
            <Player
              autoplay
              loop
              src="/unsubscribe.json"
              style={{ height: '60%', width: '60%' }}
            />
          </ModalBody>
          <ModalFooter>
            <Flex justifyContent='center' alignItems='center' width='full'>
              <Button variant='danger' size='lg' width='40%' borderRadius={5}>
                Unsubscribe
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ResetMailModal;
