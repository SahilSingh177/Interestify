import React from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useDisclosure
} from '@chakra-ui/react';

type Props = {
  type: "info" | "warning" | "success" | "error" | "loading";
  title: string;
  message: string;
};

const ShowAlert = ({ type, title, message }: Props) => {
  const { isOpen: isVisible, onClose, onOpen } = useDisclosure({ defaultIsOpen: true });

  return (
    <>
      {isVisible && (
        <Alert status={type} borderRadius="10px">
          <AlertIcon />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
          <CloseButton
            alignSelf='flex-start'
            position='relative'
            right={-1}
            top={-1}
            onClick={onClose}
          />
        </Alert>
      )}
    </>
  );
};

//CLOSE Button not working

export default ShowAlert;
