import { PACKAGE_CLASS, PACKAGE_STATUS, PACKAGE_TYPE } from "../consts";
import {
	acceptMailApi,
	getMailsApi,
	sendMailApi,
	payMailApi,
	cancelMailApi,
} from "../api";
import { filterMyMails } from "./utils/filterMyMails";
import { toValidMail } from "./utils/toValidMail";

const mail = {
	id: 0,
	track: "",
	sender: "",
	senderAddress: "",
	receiver: "",
	receiverAddress: "",
	packageType: PACKAGE_TYPE.LETTER,
	packageClass: PACKAGE_CLASS.FIRST,
	weight: 0,
	deliveryPrice: 0,
	valuePackage: 0,
	deliveryTime: 0,
	allPrice: 0,
	status: 0,
};

const SET_MAILS = "mails/SET_MAILS";
const ADD_MAIL = "mails/ADD_MAIL";
const CHANGE_STATUS_MAIL = "mails/CHANGE_STATUS_MAIL";
const TOGGLE_LOADING = "mails/TOGGLE_LOADING";
const RESET = "mails/RESET";

/**
 * @type {{isLoading: boolean, mails: Array<typeof mail>, unsubscribes: Array<Function>}}
 */
const initialState = {
	isLoading: false,
	mails: [],
};

/**
 *
 * @param {typeof initialState} state
 * @param {{type: string, payload: {}}} action
 * @returns {typeof initialState}
 *
 */
export const mailsReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case SET_MAILS: {
			return {
				...state,
				mails: payload.mails,
			};
		}
		case TOGGLE_LOADING: {
			return {
				...state,
				isLoading: payload.isLoading,
			};
		}
		case ADD_MAIL: {
			return {
				...state,
				mails: [...state.mails, payload.mail],
			};
		}
		case CHANGE_STATUS_MAIL: {
			return {
				...state,
				mails: state.mails.map((mail) =>
					mail.id === payload.mailId
						? { ...mail, status: payload.newStatus }
						: mail
				),
			};
		}
		case RESET: {
			return initialState;
		}
		default: {
			return state;
		}
	}
};

const setMailsAC = (mails) => {
	return {
		type: SET_MAILS,
		payload: {
			mails,
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

const addMailAC = (mail) => {
	return {
		type: ADD_MAIL,
		payload: {
			mail,
		},
	};
};

const changeStatusMailAC = (mailId, newStatus) => {
	return {
		type: CHANGE_STATUS_MAIL,
		payload: {
			mailId,
			newStatus,
		},
	};
};

export const resetMailsAC = () => {
	return {
		type: RESET,
	};
};

export const loadMailsThunk = () => {
	return async (dispatch, getState) => {
		const { address } = getState().auth;
		dispatch(toggleLoadingAC(true));
		const response = await getMailsApi();
		dispatch(setMailsAC(filterMyMails(response, address).map(toValidMail)));
		dispatch(toggleLoadingAC(false));
	};
};

export const sendMailThunk = (preMail) => {
	return async (dispatch) => {
		const mail = await sendMailApi(preMail);
		dispatch(addMailAC(toValidMail(mail)));
	};
};

export const acceptMailThunk = (id) => {
	return async (dispatch) => {
		await acceptMailApi(id);
		dispatch(changeStatusMailAC(id, PACKAGE_STATUS.ACCEPTED));
	};
};

export const payMailThunk = (id) => {
	return async (dispatch) => {
		await payMailApi(id);
		dispatch(changeStatusMailAC(id, PACKAGE_STATUS.DELIVERY));
	};
};

export const cancelMailThunk = (id) => {
	return async (dispatch) => {
		await cancelMailApi(id);
		dispatch(changeStatusMailAC(id, PACKAGE_STATUS.CANCELED));
	};
};
