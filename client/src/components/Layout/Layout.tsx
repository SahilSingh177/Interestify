import React from 'react'
import Navbar from '../Navbar/Navbar'
import Blogs from '../Blogs/Blogs'

type Props = {}

const Layout = ({ children }: React.PropsWithChildren<Props>) => {
  return (
    <>
        <Navbar/>
        <Blogs/>
        {children}
    </>
  )
}

export default Layout
