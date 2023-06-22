import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react'
import { FaBolt, FaChartLine, FaEnvelope, FaRegBookmark, FaRegClock, FaSignOutAlt } from "react-icons/fa";
import DisplayPhoto from './DisplayPhoto'
import SignOutModal from '../Modals/SignOutModal';
import ResetMailModal from '../Modals/ResetMailModal';
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

  const openResetModal = () => {
    setIsResetModalOpen(true);
  };

  const closeResetModal = () => {
    setIsResetModalOpen(false);
  };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  return (
    <Box zIndex="500" >
      <SignOutModal isOpen={isModalOpen} onClose={closeModal} ></SignOutModal>
      <ResetMailModal isOpen={isResetModalOpen} onClose={closeResetModal} ></ResetMailModal>
      <Menu isLazy={true} strategy="fixed">
        <MenuButton
          as={DisplayPhoto}
          aria-label='Options'
        />
        <MenuList pl={2} pr={2}>
          <MenuItem as='a' icon={<FaChartLine />} cursor="pointer" onClick={() => router.push('/user/profile')}>
            Activity
          </MenuItem>
          <MenuItem as='a' icon={<FaRegBookmark />} cursor="pointer"
            onClick={() => router.push('/user/bookmarks')}>
            Bookmarks
          </MenuItem >
          <MenuItem icon={<FaRegClock />} as='a' cursor="pointer"
            onClick={() => router.push('/user/history')}>
            History
          </MenuItem>
          <MenuDivider mb={0} />
          <MenuItem as='a' icon={<FaBolt />} cursor="pointer"
            onClick={() => router.push('/welcome/categories')}>
            Reset Categories
          </MenuItem >
          <MenuItem icon={<FaEnvelope />} as='a' cursor="pointer" onClick={openResetModal}>
            Unsubscribe
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