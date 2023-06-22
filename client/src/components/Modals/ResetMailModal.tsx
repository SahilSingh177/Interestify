import React, { useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import { auth } from "@/firebase/clientApp";

const ResetMailModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [subsciptionStatus, setSubsciptionStatus] = React.useState("Subscribe");
  const handleRegistration = async () => {
    try {
      const email = auth.currentUser?.email;
      if (subsciptionStatus === "Subscribe") {
        await fetch("http://127.0.0.1:5000/registerMail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        });
        setSubsciptionStatus("Unsubscribe");
        // Close the modal
        onClose();
      } else {
        await fetch("http://127.0.0.1:5000/unregisterMail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        });
        setSubsciptionStatus("Subscribe");
        // Close the modal
        onClose();
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const email = auth.currentUser?.email;
        const resp = await fetch(
          `http://127.0.0.1:5000/checkUserRegistration?email=${email}`
        );
        const data = await resp.json();
        console.log(data);
        if (data === false) {
          setSubsciptionStatus("Subscribe");
        } else {
          setSubsciptionStatus("Unsubscribe");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    checkStatus();
  });
  return (
    <>
      <Modal size={['xs','xs','md',"md"]} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Heading margin="2% auto" size="xl" textAlign="center">
              {subsciptionStatus=="Subscribe"?"Join Our Weekly Mail Service":"See You Later :/"}
            </Heading>
            <Player
              autoplay
              loop
              src={subsciptionStatus=="Subscribe"?"/subscribe.json":"/unsubscribe.json"}
              style={{ height: "60%", width: "60%" }}
            />
          </ModalBody>
          <ModalFooter>
            <Flex justifyContent="center" alignItems="center" width="full">
              <Button
                variant="danger"
                size="lg"
                width="40%"
                borderRadius={5}
                onClick={handleRegistration}
              >
                {subsciptionStatus}
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ResetMailModal;
