import React from 'react'
import { CiCirclePlus } from 'react-icons/ci'
import './ProfileImg.css'

export default function ProfileImg({ user }) {
	return (
		<div className='user__page-img border-white border-[5px] w-48 ml-10 rounded-full overflow-hidden '>
			<div className='change__img hidden bg-gray-900/70 rounded-full absolute cursor-pointer left-0 top-0 w-full h-full text-center items-center justify-center text-white text-7xl'>
				<input type='file' className='opacity-0 cursor-pointer z-20' />
				<CiCirclePlus className='absolute left-[50%] -ml-[20%] top-[50%] -mt-[20%] z-10' />
			</div>
			<img
				className='default__profile-img w-48'
				src='https://img.freepik.com/free-vector/astronaut-playing-planet-ball-cartoon-vector-icon-illustration_138676-3477.jpg?t=st=1729020987~exp=1729024587~hmac=5d4e3f0ecc4986765dba29263f9ef87f0776241fc101f196948b035498c118e6&w=826'
				alt='user'
			/>
		</div>
	)
}
