const { CONTRACTS, TRANSACTIONS } = require("../configs");
const Fabric = require("./fabric");

module.exports = class UsersService {
	static #contract = CONTRACTS.USERS;
	static #transactions = TRANSACTIONS.USERS;
	static async getUsers(login) {
		return await Fabric.transaction(
			login,
			"org1",
			this.#contract,
			this.#transactions.GET_USERS
		);
	}
	static async getUser(login, user) {
		return await Fabric.transaction(
			login,
			"org1",
			this.#contract,
			this.#transactions.GET_USER,
			user
		);
	}
	static async upgradeToPostman(login, user, mailId) {
		return await Fabric.transaction(
			login,
			"org1",
			this.#contract,
			this.#transactions.ADD_POSTMAN,
			login,
			user,
			mailId
		);
	}
	static async deletePostman(login, user) {
		return await Fabric.transaction(
			login,
			"org1",
			this.#contract,
			this.#transactions.DEL_POSTMAN,
			login,
			user
		);
	}
	static async upgradeToAdmin(login, user) {
		return await Fabric.transaction(
			login,
			"org1",
			this.#contract,
			this.#transactions.ADD_ADMIN,
			login,
			user
		);
	}
	static async changeInfo(login, name, address) {
		return await Fabric.transaction(
			login,
			"org1",
			this.#contract,
			this.#transactions.CHANGE_INFO,
			login,
			name,
			address
		);
	}
};
