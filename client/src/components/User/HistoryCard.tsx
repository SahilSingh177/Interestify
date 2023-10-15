import React, { useState, useContext, useMemo } from "react";
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
};

const HistoryCard = ({
  articleId,
  Author,
  Category,
  Title,
  link,
  date,
  rid,
}: Props) => {
  const colours = ["red", "orange", "yellow", "teal", "cyan", "purple", "pink"];
  const getRandomColour = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * colours.length);
    return colours[randomIndex];
  }, []);
  const currentUser = useContext(AuthContext);
  const Router = useRouter();
  const handleClick = (articleId: string) => {
    Router.push(`/article/${articleId}`);
  };
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const email = currentUser?.email;
  const deleteHistory = async () => {
    setIsDeleted(true);
    try {
      let response = await fetch(
        `https://nikhilranjan.pythonanywhere.com/deletehistory?email=${email}&rid=${rid}`,
        { next: { revalidate: 60 } }
      );
      const bodyData = await response.json();
      const filteredData = bodyData.data;
    } catch (error) {
      console.error(error);
    }
  };
  return !isDeleted ? (
    <Card
      bg="white"
      direction={{ md: "row", sm: "column" }}
      overflow="hidden"
      size="md"
      margin="auto"
      marginBottom={5}
      width={["90%","90%","90%","80%"]}
      style={{ WebkitTapHighlightColor: "rgba(0, 0, 0, 0)" }}
    >
      <VStack width="full">
        <CardBody width="full">
          <HStack>
            <Heading
              size={["sm", "md", "md", "md"]}
              width={["100%", "100%", "90%", "90%"]}
              cursor="pointer"
              onClick={() => handleClick(articleId)}
            >
              {Title}
            </Heading>
            <Spacer />
            <Tag
              display={["none", "none", "block", "block"]}
              size="sm"
              variant="solid"
              colorScheme={getRandomColour}
              height="fit-content"
              paddingTop={1}
              paddingBottom={1}
            >
              {Category ? Category : "Unknown"}
            </Tag>
          </HStack>
          <HStack
            justifyContent="flex-end"
            width="full"
            mt={3}
            fontSize={['sm','sm','sm','sm']}
          >
            <Link
              href={`/article/${articleId}`}
              isExternal
              color="teal"
              cursor="pointer"
              _hover={{ textDecoration: "none" }}
            >
              Read Full Article Here
            </Link>
            <Spacer />
            <Text color="gray.500">By {Author}</Text>
          </HStack>
          <HStack mt={3} fontSize={['sm','sm','sm','sm']}>
            <Text color="gray.500" alignItems="end">
              Read on: {date}
            </Text>
            <Spacer />
            <Icon as={FaTrash} cursor="pointer" onClick={deleteHistory} />
          </HStack>
        </CardBody>
      </VStack>
    </Card>
  ) : null;
};

export default HistoryCard;
