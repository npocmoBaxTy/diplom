import React from 'react'
import { IoSearchOutline } from 'react-icons/io5'

export default function Search() {
	return (
		<div className='search__main search flex items-center relative ml-80'>
			<input
				id='password'
				type='text'
				name='password'
				required
				placeholder='Поиск...'
				className='flex items-center w-full md:w-96 px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-gray-100 text-dark-grey-900 rounded-2xl'
			/>
			<button className='absolute right-0 px-5 py-4 mr-2 text-sm font-medium outline-none placeholder:text-grey-70 text-dark-grey-900 rounded-2xl'>
				<IoSearchOutline />
			</button>
		</div>
	)
}
