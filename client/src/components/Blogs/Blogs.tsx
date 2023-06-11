import React from 'react'
import Article from './Article'
import {Flex} from '@chakra-ui/react'

const Blogs:React.FC = ()=>{
    return <>
    <Flex flexDirection="column">
        <Article></Article>
        <Article></Article>
        <Article></Article>
    </Flex>
    </>
}

export default Blogs