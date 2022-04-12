const { CONTRACTS, TRANSACTIONS } = require("../configs");
const Fabric = require("./fabric");

module.exports = class MailsService {
	static #contract = CONTRACTS.PACKAGES;
	static #transactions = TRANSACTIONS.PACKAGES;
	static async getMails(login) {
		return await Fabric.transaction(
			login,
			"org1",
			this.#contract,
			TRANSACTIONS.PACKAGES.GET,
			login
		);
	}
	static async addMail(
		login,
		{
			sender,
			receiver,
			typPackage,
			packageClass,
			weight,
			deliveryPrice,
			valuePackage,
			deliveryTime,
			allPrice,
		}
	) {
		return await Fabric.transaction(
			login,
			"org1",
			this.#contract,
			this.#transactions.ADD,
			sender,
			receiver,
			typPackage,
			packageClass,
			weight,
			deliveryPrice,
			valuePackage,
			deliveryTime,
			allPrice
		);
	}
	static async payMail(login, id) {
		return await Fabric.transaction(
			login,
			"org1",
			this.#contract,
			this.#transactions.PAY,
			login,
			id
		);
	}
	static async acceptMail(login, id) {
		return await Fabric.transaction(
			login,
			"org1",
			this.#contract,
			this.#transactions.ACCEPT,
			login,
			id
		);
	}
	static async cancelMail(login, id) {
		return await Fabric.transaction(
			login,
			"org1",
			this.#contract,
			this.#transactions.CANCEL,
			login,
			id
		);
	}
};
