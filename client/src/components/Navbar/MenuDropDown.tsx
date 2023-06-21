import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react'
import { FaUser, FaRegBookmark, FaRegClock, FaSignOutAlt } from "react-icons/fa";
import DisplayPhoto from './DisplayPhoto'
import SignOutModal from '../Modals/SignOutModal';
type Props = {
  handleSignOut: any
}
const MenuDropDown = () => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = () => {
      if (router.query.optionalParam !== router.asPath) {
        setIsModalOpen(false);
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <Box zIndex="500" >
      <SignOutModal isOpen={isModalOpen} onClose={closeModal} ></SignOutModal>
      <Menu isLazy={true} strategy="fixed">
        <MenuButton
          as={DisplayPhoto}
          aria-label='Options'
        />
        <MenuList pl={2} pr={2}>
          <MenuItem as='a' icon={<FaUser />} cursor="pointer" onClick={() => router.push('http://localhost:3000/user/profile')}>
            Profile
          </MenuItem>
          <MenuItem as='a' icon={<FaRegBookmark />} cursor="pointer"
            onClick={() => router.push('http://localhost:3000/user/bookmarks')}>
            Bookmarks
          </MenuItem >
          <MenuItem icon={<FaRegClock />} as='a' cursor="pointer"
            onClick={() => router.push('http://localhost:3000/user/history')}>
            History
          </MenuItem>
          <MenuDivider mb={0} />
          <MenuItem icon={<FaSignOutAlt />} onClick={openModal}
            pt={2} pb={2} mb={0}>
            Log Out
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  )
}

export default MenuDropDown