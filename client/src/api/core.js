const user = {
	login: null,
	role: null,
};

const baseURL = "http://localhost:5000/";

/**
 *
 * @param {{url: string, body: {}, type: "POST" | "GET" | "PUT"|"DELETE"}} param0
 * @returns
 */
export const request = async ({ url, type = "GET", body = {} }) => {
	const response = await fetch({
		method: type,
		url: baseURL + url,
		body: { ...body, user },
	});
	debugger;
	if (response.ok) {
		return response.json();
	}

	throw new Error(response.statusText);
};

export const setCredentials = ({ login, role }) => {
	user.login = login;
	user.role = role;
};
