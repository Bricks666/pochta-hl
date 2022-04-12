import { getUsersApi, upgradeToAdminApi, upgradeToPostmanApi } from "../api";
import { ROLES } from "../consts";
import { toValidUser } from "./utils/toValidUser";

const initialState = {
	isLoading: false,
	users: [],
	unsubscribes: [],
};

const SET_USERS = "users/SET_USERS";
const TOGGLE_LOADING = "users/TOGGLE_LOADING";
const ADD_USER = "users/ADD_USER";
const CHANGE_USER_INFO = "users/CHANGE_USER_INFO";
const SET_UNSUBSCRIBES = "users/SET_UNSUBSCRIBES";
const RESET = "users/RESET";

export const usersReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case SET_USERS: {
			return {
				...state,
				users: payload.users,
			};
		}
		case TOGGLE_LOADING: {
			return {
				...state,
				isLoading: payload.isLoading,
			};
		}
		case ADD_USER: {
			return {
				...state,
				users: [...state.users, payload.user],
			};
		}
		case CHANGE_USER_INFO: {
			const { info, address } = payload;
			return {
				...state,
				users: state.users.map((user) =>
					user.address === address ? { ...user, ...info } : user
				),
			};
		}
		case SET_UNSUBSCRIBES: {
			return {
				...state,
				unsubscribes: [...state.unsubscribes, ...payload.unsubscribes],
			};
		}
		case RESET: {
			state.unsubscribes.forEach((unsubscribe) => unsubscribe.unsubscribe());
			return initialState;
		}
		default: {
			return state;
		}
	}
};

const setUsersAC = (users) => {
	return {
		type: SET_USERS,
		payload: {
			users,
		},
	};
};
const toggleLoadingAC = (isLoading) => {
	return {
		type: TOGGLE_LOADING,
		payload: {
			isLoading,
		},
	};
};
const changeUserInfoAC = (address, info) => {
	return {
		type: CHANGE_USER_INFO,
		payload: {
			address,
			info,
		},
	};
};
export const resetUsersAC = () => {
	return {
		type: RESET,
	};
};

export const loadUsersThunk = () => {
	return async (dispatch) => {
		dispatch(toggleLoadingAC(true));
		const users = await getUsersApi();
		dispatch(setUsersAC(users.map(toValidUser)));
		dispatch(toggleLoadingAC(false));
	};
};

export const upgradeToAdminThunk = (user) => {
	return async (dispatch) => {
		await upgradeToAdminApi(user);
		dispatch(changeUserInfoAC(user, { role: ROLES.ADMIN }));
	};
};

export const upgradeToPostmanThunk = (user) => {
	return async (dispatch) => {
		await upgradeToPostmanApi(user);
		dispatch(changeUserInfoAC(user, { role: ROLES.POSTMAN }));
	};
};
