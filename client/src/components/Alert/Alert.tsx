import React from 'react';
import { useEffect, useRef } from 'react';
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
  const elementRef = useRef<HTMLDivElement>(null);
  const { isOpen: isVisible, onClose, onOpen } = useDisclosure({ defaultIsOpen: true });

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      const width = element.offsetWidth;
      const leftMargin = `calc(calc(100vw - ${width}px) / 2)`;
      element.style.left = leftMargin;
    }
  }, []);

  return (
    <>
      {isVisible && (
        <Alert status={type} borderRadius="10px" 
        position="fixed" top="calc(2vh + 80px)" width="-moz-fit-content" ref={elementRef}>
          <AlertIcon />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
          <CloseButton
            alignSelf='flex-start'
            position='relative'
            onClick={onClose}
          />
        </Alert>
      )}
    </>
  );
};


export default ShowAlert;
