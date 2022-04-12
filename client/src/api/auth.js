import { request, setCredentials } from "./core";

export const loginApi = async (login) => {
	const user = await request({
		url: "auth/login",
		type: "POST",
		body: {
			login,
		},
	});

	setCredentials(user);
};

export const registrationApi = async (login, address, name) => {
	await request({
		url: "auth/registration",
		type: "PUT",
		body: {
			login,
			address,
			name,
		},
	});
};

export const logoutApi = async () => {
	setCredentials({ login: null, role: null });
};
