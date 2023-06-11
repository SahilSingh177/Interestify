import React from 'react'
import Navbar from '../Navbar/Navbar'
import Blogs from '../Blogs/Blogs'
import Banner from '../Navbar/Banner'

type Props = {}

const Layout = ({ children }: React.PropsWithChildren<Props>) => {
  return (
    <>
        <Navbar/>
        <Banner/>
        <Blogs/>
        {children}
    </>
  )
}

export default Layout
