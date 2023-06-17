import React from 'react'
import { useRouter } from 'next/router'
import {Box, Menu, MenuButton, MenuList, MenuItem, MenuDivider} from '@chakra-ui/react'
import { FaUser, FaChartLine, FaRegBookmark, FaRegClock, FaSignOutAlt} from "react-icons/fa";
import DisplayPhoto from './DisplayPhoto'
type Props = {
  handleSignOut:any
}
const MenuDropDown = ({handleSignOut}:Props) => {
  const Router = useRouter();
  return (
    <Box zIndex="500" >
    <Menu isLazy={true} strategy="fixed">
      <MenuButton
        as={DisplayPhoto}
        aria-label='Options'
      />
      <MenuList pl={2} pr={2}>
        <MenuItem as='a' icon={<FaUser/>} cursor="pointer" onClick={()=>Router.push('user/profile')}>
          Profile
        </MenuItem>
        <MenuItem as='a' icon={<FaRegBookmark/>} cursor="pointer" 
                                                    onClick={()=>Router.push('/user/bookmarks')}>
          Bookmarks
        </MenuItem >
        <MenuItem icon={<FaRegClock/>}>
          History
        </MenuItem>
        <MenuDivider mb={0}/>
        <MenuItem icon={<FaSignOutAlt/>} onClick={handleSignOut} 
        pt={2} pb={2} mb={0}>
          Log Out
        </MenuItem>
      </MenuList>
    </Menu>
  </Box>
  )
}

export default MenuDropDown