import React from 'react'
import Head from 'next/head'

const Loading = () => {
	return (
		<>
			<Head>
				<link rel="stylesheet" href="/css/loading.css" />
			</Head>
			<div className='tetrominos' >
				<div className='tetromino box1'></div>
				<div className='tetromino box2'></div>
				<div className='tetromino box3'></div>
				<div className='tetromino box4'></div>
			</div>
		</>
	)
}

export default Loading