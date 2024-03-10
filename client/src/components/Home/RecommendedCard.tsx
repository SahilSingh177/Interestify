import { useRouter } from "next/router";
import {
  Card,
  CardBody,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { FaBook } from "react-icons/fa";

type Props = {
  articleId: string;
  Title: string;
  author: string;
};

const RecommendedCard: React.FC<Props> = ({
  articleId,
  Title,
  author,
}: Props) => {
  const Router = useRouter();

  return (
    <>
      <Card
        // bg={useColorModeValue('gray.50','#192734')}
        size="md"
        cursor="pointer"
        height="-moz-max-content"
        width="95%"
        mr="5%"
        // bg='gray.50'
      >
        <CardBody
          height="-moz-max-content"
          width="full"
          onClick={() => Router.push(`/article/${articleId}`)}
          // borderLeftWidth='2px'
          // borderLeftColor='teal.700'
        >
          <HStack width="100%">
            <Icon width="5%" as={FaBook} marginRight={2}></Icon>
            <VStack>
              <Text size="lg" fontSize="15px" color="teal.700" _hover={{textDecoration:'underline'}} fontWeight='semibold'>
                {Title ? Title : "Title"}
              </Text>

              <Text w="100%" fontSize="smaller" color="gray.500">
                By {author}
              </Text>
            </VStack>
          </HStack>
        </CardBody>
      </Card>
    </>
  );
};

export default RecommendedCard;
