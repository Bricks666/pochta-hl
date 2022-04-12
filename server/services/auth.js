const { CONTRACTS, TRANSACTIONS } = require("../configs");
const Fabric = require("./fabric");

module.exports = class AuthService {
	static #contract = CONTRACTS.USERS;
	static #transactions = TRANSACTIONS.USERS;
	static async login(login, org) {
		return await Fabric.transaction(
			login,
			org,
			this.#contract,
			this.#transactions.GET_USER,
			login
		);
	}
	static async registration(login, name, address) {
		return await Fabric.transaction(
			login,
			org,
			this.#contract,
			this.#transactions.REG,
			login,
			name,
			address
		);
	}
};
