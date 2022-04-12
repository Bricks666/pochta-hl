import { changeInfoApi, getMeApi } from "../api";
import { toValidUser } from "./utils/toValidUser";
import { LOGOUT } from "./auth";
/**
 * @type {{isLoading: boolean, info: typeof initialState}}
 */
const initialState = {
	isLoading: false,
	info: { name: "", role: 0, address: "", fio: "", acceptMail: false },
};

const SET_USER = "user/SET_USER";
const TOGGLE_LOADING = "user/TOGGLE_LOADING";

/**
 *
 * @param {typeof initialState} state
 * @param {ReturnType<typeof setUserAC | typeof toggleLoadingAC | typeof resetUserAC>} action
 * @returns
 */
export const userReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case SET_USER: {
			return {
				...state,
				info: payload.user,
			};
		}
		case TOGGLE_LOADING: {
			return {
				...state,
				isLoading: payload.isLoading,
			};
		}
		case LOGOUT: {
			return initialState;
		}
		default: {
			return state;
		}
	}
};

const setUserAC = (user) => {
	return {
		type: SET_USER,
		payload: {
			user,
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

export const loadUserThunk = () => {
	return async (dispatch) => {
		dispatch(toggleLoadingAC(true));
		const response = await getMeApi();
		dispatch(setUserAC(toValidUser(response)));
		dispatch(toggleLoadingAC(false));
	};
};

export const changeInfoThunk = (homeAddress, fio, acceptMail) => {
	return async (dispatch) => {
		const info = await changeInfoApi(homeAddress, fio, acceptMail);
		dispatch(setUserAC(toValidUser(info)));
	};
};
