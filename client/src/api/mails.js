import { request } from "./core";

export const getMailsApi = async () => {
	return await request({
		url: "mails",
		type: "GET",
	});
};
export const sendMailApi = async ({
	sender,
	receiver,
	typePackage,
	packageClass,
	weight,
	deliveryPrice,
	deliveryTime,
	allPrice,
	valuePackage,
}) => {
	return await request({
		url: "mails/add",
		type: "PUT",
		body: {
			sender,
			receiver,
			typePackage,
			packageClass,
			weight,
			deliveryPrice,
			deliveryTime,
			allPrice,
			valuePackage,
		},
	});
};

export const acceptMailApi = async (id) => {
	return await request({
		url: `mails/${id}/accept`,
		type: "POST",
	});
};

export const payMailApi = async (id) => {
	return await request({
		url: `mails/${id}/pay`,
		type: "POST",
	});
};
export const cancelMailApi = async (id) => {
	return await request({
		url: `mails/${id}/cancel`,
		type: "POST",
	});
};
