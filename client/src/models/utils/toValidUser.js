export const toValidUser = (user) => {
	return {
		address: user.login,
		role: +user.role,
		homeAddress: user.address,
		name: user.name,
		acceptMail: user.acceptMail,
		balance: user.balance,
	};
};
