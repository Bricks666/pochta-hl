"use strict";

const { Contract, Context } = require("fabric-contract-api");
const { UserList } = require("./Users");

class TransferList {
	constructor(ctx) {
		this.ctx = ctx;
		this.KEY = KEY;
	}
	async setTransfers(transfers) {
		const DataTransfers = Buffer.from(JSON.stringify(transfers));
		await this.ctx.stub.putState(this.KEY, DataTransfers);
	}
	async addTransfer(transfer) {
		const transfers = await this.getTransfers();
		transfers.push(transfer);
		await this.setTransfers(transfers);
	}
	async getTransfers() {
		const ListTransfers = await this.ctx.stub.getState(this.KEY);
		const transfers = JSON.parse(ListTransfers.toString());
		return transfers;
	}
	async getTransfer(id) {
		const transfers = await this.getTransfers();
		return transfers[id];
	}
	async setFinish(id, isFinish) {
		const transfers = await this.getTransfers();
		transfers[id].isFinish = isFinish;
		await this.setTransfers(transfers);
	}
}

class Transfer {
	static #id = 0;
	constructor(sender, receiver, money, liveTime) {
		this.id = Transfer.#id++;
		this.sender = sender;
		this.receiver = receiver;
		this.money = money;
		this.timeSend = Date.now();
		this.liveTime = liveTime;
		this.isFinish = false;
	}
}

class TransfersCTX extends Context {
	constructor() {
		super();
		this.transferList = new TransferList(this);
		this.userList = new UserList(this);
	}
}

class TransfersContract extends Contract {
	createContext() {
		return new TransfersCTX();
	}
	async initializationContract(ctx) {
		const transfers = [];
		await ctx.transferList.createTransfers(transfers);
		return transfers;
	}
	async getTransfers(ctx, login) {
		const transfers = await ctx.transferList.getTransfers();
		return transfers.filter(
			(transfer) => transfer.sender === login || transfer.receiver === login
		);
	}
	async addTransfer(ctx, sender, receiver, money, liveTime) {
		const transfer = new Transfer(sender, receiver, money, liveTime);
		await ctx.transferList.addTransfer(transfer);
		await ctx.userList.sendMoney(sender, money);
		return transfer;
	}
	async acceptTransfer(ctx, id, login) {
		const transfers = await ctx.transferList.getTransfers();
		if (transfers[id].isFinish) {
			return new Error();
		}
		if (transfers[id].receiver !== login) {
			return new Error();
		}
		await ctx.transferList.setFinish(id, true);
		await ctx.userList.getMoney(transfers[id].receiver, transfers[id].money);
		return transfers[id];
	}
	async cancelTransfer(ctx, id, login) {
		const transfers = await ctx.transferList.getTransfers();
		if (transfers[id].isFinish) {
			return new Error();
		}
		if (transfers[id].receiver !== login && transfers[id].sender !== login) {
			return new Error();
		}
		await ctx.transferList.setFinish(id, true);
		await ctx.userList.getMoney(transfers[id].receiver, transfers[id].money);
		return transfers[id];
	}
}

module.exports.TransfersContract = TransfersContract;
