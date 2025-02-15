import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
	changePasswordStatusHandler,
	changeVerifyCodeHandler,
} from './../../Store/Slices/LoginSlice'

const VerificationCodeInput = ({ onChange }) => {
	const [code, setCode] = useState(['', '', '', ''])
	const inputsRef = useRef([])
	const dispatch = useDispatch()
	const status = useSelector(state => state.login.verifyCodeStatus)
	const passwordStatus = useSelector(state => state.login.changePasswordStatus)

	const handleChange = (index, value) => {
		const newCode = [...code]
		newCode[index] = value.slice(0, 1) // Ограничиваем ввод до одного символа
		setCode(newCode)
		onChange(newCode.join(''))
		// Переключаем фокус на следующий инпут
		if (value && index < 3) {
			inputsRef.current[index + 1].focus()
		}
	}

	const handleKeyDown = (event, index) => {
		if (event.key === 'Backspace' && code[index] === '') {
			if (index > 0) {
				inputsRef.current[index - 1].focus()
			}
		}
	}

	useEffect(() => {
		// Устанавливаем фокус на первый инпут при монтировании
		if (inputsRef.current[0]) {
			inputsRef.current[0].focus()
		}
	}, [])
	const handleSubmit = async event => {
		event.preventDefault() // Предотвращаем отправку формы
		const enteredCode = code.join('') // Объединяем код в строку

		// Отправляем код на сервер
		const response = await fetch('http://localhost:8080/verify-code', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ code: enteredCode }), // Отправляем код
		})

		const result = await response.json()
		if (result.valid) {
			setCode(['', '', '', ''])
			dispatch(changeVerifyCodeHandler(!status))
			dispatch(changePasswordStatusHandler(!passwordStatus))
		} else {
			toast.error('Код подтверждения неверный.')
		}
	}
	return (
		<form
			onSubmit={handleSubmit}
			className='flex w-1/3 p-10 mx-auto flex-col justify-center items-center gap-2'
			autoComplete='off'
			id='validate'
		>
			<h3 className='flex flex-col mb-3 text-center text-4xl font-extrabold text-dark-grey-900 w-full'>
				Введите код
			</h3>
			<div className='ver-form__inputs flex gap-2'>
				{code.map((value, index) => (
					<input
						key={index}
						ref={el => (inputsRef.current[index] = el)} // Сохраняем ссылку на каждый инпут
						type='text'
						value={value}
						onChange={e => handleChange(index, e.target.value)}
						onKeyDown={e => handleKeyDown(e, index)}
						className='inline-flex items-center justify-center bg-transparent border rounded-md border-gray-300 w-12 h-12 text-sm font-light text-center focus:outline-none focus:border-blue-500 text-black'
						maxLength={1} // Ограничиваем длину ввода до 1 символа
					/>
				))}
			</div>
			<button className='w-1/2 px-6 py-5 text-sm font-bold leading-none text-white transition duration-300 rounded-2xl hover:bg-blue-600 focus:ring-4 focus:ring-purple-blue-100 mt-5 bg-purple-blue-500'>
				Отправить
			</button>
		</form>
	)
}

export default VerificationCodeInput
