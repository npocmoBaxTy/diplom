import React from 'react'
import { CiHeart } from 'react-icons/ci'
import { TiMessage } from 'react-icons/ti'

export default function Commentary({ user }) {
	return (
		<div className='commentary-wrapper mt-10'>
			<div class='relative grid grid-cols-1 gap-4 p-4 mb-8 border rounded-lg bg-white shadow-lg w-1/3'>
				<div class='relative flex gap-4'>
					<img
						src='https://icons.iconarchive.com/icons/diversity-avatars/avatars/256/charlie-chaplin-icon.png'
						class='relative rounded-lg -top-8 -mb-4 bg-white border h-20 w-20'
						alt=''
						loading='lazy'
					/>
					<div class='flex flex-col w-full'>
						<div class='flex flex-row justify-between'>
							<p class='relative text-xl whitespace-nowrap truncate overflow-hidden'>
								{user.name}
							</p>
						</div>
						<p class='text-gray-400 text-sm'>20 April 2022, at 14:88 PM</p>
					</div>
				</div>
				<p class='-mt-4 text-gray-500'>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. <br />
					Maxime quisquam vero adipisci beatae voluptas dolor ame.
				</p>
				<div class='flex items-center gap-2'>
					<div className='like flex items-center gap-1'>
						<CiHeart />
						30
					</div>
					<div className='reply flex items-center gap-1'>
						<TiMessage />2
					</div>
				</div>
			</div>
		</div>
	)
}
