
const { Contract, Context } = require("fabric-contract-api");
const { UserList } = require("./Users");

class PackageList {
	constructor(ctx) {
		this.ctx = ctx;
		this.KEY = "packages";
	}
	async setPackages(packages) {
		const DataPackages = Buffer.from(JSON.stringify(packages));
		await this.ctx.stub.putState(this.KEY, DataPackages);
	}
	async addPackage(onePackage) {
		const packages = await this.getPackages();
		packages.push(onePackage);
		await this.setPackages(packages);
	}
	async getPackages() {
		const ListPackages = await this.ctx.stub.getState(this.KEY);
		const packages = JSON.parse(ListPackages.toString());
		return packages;
	}
	async getPackage(id) {
		const packages = await this.getPackages();
		return packages[id];
	}
	async changeStatusPackage(id, nameStatus) {
		const packages = await this.getPackages();
		packages[id].status = nameStatus;
		await this.setPackages(packages);
	}
}

const PACKAGE_STATUS = {
	WAIT_FOR_PAY: 0,
	DELIVERY: 1,
	CANCELED: 2,
	ACCEPTED: 3,
};

class Package {
	static #id = 0;
	constructor(
		sender,
		receiver,
		typePackage,
		classPackage,
		deliveryTime,
		deliveryPrice,
		weight,
		value,
		allPrice,
		senderAddress,
		recipientAddress
	) {
		const date = new Date();

		this.id = Package.#id++;
		this.timeSend = +date;
		this.trackNumber = "RR" + date.toLocaleDateString().replace(".", "");
		this.sender = sender;
		this.receiver = receiver;
		this.typePackage = typePackage;
		this.classPackage = classPackage;
		this.deliveryTime = deliveryTime;
		this.deliveryPrice = deliveryPrice;
		this.weight = weight;
		this.value = value;
		this.allPrice = allPrice;
		this.senderAddress = senderAddress;
		this.receiverAddress = recipientAddress;
		this.status = PACKAGE_STATUS.WAIT_FOR_PAY;
	}
}

class PackagesCTX extends Context {
	constructor() {
		super();
		this.packageList = new PackageList(this);
		this.userList = new UserList(this);
	}
}
class PackagesContract extends Contract {
	createContext() {
		return new PackagesCTX();
	}
	async initializationContract(ctx) {
		const packages = [];
		await ctx.packageList.setPackages(packages);
		return packages;
	}
	async getPackages(ctx, login) {
		const packages = await ctx.packageList.getPackagesByUser(login);
		return packages.filter(
			(pack) =>
				pack.sender === login ||
				(pack.receiver === login &&
					pack.status !== PACKAGE_STATUS.WAIT_FOR_PAY)
		);
	}
	async addPackage(
		ctx,
		sender,
		receiver,
		typePackage,
		packageClass,
		weight,
		deliveryPrice,
		valuePackage,
		deliveryTime,
		allPrice
	) {
		const users = await ctx.userList.getUsers();
		const pack = new Package(
			sender,
			receiver,
			typePackage,
			packageClass,
			deliveryTime,
			deliveryPrice,
			weight,
			valuePackage,
			allPrice,
			users[sender].address,
			users[receiver].address
		);
		await ctx.packageList.addPackage(pack);
		return pack;
	}
	async payPackage(ctx, login, id) {
		const packages = await ctx.packageList.getPackages();
		if (packages[id].status !== PACKAGE_STATUS.WAIT_FOR_PAY) {
		}
		await ctx.packageList.changeStatusPackage(id, PACKAGE_STATUS.DELIVERY);
		await ctx.userList.sendMoney(login, packages[id].allPrice);
		return packages[id];
	}
	async forRecieveMoneyOfDelivery(ctx, id) {
		//возврат денег если
		const packages = await ctx.packageList.getPackages();
		if (packages[id].status !== "Accepted") {
			if (packages[id].classPackage === 1) {
				await ctx.userList.getMoney(
					packages[id].loginSender,
					packages[id].deliveryPrice
				);
			}
			if (packages[id].classPackage === 2) {
				await ctx.userList.getMoney(
					packages[id].loginSender,
					packages[id].deliveryPrice / 2 + packages[id].value
				);
			}
			if (packages[id].classPackage === 3) {
				await ctx.userList.getMoney(
					packages[id].loginSender,
					packages[id].value
				);
			}
		}
	}
	async cancelPackage(ctx, id) {
		const packages = await ctx.packageList.getPackages();
		if (packages[id].status !== PACKAGE_STATUS.DELIVERY) {
			return new Error();
		}
		await ctx.packageList.changeStatusPackage(id, PACKAGE_STATUS.CANCELED);
		return packages[id];
	}
	async acceptPost(ctx, login, id) {
		const packages = await ctx.packageList.getPackages();
		if (packages[id].receiver !== login) {
			return new Error();
		}
		if (packages[id].status !== PACKAGE_STATUS.DELIVERY) {
			return new Error();
		}
		await ctx.packageList.changeStatusPackage(id, PACKAGE_STATUS.ACCEPTED);
		return packages[id];
	}
}

module.exports.PackagesContract = PackagesContract;
