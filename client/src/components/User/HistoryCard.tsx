import React, {useState, useContext} from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/Providers/AuthProvider";
import {
  Card,
  CardBody,
  Icon,
  Tag,
  VStack,
  HStack,
  Spacer,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";

type Props = {
  articleId: string;
  Author: string;
  Category: string | null;
  Title: string;
  link: string;
  date: string;
  rid: string;
  toBeDisplayed: boolean;
};

const HistoryCard = ({
  articleId,
  Author,
  Category,
  Title,
  link,
  date,
  rid,
  toBeDisplayed,
}: Props) => {
  const currentUser = useContext(AuthContext);
  const Router = useRouter();
  const handleClick = (articleId: string) => {
    Router.push(`/article/${articleId}`);
  };
  const [isDeleted, setIsDeleted] = useState<boolean>(false)
  const email = currentUser?.email;
  const deleteHistory = async () => {
    setIsDeleted(true);
    try {
      let response = await fetch(
        `http://127.0.0.1:5000/deletehistory?email=${email}&rid=${rid}`,
        { next: { revalidate: 60 } }
      );
      const bodyData = await response.json();
      const filteredData = bodyData.data;
    } catch (error) {
      console.error(error);
    }
  };
  return (
    !isDeleted && toBeDisplayed?
    <Card
      bg="white"
      direction={{ md: "row", sm: "column" }}
      overflow="hidden"
      size="md"
      marginBottom={5}
      width="80%"
    >
      <VStack width="full">
        <CardBody width="full">
          <HStack>
            <Heading
              size="md"
              width={["100%","100%","90%","90%"]}
              cursor="pointer"
              onClick={() => handleClick(articleId)}
            >
              {Title}
            </Heading>
            <Spacer />
            <Tag display={["none","none","block","block"]} size="sm" variant="solid" colorScheme="teal">
              {Category ? Category : "Unknown"}
            </Tag>
          </HStack>
          <HStack justifyContent="flex-end" width="full" mt={3}>
            <Link
              href={link}
              isExternal
              color="teal"
              cursor="pointer"
              _hover={{ textDecoration: "none" }}
            >
              Read Full Article Here
            </Link>
            <Spacer />
            <Text fontSize="sm" color="gray.500">
              By {Author}
            </Text>
          </HStack>
          <HStack mt={3}>
            <Text fontSize="md" color="gray.500" alignItems="end">
              Read on: {date}
            </Text>
            <Spacer />
            <Icon as={FaTrash} cursor="pointer" onClick={deleteHistory}/>
          </HStack>
        </CardBody>
      </VStack>
    </Card>: null
  );
};

export default HistoryCard;
