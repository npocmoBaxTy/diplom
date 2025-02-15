import axios from 'axios'
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
	changePassEmailHandler,
	changePasswordStatusHandler,
	changeVerifyCodeHandler,
} from '../../Store/Slices/LoginSlice'

export default function ChangePass({ email }) {
	const navigate = useNavigate()

	const [show, setShow] = useState(false)
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState('')
	const dispatch = useDispatch()
	const handleSubmit = async e => {
		e.preventDefault()

		if (newPassword !== confirmPassword) {
			setError('Пароли не совпадают')
			return
		}

		try {
			const response = await axios.post('http://localhost:8080/change-pass', {
				email,
				newPassword,
			})

			if (response.data.success) {
				alert('Пароль успешно изменен!')
				dispatch(changePassEmailHandler(true))
				dispatch(changePasswordStatusHandler(false))
				dispatch(changeVerifyCodeHandler(false))
				navigate('/signin', { replace: true })
				// Здесь вы можете перенаправить пользователя или показать другой компонент
			} else {
				setError('Не удалось изменить пароль')
			}
		} catch (err) {
			setError('Ошибка сервера. Пожалуйста, попробуйте позже.')
		}
	}
	return (
		<div className='change__pass-wrapper w-full p-10 flex flex-col items-center justify-center'>
			<h3 className='mb-4 text-xl text-gray-600'>Введите новый пароль</h3>
			<form
				onSubmit={handleSubmit}
				className='change__pass-form flex-col w-1/3 flex'
			>
				<div className='password-wrapper flex items-center relative'>
					<input
						id='password'
						required
						value={newPassword}
						onChange={e => setNewPassword(e.target.value)}
						type={show ? 'text' : 'password'}
						placeholder='Enter a password'
						className='flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl'
					/>
					<span
						className='absolute mb-5 right-5 cursor-pointer'
						onClick={() => setShow(!show)}
					>
						{show ? <FaEye /> : <FaEyeSlash />}
					</span>
				</div>
				<div className='password-wrapper flex items-center relative'>
					<input
						id='password2'
						required
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
						type={show ? 'text' : 'password'}
						placeholder='Enter a password'
						className='flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl'
					/>
					<span
						className='absolute mb-5 right-5 cursor-pointer'
						onClick={() => setShow(!show)}
					>
						{show ? <FaEye /> : <FaEyeSlash />}
					</span>
				</div>
				<button className='w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-blue-500'>
					Отправить
				</button>
			</form>
		</div>
	)
}
