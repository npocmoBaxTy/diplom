import { createSlice } from '@reduxjs/toolkit'

const loginSlice = createSlice({
	name: 'login',
	initialState: {
		status: false,
		changePasswordStatus: false,
		verifyCodeStatus: false,
		changePassEmailStatus: true,
		curEmail: '',
		curUser: {},
	},
	reducers: {
		loggedIn: (state, action) => {
			state.status = action.payload
		},
		setCurEmail: (state, action) => {
			state.curEmail = action.payload
		},
		setCurUser: (state, action) => {
			state.curUser = action.payload
		},
		changePassEmailHandler: (state, action) => {
			state.changePassEmailStatus = action.payload
		},
		changePasswordStatusHandler: (state, action) => {
			state.changePass = action.payload
		},
		changeVerifyCodeHandler: (state, action) => {
			state.verifyCodeStatus = action.payload
		},
	},
})

export const {
	status,
	loggedIn,
	curEmail,
	curUser,
	setCurUser,
	setCurEmail,
	changePasswordStatus,
	verifyCodeStatus,
	changePassEmailStatus,
	changeVerifyCodeHandler,
	changePassEmailHandler,
	changePasswordStatusHandler,
} = loginSlice.actions

export default loginSlice.reducer
