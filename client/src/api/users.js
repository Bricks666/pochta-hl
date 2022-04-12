import { request } from "./core";

export const upgradeToAdminApi = async (user) => {
	return await request({
		url: `users/${user}/admin`,
		type: "POST",
	});
};

export const upgradeToPostmanApi = async (address, user) => {
	return await request({
		url: `users/${user}/postman`,
		type: "POST",
		body: {
			mailId: "hardcode mail id",
		},
	});
};

export const getUsersApi = async () => {
	return await request({
		url: "users",
		type: "GET",
	});
};

export const getMeApi = async () => {
	return await request({
		url: "users/me",
		type: "GET",
	});
};

export const changeInfoApi = async (address, name, acceptMail) => {
	return await request({
		url: "me/change",
		type: "POST",
		body: {
			address,
			name,
		},
	});
};
