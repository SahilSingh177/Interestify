import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/Providers/AuthProvider";
import {
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import SearchModal from "../Modals/SearchModal";
import { useBreakpointValue } from "@chakra-ui/react";

const SearchBar = () => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = () => {
      if (router.query.optionalParam !== router.asPath) {
        setIsModalOpen(false);
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  const currentUser = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!currentUser) return null;

  // Determine the display style based on screen size
  const displayStyle = useBreakpointValue({
    base: "searchIcon",
    md: "searchInput",
  });

  return (
    <>
      <SearchModal isOpen={isModalOpen} onClose={closeModal} />
      {displayStyle === "searchInput" && (
        <InputGroup
          bg="gray.50"
          height="6vh"
          marginRight="5vw"
          marginLeft="1vw"
          onClick={openModal}
        >
          <InputLeftElement pointerEvents="none" height="6vh">
            <Icon as={FaSearch} />
          </InputLeftElement>
          <Input
            height="6vh"
            borderColor={currentUser ? "gray.300" : "black"}
            focusBorderColor={currentUser ? "gray.300" : "black"}
            type="text"
            placeholder="Search Interestify"
            onChange={openModal}
            readOnly
          />
        </InputGroup>
      )}
      {displayStyle === "searchIcon" && (
        <Icon
          as={FaSearch}
          boxSize="3vh"
          marginRight="5vw"
          marginLeft="1vw"
          onClick={openModal}
        />
      )}
    </>
  );
};

export default SearchBar;
