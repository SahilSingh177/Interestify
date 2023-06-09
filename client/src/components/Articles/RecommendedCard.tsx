import { useRouter } from "next/router";
import {
    Card,
    CardBody,
    HStack,
    Icon,
    Text,
} from "@chakra-ui/react";
import { FaBook } from "react-icons/fa";

type Props = {
    articleId: string;
    Title: string;
};

const RecommendedCard: React.FC<Props> = ({
    articleId,
    Title,
}: Props) => {
    const Router = useRouter();

    return (
        <>

            <Card
                bg="gray.50"
                size="md"
                cursor="pointer"
                height='-moz-max-content'
                width='full'
            >
                <CardBody height='-moz-max-content' width="full" onClick={() => Router.push(`/article/${articleId}`)}>
                    <HStack width='100%'>
                    <Icon width='10%' as={FaBook} marginRight={2}></Icon>
                    <Text size="lg" color='teal.400'>
                        {Title ? Title : "Title"}
                    </Text>
                    </HStack>
                </CardBody>
            </Card>
        </>
    );
};

export default RecommendedCard;