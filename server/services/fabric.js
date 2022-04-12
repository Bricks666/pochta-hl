const { Wallets, Gateway } = require("fabric-network");
const { readFileSync } = require("fs");
const { CHANNEL, CHAINCODE } = require("../configs");
const { fromBuffer } = require("../utils");
const FabricCAServices = require("fabric-ca-client");

module.exports = class Fabric {
	static async transaction(login, org, contractName, transaction, ...args) {
		debugger;
		const gateway = await this.createGateway(login, org);
		const contract = (await gateway.getNetwork(CHANNEL)).getContract(
			CHAINCODE,
			contractName
		);

		const response = await contract.submitTransaction(transaction, ...args);
		gateway.disconnect();

		return fromBuffer(response);
	}
	static async createGateway(login, org) {
		const wallet = await this.createWallet(login, org);
		const gateway = new Gateway();
		const cp = this.getConnectionProfile(org);
		await gateway.connect(cp, {
			identity: login,
			discovery: {
				asLocalhost: true,
				enabled: true,
			},
			wallet,
		});

		return gateway;
	}
	static async createWallet(login, org) {
		return await Wallets.newFileSystemWallet(`./wallets/${org}/${login}`);
	}
	static getConnectionProfile(org) {
		console.log(process.cwd());
		return JSON.parse(readFileSync(`./gateway/connection-${org}.json`));
	}

	static async loginIdentity(login, password = "0000", org = "org1") {
		const ca = this.createCA(org);
		const enrollment = await ca.enroll({
			enrollmentID: login,
			enrollmentSecret: password,
		});

		const identity = this.createIdentity(org, enrollment);

		const wallet = await this.createWallet(login, org);

		await wallet.put(login, identity);
	}
	static async getAdmin(org) {
		const login = "admin";
		const wallet = await this.createWallet(login, org);
		const identity = await wallet.get(login);
		const provider = wallet.getProviderRegistry().getProvider(identity.type);

		return await provider.getUserContext(identity, login);
	}
	static async registerIdentity(login, password = "0000", org = "org1") {
		const admin = await this.getAdmin(org);
		const ca = this.createCA(org);
		await ca.register(
			{
				enrollmentID: login,
				enrollmentSecret: password,
				maxEnrollments: 2 ** 30,
			},
			admin
		);

		await this.loginIdentity(...arguments);
	}

	static createCA(org) {
		const cp = this.getConnectionProfile(org);

		const ca = cp.certificateAuthorities[`ca.${org}.example.com`];
		const rootTls = ca.tlsCACerts.pem;

		return new FabricCAServices(
			ca.url,
			{
				trustedRoots: rootTls,
				verify: false,
			},
			ca.caName
		);
	}
	static createIdentity(org, enrollment) {
		const mspId = org[0].toUpperCase() + org.slice(1) + "MPS";

		return {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			type: "X.509",
			mspId,
		};
	}
};
