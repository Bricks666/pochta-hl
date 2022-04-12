const { TransfersService } = require("../services");

module.exports = class UsersTransfers {
	static async getTransfers(req, res, next) {
		try {
			const { user } = req.body;
			const transfers = await TransfersService.getTransfers(user.login);
			res.json({ transfers });
		} catch (e) {
			next(e);
		}
	}
	static async addTransfer(req, res, next) {
		try {
			const { user, receiver, money, liveTime } = req.body;
			const transfer = await TransfersService.addTransfers(
				user.login,
				receiver,
				money,
				liveTime
			);
			res.json({ transfer });
		} catch (e) {
			next(e);
		}
	}
	static async acceptTransfer(req, res, next) {
		try {
			const { user } = req.body;
			const { id } = req.params;
			await TransfersService.acceptTransfers(user.login, id);
			res.json({ transfers });
		} catch (e) {
			next(e);
		}
	}
	static async cancelTransfer(req, res, next) {
		try {
			const { user } = req.body;
			const { id } = req.params;
			await TransfersService.cancelTransfers(user.login, id);
			res.json({ transfers });
		} catch (e) {
			next(e);
		}
	}
};
