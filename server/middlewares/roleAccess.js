module.exports = (...roles) => {
	return (req, res, next) => {
		try {
			const { user } = req.body;
			if (!user || !roles.includes(user.role)) {
				throw new Error();
			}
			next();
		} catch (e) {
			next(e);
		}
	};
};
