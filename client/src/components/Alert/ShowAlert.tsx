import React from "react";
import { useRef } from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useDisclosure,
} from "@chakra-ui/react";

type Props = {
  type: "info" | "warning" | "success" | "error" | "loading";
  title: string;
  message: string;
  isVisible: boolean;
  onClose: any;
};

const ShowAlert = ({ type, title, message, isVisible, onClose }: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {isVisible && (
        <Alert
          status={type}
          borderRadius="10px"
          position="fixed"
          top="12vh"
          left='40vw'
          width="-moz-fit-content"
          ref={elementRef}
        >
          <AlertIcon />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
          <CloseButton
            alignSelf="flex-start"
            position="relative"
            onClick={onClose}
          />
        </Alert>
      )}
    </>
  );
};

export default ShowAlert;
