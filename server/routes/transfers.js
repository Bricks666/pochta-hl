const { Router } = require("express");
const { TransfersController } = require("../controllers");

const routes = Router();

routes.get("/", TransfersController.getTransfers);
routes.put("/add", TransfersController.addTransfer);
routes.post("/:id/accept", TransfersController.acceptTransfer);
routes.post("/:id/cancel", TransfersController.cancelTransfer);

module.exports = routes;
