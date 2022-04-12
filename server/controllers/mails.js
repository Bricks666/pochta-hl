const { MailsService } = require("../services");

module.exports = class MailsController {
	static async getMails(req, res, next) {
		try {
			const { user } = req.body;
			const mails = await MailsService.getMails();
			res.json({ mails });
		} catch (e) {
			next(e);
		}
	}
	static async addMail(req, res, next) {
		try {
			const { user, ...newMail } = req.body;
			const mail = await MailsService.addMail(user.login, newMail);
			res.json({ mail });
		} catch (e) {
			next(e);
		}
	}
	static async payMail(req, res, next) {
		try {
			const { user } = req.body;
			const { id } = req.params;
			await MailsService.payMail(user.login, id);
			res.json({ id });
		} catch (e) {
			next(e);
		}
	}
	static async acceptMail(req, res, next) {
		try {
			const { user } = req.body;
			const { id } = req.params;
			await MailsService.acceptMail(user.login, id);
			res.json({ id });
		} catch (e) {
			next(e);
		}
	}
	static async cancelMail(req, res, next) {
		try {
			const { user } = req.body;
			const { id } = req.params;
			await MailsService.cancelMail(user.login, id);
			res.json({ id });
		} catch (e) {
			next(e);
		}
	}
};
