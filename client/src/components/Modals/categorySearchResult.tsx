import { HStack, Icon, Text, Spacer } from "@chakra-ui/react";
import React, { useState, useContext } from "react";
import { FaBook, FaExternalLinkAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import ShowAlert from "../Alert/ShowAlert";
import { AuthContext } from "@/Providers/AuthProvider";

type Props = {
  categoryName: string;
  searchResults: string[];
};

const SearchResult = ({ searchResults, categoryName }: Props) => {
  const currentUser = useContext(AuthContext);
  const Router = useRouter();
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  return (
    <>
      <ShowAlert
        type="warning"
        message="Please login first"
        title=""
        isVisible={isAlertVisible}
        onClose={() => setIsAlertVisible(false)}
      />
      {searchResults.includes(categoryName) && (
        <HStack
          fontSize={["sm", "sm", "md", "md"]}
          width="90%"
          cursor="pointer"
          fontWeight="medium"
          _hover={{ bg: "teal.400", color: "white" }}
          borderRadius="md"
          bg="gray.100"
          padding={5}
          onClick={() => {
            if (currentUser?.email)
              Router.push(`/category/${categoryName}/best`);
            else setIsAlertVisible(true);
          }}
        >
          <Icon as={FaBook} marginRight={2} />
          <Text>{categoryName}</Text>
          <Spacer />
          <Icon as={FaExternalLinkAlt} />
        </HStack>
      )}
    </>
  );
};

export default SearchResult;
