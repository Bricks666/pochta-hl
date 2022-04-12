const { CONTRACTS, TRANSACTIONS } = require("../configs");
const Fabric = require("./fabric");

module.exports = class TransfersService {
	static #contract = CONTRACTS.TRANSFERS;
	static #transactions = TRANSACTIONS.TRANSFERS;
	static async getTransfers(login) {
		return await Fabric.transaction(
			login,
			"org1",
			this.#contract,
			this.#transactions.GET,
			login
		);
	}
	static async addTransfers(login, receiver, money, liveTime) {
		return await Fabric.transaction(
			login,
			"org1",
			this.#contract,
			this.#transactions.ADD,
			login,
			receiver,
			money,
			liveTime
		);
	}
	static async acceptTransfers(login, id) {
		return await Fabric.transaction(
			login,
			"org1",
			this.#contract,
			this.#transactions.ACCEPT,
			id,
			login
		);
	}
	static async cancelTransfers(login, id) {
		return await Fabric.transaction(
			login,
			"org1",
			this.#contract,
			this.#transactions.CANCEL,
			id,
			login
		);
	}
};
