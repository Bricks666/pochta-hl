import { request } from "./core";

export const getTransfersApi = async () => {
	return await request({
		url: "transfers",
		type: "GET",
	});
};

export const sendTransferApi = async (receiver, value, liveTime) => {
	return await request({
		url: "transfers/add",
		type: "PUT",
		body: {
			receiver,
			value,
			liveTime,
		},
	});
};

export const acceptTransferApi = async (id) => {
	return await request({
		url: `transfer/${id}/accept`,
		type: "POST",
	});
};

export const cancelTransferApi = async (id) => {
	return await request({
		url: `transfer/${id}/cancel`,
		type: "POST",
	});
};
