const express = require("express");
const { PORT, CONTRACTS, TRANSACTIONS } = require("./configs");
const { routes } = require("./routes");
const Fabric = require("./services/fabric");

const app = express();

app.use(express.json(), routes);

app.listen(PORT, async () => {
	debugger;
	await Fabric.loginIdentity("admin", "adminpw");
  await Fabric.transaction("admin", "org1", CONTRACTS.PACKAGES, TRANSACTIONS.PACKAGES.INIT)
  // await Fabric.transaction("admin", "org1", CONTRACTS.TRANSFERS, TRANSACTIONS.TRANSFERS.INIT)
  // await Fabric.transaction("admin", "org1", CONTRACTS.USERS, TRANSACTIONS.USERS.INIT)

	// await Fabric.registerIdentity("superAdmin");
	// await Fabric.registerIdentity("postman");
	// await Fabric.registerIdentity("user");
});
