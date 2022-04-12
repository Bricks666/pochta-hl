module.exports.PORT = 5000;
module.exports.CHANNEL = "mychannel";
module.exports.CHAINCODE = "pochta";
module.exports.CONTRACTS = {
	USERS: "UsersContract",
	TRANSFERS: "TransfersContract",
	PACKAGES: "PackagesContract",
};

module.exports.TRANSACTIONS = {
	USERS: {
		INIT: "initializationContract",
		GET_USER: "getUser",
		REG: "registration",
		GET_USERS: "getUsers",
		ADD_ADMIN: "addAdmin",
		ADD_POSTMAN: "addPostman",
		CHANGE_INFO: "changeInfo",
		DEL_POSTMAN: "delPostman",
		CHANGE_POST_INDEX: "changePostIndex",
	},
	TRANSFERS: {
		INIT: "initializationContract",
		GET: "getTransfers",
		ADD: "addTransfer",
		ACCEPT: "acceptTransfer",
		CANCEL: "cancelTransfer",
	},
	PACKAGES: {
		INIT: "initializationContract",
		GET: "getPackages",
		ADD: "addPackage",
		PAY: "payPackage",
		ACCEPT: "acceptPost",
		CANCEL: "cancelPackage",
		SOMETHING: "forRecieveMoneyOfDelivery",
	},
};

module.exports.ROLES = {
	USER: 0,
	POSTMAN: 1,
	ADMIN: 2,
	MAIN_ADMIN: 3,
};
